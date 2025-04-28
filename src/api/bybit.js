// BYBIT Parsing

// Bybit Spot Order Book
async function getBybitSpotOrderBook(symbol) {
    try {
        const endpoint = `https://api.bybit.com/spot/v3/public/quote/depth?symbol=${symbol}&limit=5`;
        const res = await axios.get(endpoint);
        const data = res.data?.result;

        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
            return {
                bids: data.bids,
                asks: data.asks,
                timestamp: Date.now()
            };
        } else {
            console.error('⚠️ Некорректный формат данных от Bybit Spot:', res.data);
            return null;
        }
    } catch (err) {
        console.error("❌ Bybit Spot error:", err.response?.status, err.response?.data, err.message);
        return null;
    }
}

// Bybit Futures Order Book
async function getBybitFuturesOrderBook(symbol) {
    try {
        const endpoint = `https://api.bybit.com/v5/market/orderbook?category=linear&symbol=${symbol}&limit=5`;
        const res = await axios.get(endpoint);
        const data = res.data?.result;

        if (data && Array.isArray(data.b) && Array.isArray(data.a)) {
            return {
                bids: data.b,
                asks: data.a,
                timestamp: Date.now()
            };
        } else {
            console.error('⚠️ Некорректный формат данных от Bybit Futures:', res.data);
            return null;
        }
    } catch (err) {
        console.error("❌ Bybit Futures error:", err.response?.status, err.response?.data, err.message);
        return null;
    }
}

module.exports = {
    getBybitSpotOrderBook,
    getBybitFuturesOrderBook
};
