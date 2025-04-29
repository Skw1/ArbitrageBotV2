// KUCOIN Parsing

const axios = require('axios');

// KuCoin Spot Order Book
async function getKucoinSpotOrderBook(symbol) {
    try {
        const endpoint = `https://api.kucoin.com/api/v1/market/orderbook/level2_100?symbol=${symbol}`;
        const res = await axios.get(endpoint);
        const data = res.data?.data;

        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
            return {
                bids: data.bids,
                asks: data.asks,
                timestamp: Date.now()
            };
        } else {
            console.error('⚠️ Некорректный формат данных от KuCoin Spot:', res.data);
            return null;
        }
    } catch (err) {
        console.error("❌ KuCoin Spot error:", err.response?.status, err.response?.data, err.message);
        return null;
    }
}

// KuCoin Futures Order Book
async function getKucoinFuturesOrderBook(symbol) {
    try {
        const endpoint = `https://api-futures.kucoin.com/api/v1/level2/depth100?symbol=${symbol}`;
        const res = await axios.get(endpoint);
        const data = res.data?.data;

        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
            return {
                bids: data.bids,
                asks: data.asks,
                timestamp: Date.now()
            };
        } else {
            console.error('⚠️ Некорректный формат данных от KuCoin Futures:', res.data);
            return null;
        }
    } catch (err) {
        console.error("❌ KuCoin Futures error:", err.response?.status, err.response?.data, err.message);
        return null;
    }
}

module.exports = {
    getKucoinSpotOrderBook,
    getKucoinFuturesOrderBook
};
