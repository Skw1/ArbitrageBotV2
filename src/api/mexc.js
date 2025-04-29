// MEXC Parsing

const axios = require('axios');

// MEXC Spot Order Book
async function getMEXCSpotOrderBook(symbol) {
    try {
        const res = await axios.get(`https://api.mexc.com/api/v3/depth`, {
            params: {
                symbol: symbol.toUpperCase(),
                limit: 5
            }
        });

        const data = res.data;
        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
            console.log('=== 📈 MEXC SPOT Order Book ===');
            console.log('Bids:', data.bids);
            console.log('Asks:', data.asks);
        } else {
            console.error('⚠️ Некорректный формат данных от MEXC Spot:', data);
        }
    } catch (err) {
        console.error('❌ MEXC Spot ошибка:', err.response?.status, err.response?.data, err.message);
    }
}

// MEXC Futures Order Book
async function getMEXCFuturesOrderBook(symbol) {
    try {
        const res = await axios.get(`https://contract.mexc.com/api/v1/contract/depth/${symbol}`);
        const data = res.data?.data;

        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
            console.log('=== 📈 MEXC FUTURES Order Book ===');
            console.log('Bids:', data.bids);
            console.log('Asks:', data.asks);
        } else {
            console.error('⚠️ Некорректный формат данных от MEXC Futures:', res.data);
        }
    } catch (err) {
        console.error('❌ MEXC Futures ошибка:', err.response?.status, err.response?.data, err.message);
    }
}

module.exports = {
    getMEXCSpotOrderBook,
    getMEXCFuturesOrderBook
};
