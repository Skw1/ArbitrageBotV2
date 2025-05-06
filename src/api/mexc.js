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
            // console.log('=== 📈 MEXC SPOT Order Book ===');
            // console.log('Bids:', data.bids);
            // console.log('Asks:', data.asks);
            return {
                bids: data.bids,
                asks: data.asks
            }
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
            return {
                bids: data.bids,
                asks: data.asks
            }
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


// MEXC Create Order
const ccxt = require('ccxt'); // библиотека cctx

const apiKey = 'YOUR_API_KEY'; // сюда нужно передавать Api ключ 
const secret = 'YOUR_SECRET'; // сюда нужно передавать Secret ключ

const exchange = new ccxt.mexc({
    apiKey,
    secret,
    enableRateLimit: true,
    options: {
        defaultType: 'swap' //  обязательно для фьючерсов
    }
});

async function createMEXCOrder(symbol, side, amount, price = null, type = 'market') {
    try {
        const market = await exchange.loadMarkets();
        const marketInfo = exchange.market(symbol);

        // Сторона: 'buy' → long, 'sell' → short
        const params = {
            positionSide: side === 'buy' ? 'long' : 'short' // опционально (нужно узнать)
        };

        let order;
        if (type === 'limit') {
            order = await exchange.createOrder(symbol, 'limit', side, amount, price, params);
        } else {
            order = await exchange.createOrder(symbol, 'market', side, amount, undefined, params);
        }

        console.log(`✅ ${side.toUpperCase()} order placed:`, order);
        return order;
    } catch (err) {
        console.error('❌ Ошибка создания ордера:', err.message, err);
    }
}

// Примеры вызова:
//createMEXCOrder('BTC/USDT:USDT', 'buy', 0.01);  // Long (market)
//createMEXCOrder('BTC/USDT:USDT', 'sell', 0.01); // Short (market)

// Узнать все символы для Futures
/*
(async () => {
    const markets = await exchange.loadMarkets();
    for (const symbol in markets) {
        if (markets[symbol].type === 'swap') {
            console.log(symbol);
        }
    }
})();
*/