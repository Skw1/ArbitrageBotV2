const axios = require('axios');

//  KuCoin Spot
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


// KuCoin Futures Order Book
async function getKucoinFuturesOrderBook(symbol) {
    try {
        const endpoint = `https://api-futures.kucoin.com/api/v1/level2/depth20?symbol=${symbol}`;
        
        console.log(`Запрос к API KuCoin Futures: ${endpoint}`); // Логируем запрос для отладки
        
        const res = await axios.get(endpoint);

        // Логируем полный ответ от API
        console.log("KuCoin Futures Response:", res.data);

        // Проверка на наличие кода успеха
        if (res.data?.code !== '200000') {
            console.error(`⚠️ Ошибка KuCoin Futures API: ${res.data.msg}`);
            return null;
        }

        const data = res.data?.data;

        // Проверка на наличие данных и их корректность
        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
            console.log('=== 📈 KuCoin Futures Order Book ===');
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
        // Логируем детальную ошибку, если что-то пошло не так
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

