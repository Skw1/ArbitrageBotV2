// BITUNIX Parsing

const axios = require('axios');

// Bitunix Spot Order Book
async function getBitunixSpotOrderBook(symbol) {
    try {
        const endpoint = `https://api.bitunix.com/open/api/market_depth?symbol=${symbol}&size=5`;
        const res = await axios.get(endpoint);
        const data = res.data?.data;

        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
            return {
                bids: data.bids,
                asks: data.asks,
                timestamp: Date.now()
            };
        } else {
            console.error('⚠️ Некорректный формат данных от Bitunix Spot:', res.data);
            return null;
        }
    } catch (err) {
        console.error("❌ Bitunix Spot error:", err.response?.status, err.response?.data, err.message);
        return null;
    }
}

// Bitunix Futures Order Book
async function getBitunixFuturesOrderBook(symbol) {
    try {
        const endpoint = `https://api.bitunix.com/futures/open/api/market_depth?symbol=${symbol}&size=5`;
        const res = await axios.get(endpoint);
        const data = res.data?.data;

        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
            return {
                bids: data.bids,
                asks: data.asks,
                timestamp: Date.now()
            };
        } else {
            console.error('⚠️ Некорректный формат данных от Bitunix Futures:', res.data);
            return null;
        }
    } catch (err) {
        console.error("❌ Bitunix Futures error:", err.response?.status, err.response?.data, err.message);
        return null;
    }
}

module.exports = {
    getBitunixSpotOrderBook,
    getBitunixFuturesOrderBook
};
