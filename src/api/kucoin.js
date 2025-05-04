const axios = require('axios');

// Получить книгу ордеров KuCoin Spot
async function getKucoinSpotOrderBook(symbol) {
    try {
        const endpoint = `https://api.kucoin.com/api/v1/market/orderbook/level2_100?symbol=${symbol}`;
        const res = await axios.get(endpoint);
        const data = res.data?.data;

        console.log("KuCoin Spot Response:", res.data); // Логируем ответ от KuCoin API для Spot

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

// Получить книгу ордеров KuCoin Futures
async function getKucoinFuturesOrderBook(symbol) {
    try {
        const endpoint = `https://api-futures.kucoin.com/api/v1/level2/depth20?symbol=${symbol}`;
        const res = await axios.get(endpoint);
        
        console.log("KuCoin Futures Response:", res.data); // Логируем ответ от KuCoin API для Futures

        if (res.data?.code !== '200000') {
            console.error(`⚠️ Ошибка KuCoin Futures API: ${res.data.msg}`, res.data);
            return null;
        }

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

// Пример вызова (Работает)
/*
getKucoinSpotOrderBook('BTC-USDT').then(console.log);
getKucoinFuturesOrderBook('XBTUSDM').then(console.log);
*/

module.exports = {
    getKucoinSpotOrderBook,
    getKucoinFuturesOrderBook
};

// Через бота не работает