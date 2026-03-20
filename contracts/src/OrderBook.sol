// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title OrderBook — On-chain limit order book for CatbondToken/USDC
/// @notice Price-time priority matching. Buy orders escrow USDC, sell orders
///         escrow CatbondTokens. Supports limit orders, market orders, and
///         partial fills. Price range: $0.00–$1.00 (0–1e6 USDC units).
///         Minimum tick: $0.01 (1e4 units).
contract OrderBook {
    using SafeERC20 for IERC20;

    struct Order {
        uint256 orderId;
        address maker;
        bool isBuy;
        uint256 price; // USDC per token (6 decimals, range 0–1e6)
        uint256 amount; // Token quantity (6 decimals)
        uint256 filled; // Amount already filled
        uint256 timestamp;
        bool cancelled;
    }

    IERC20 public immutable usdc;
    IERC20 public immutable catbondToken;
    uint256 public immutable marketId;

    uint256 public nextOrderId = 1;
    mapping(uint256 => Order) public orders;

    // Sorted order lists (simple arrays for v0.9 — fine for prototype)
    uint256[] public bidOrderIds; // Buy orders, sorted by price desc then time asc
    uint256[] public askOrderIds; // Sell orders, sorted by price asc then time asc

    uint256 public constant MIN_TICK = 1e4; // $0.01 minimum price increment
    uint256 public constant MAX_PRICE = 1e6; // $1.00 maximum price

    // Stats
    uint256 public lastTradePrice;
    uint256 public volume24h;
    uint256 public totalTrades;

    event OrderPlaced(
        uint256 indexed orderId, address indexed maker, bool isBuy, uint256 price, uint256 amount, uint256 timestamp
    );
    event OrderFilled(
        uint256 indexed orderId, address indexed taker, uint256 fillAmount, uint256 price, uint256 usdcAmount
    );
    event OrderCancelled(uint256 indexed orderId);
    event Trade(address indexed buyer, address indexed seller, uint256 price, uint256 amount, uint256 usdcAmount);

    constructor(address _usdc, address _catbondToken, uint256 _marketId) {
        usdc = IERC20(_usdc);
        catbondToken = IERC20(_catbondToken);
        marketId = _marketId;
    }

    // ─── Place orders ───────────────────────────────────────────

    /// @notice Place a limit order
    /// @param isBuy True for buy order, false for sell
    /// @param price USDC per token (6 decimals)
    /// @param amount Token quantity (6 decimals)
    function placeLimitOrder(bool isBuy, uint256 price, uint256 amount) external returns (uint256 orderId) {
        require(price > 0 && price <= MAX_PRICE, "Price out of range");
        require(price % MIN_TICK == 0, "Price must be multiple of tick");
        require(amount > 0, "Zero amount");

        // Escrow funds
        if (isBuy) {
            uint256 usdcRequired = (amount * price) / 1e6;
            require(usdcRequired > 0, "Order too small");
            usdc.safeTransferFrom(msg.sender, address(this), usdcRequired);
        } else {
            catbondToken.safeTransferFrom(msg.sender, address(this), amount);
        }

        orderId = nextOrderId++;
        orders[orderId] = Order({
            orderId: orderId,
            maker: msg.sender,
            isBuy: isBuy,
            price: price,
            amount: amount,
            filled: 0,
            timestamp: block.timestamp,
            cancelled: false
        });

        // Insert into sorted list
        if (isBuy) {
            _insertBid(orderId);
        } else {
            _insertAsk(orderId);
        }

        emit OrderPlaced(orderId, msg.sender, isBuy, price, amount, block.timestamp);

        // Try to match immediately
        _tryMatch(orderId);
    }

    /// @notice Cancel an open order
    function cancelOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.maker == msg.sender, "Not your order");
        require(!order.cancelled, "Already cancelled");
        require(order.filled < order.amount, "Fully filled");

        order.cancelled = true;
        uint256 remaining = order.amount - order.filled;

        // Return escrowed funds
        if (order.isBuy) {
            uint256 usdcReturn = (remaining * order.price) / 1e6;
            usdc.safeTransfer(msg.sender, usdcReturn);
        } else {
            catbondToken.safeTransfer(msg.sender, remaining);
        }

        emit OrderCancelled(orderId);
    }

    // ─── Market orders ──────────────────────────────────────────

    /// @notice Market buy — walks the ask book, filling cheapest asks first
    /// @param usdcAmount Maximum USDC to spend
    function marketBuy(uint256 usdcAmount) external returns (uint256 totalTokensBought) {
        require(usdcAmount > 0, "Zero amount");
        usdc.safeTransferFrom(msg.sender, address(this), usdcAmount);

        uint256 usdcRemaining = usdcAmount;

        for (uint256 i = 0; i < askOrderIds.length && usdcRemaining > 0; i++) {
            Order storage ask = orders[askOrderIds[i]];
            if (ask.cancelled || ask.filled >= ask.amount) continue;
            if (ask.maker == msg.sender) continue; // No self-trading

            uint256 askRemaining = ask.amount - ask.filled;
            uint256 usdcForFull = (askRemaining * ask.price) / 1e6;

            uint256 fillAmount;
            uint256 usdcUsed;

            if (usdcRemaining >= usdcForFull) {
                fillAmount = askRemaining;
                usdcUsed = usdcForFull;
            } else {
                fillAmount = (usdcRemaining * 1e6) / ask.price;
                usdcUsed = (fillAmount * ask.price) / 1e6;
            }

            if (fillAmount == 0) continue;

            ask.filled += fillAmount;
            usdcRemaining -= usdcUsed;
            totalTokensBought += fillAmount;

            // Send USDC to seller, tokens to buyer
            usdc.safeTransfer(ask.maker, usdcUsed);
            catbondToken.safeTransfer(msg.sender, fillAmount);

            lastTradePrice = ask.price;
            totalTrades++;

            emit OrderFilled(ask.orderId, msg.sender, fillAmount, ask.price, usdcUsed);
            emit Trade(msg.sender, ask.maker, ask.price, fillAmount, usdcUsed);
        }

        // Return unused USDC
        if (usdcRemaining > 0) {
            usdc.safeTransfer(msg.sender, usdcRemaining);
        }
    }

    /// @notice Market sell — walks the bid book, filling highest bids first
    /// @param tokenAmount Amount of CatbondTokens to sell
    function marketSell(uint256 tokenAmount) external returns (uint256 totalUsdcReceived) {
        require(tokenAmount > 0, "Zero amount");
        catbondToken.safeTransferFrom(msg.sender, address(this), tokenAmount);

        uint256 tokensRemaining = tokenAmount;

        for (uint256 i = 0; i < bidOrderIds.length && tokensRemaining > 0; i++) {
            Order storage bid = orders[bidOrderIds[i]];
            if (bid.cancelled || bid.filled >= bid.amount) continue;
            if (bid.maker == msg.sender) continue; // No self-trading

            uint256 bidRemaining = bid.amount - bid.filled;
            uint256 fillAmount = tokensRemaining >= bidRemaining ? bidRemaining : tokensRemaining;
            uint256 usdcAmount = (fillAmount * bid.price) / 1e6;

            if (fillAmount == 0) continue;

            bid.filled += fillAmount;
            tokensRemaining -= fillAmount;
            totalUsdcReceived += usdcAmount;

            // Send tokens to buyer, USDC to seller
            catbondToken.safeTransfer(bid.maker, fillAmount);
            usdc.safeTransfer(msg.sender, usdcAmount);

            lastTradePrice = bid.price;
            totalTrades++;

            emit OrderFilled(bid.orderId, msg.sender, fillAmount, bid.price, usdcAmount);
            emit Trade(bid.maker, msg.sender, bid.price, fillAmount, usdcAmount);
        }

        // Return unsold tokens
        if (tokensRemaining > 0) {
            catbondToken.safeTransfer(msg.sender, tokensRemaining);
        }
    }

    // ─── View functions ─────────────────────────────────────────

    /// @notice Get the best bid price
    function bestBid() external view returns (uint256) {
        for (uint256 i = 0; i < bidOrderIds.length; i++) {
            Order memory o = orders[bidOrderIds[i]];
            if (!o.cancelled && o.filled < o.amount) return o.price;
        }
        return 0;
    }

    /// @notice Get the best ask price
    function bestAsk() external view returns (uint256) {
        for (uint256 i = 0; i < askOrderIds.length; i++) {
            Order memory o = orders[askOrderIds[i]];
            if (!o.cancelled && o.filled < o.amount) return o.price;
        }
        return 0;
    }

    /// @notice Get order book depth (top N bids and asks)
    function getOrderBookDepth(uint256 depth)
        external
        view
        returns (uint256[] memory bidPrices, uint256[] memory bidAmounts, uint256[] memory askPrices, uint256[] memory askAmounts)
    {
        bidPrices = new uint256[](depth);
        bidAmounts = new uint256[](depth);
        askPrices = new uint256[](depth);
        askAmounts = new uint256[](depth);

        uint256 bidIdx = 0;
        for (uint256 i = 0; i < bidOrderIds.length && bidIdx < depth; i++) {
            Order memory o = orders[bidOrderIds[i]];
            if (!o.cancelled && o.filled < o.amount) {
                bidPrices[bidIdx] = o.price;
                bidAmounts[bidIdx] = o.amount - o.filled;
                bidIdx++;
            }
        }

        uint256 askIdx = 0;
        for (uint256 i = 0; i < askOrderIds.length && askIdx < depth; i++) {
            Order memory o = orders[askOrderIds[i]];
            if (!o.cancelled && o.filled < o.amount) {
                askPrices[askIdx] = o.price;
                askAmounts[askIdx] = o.amount - o.filled;
                askIdx++;
            }
        }
    }

    /// @notice Get a specific order
    function getOrder(uint256 orderId) external view returns (Order memory) {
        return orders[orderId];
    }

    /// @notice Total number of bid orders
    function bidCount() external view returns (uint256) {
        return bidOrderIds.length;
    }

    /// @notice Total number of ask orders
    function askCount() external view returns (uint256) {
        return askOrderIds.length;
    }

    // ─── Internal: matching ─────────────────────────────────────

    function _tryMatch(uint256 orderId) internal {
        Order storage order = orders[orderId];
        if (order.cancelled || order.filled >= order.amount) return;

        if (order.isBuy) {
            _matchBuyAgainstAsks(orderId);
        } else {
            _matchSellAgainstBids(orderId);
        }
    }

    function _matchBuyAgainstAsks(uint256 buyOrderId) internal {
        Order storage buy = orders[buyOrderId];

        for (uint256 i = 0; i < askOrderIds.length; i++) {
            if (buy.filled >= buy.amount) break;

            Order storage ask = orders[askOrderIds[i]];
            if (ask.cancelled || ask.filled >= ask.amount) continue;
            if (ask.maker == buy.maker) continue; // No self-trading
            if (ask.price > buy.price) break; // No match possible (asks are sorted asc)

            uint256 buyRemaining = buy.amount - buy.filled;
            uint256 askRemaining = ask.amount - ask.filled;
            uint256 fillAmount = buyRemaining < askRemaining ? buyRemaining : askRemaining;

            // Execute at ask price (price improvement for buyer)
            uint256 usdcAmount = (fillAmount * ask.price) / 1e6;

            buy.filled += fillAmount;
            ask.filled += fillAmount;

            // Send tokens to buyer, USDC to seller
            catbondToken.safeTransfer(buy.maker, fillAmount);
            usdc.safeTransfer(ask.maker, usdcAmount);

            // Refund price improvement to buyer
            uint256 buyerPaid = (fillAmount * buy.price) / 1e6;
            if (buyerPaid > usdcAmount) {
                usdc.safeTransfer(buy.maker, buyerPaid - usdcAmount);
            }

            lastTradePrice = ask.price;
            totalTrades++;

            emit OrderFilled(ask.orderId, buy.maker, fillAmount, ask.price, usdcAmount);
            emit OrderFilled(buy.orderId, ask.maker, fillAmount, ask.price, usdcAmount);
            emit Trade(buy.maker, ask.maker, ask.price, fillAmount, usdcAmount);
        }
    }

    function _matchSellAgainstBids(uint256 sellOrderId) internal {
        Order storage sell = orders[sellOrderId];

        for (uint256 i = 0; i < bidOrderIds.length; i++) {
            if (sell.filled >= sell.amount) break;

            Order storage bid = orders[bidOrderIds[i]];
            if (bid.cancelled || bid.filled >= bid.amount) continue;
            if (bid.maker == sell.maker) continue; // No self-trading
            if (bid.price < sell.price) break; // No match possible (bids sorted desc)

            uint256 sellRemaining = sell.amount - sell.filled;
            uint256 bidRemaining = bid.amount - bid.filled;
            uint256 fillAmount = sellRemaining < bidRemaining ? sellRemaining : bidRemaining;

            // Execute at bid price (price improvement for seller)
            uint256 usdcAmount = (fillAmount * bid.price) / 1e6;

            sell.filled += fillAmount;
            bid.filled += fillAmount;

            // Send USDC to seller, tokens to buyer
            usdc.safeTransfer(sell.maker, usdcAmount);
            catbondToken.safeTransfer(bid.maker, fillAmount);

            lastTradePrice = bid.price;
            totalTrades++;

            emit OrderFilled(bid.orderId, sell.maker, fillAmount, bid.price, usdcAmount);
            emit OrderFilled(sell.orderId, bid.maker, fillAmount, bid.price, usdcAmount);
            emit Trade(bid.maker, sell.maker, bid.price, fillAmount, usdcAmount);
        }
    }

    // ─── Internal: sorted insertion ─────────────────────────────

    function _insertBid(uint256 orderId) internal {
        Order memory newOrder = orders[orderId];
        uint256 insertAt = bidOrderIds.length;

        for (uint256 i = 0; i < bidOrderIds.length; i++) {
            Order memory existing = orders[bidOrderIds[i]];
            // Bids sorted: highest price first, then earliest timestamp
            if (newOrder.price > existing.price || (newOrder.price == existing.price && newOrder.timestamp < existing.timestamp)) {
                insertAt = i;
                break;
            }
        }

        bidOrderIds.push(0); // Extend array
        for (uint256 i = bidOrderIds.length - 1; i > insertAt; i--) {
            bidOrderIds[i] = bidOrderIds[i - 1];
        }
        bidOrderIds[insertAt] = orderId;
    }

    function _insertAsk(uint256 orderId) internal {
        Order memory newOrder = orders[orderId];
        uint256 insertAt = askOrderIds.length;

        for (uint256 i = 0; i < askOrderIds.length; i++) {
            Order memory existing = orders[askOrderIds[i]];
            // Asks sorted: lowest price first, then earliest timestamp
            if (newOrder.price < existing.price || (newOrder.price == existing.price && newOrder.timestamp < existing.timestamp)) {
                insertAt = i;
                break;
            }
        }

        askOrderIds.push(0); // Extend array
        for (uint256 i = askOrderIds.length - 1; i > insertAt; i--) {
            askOrderIds[i] = askOrderIds[i - 1];
        }
        askOrderIds[insertAt] = orderId;
    }
}
