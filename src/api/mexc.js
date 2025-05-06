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

/*
// MEXC Orders
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

// Пример Открытие позиции (long/short)
async function openLimitPosition(symbol, side, amount, price) {
    try {
        const params = {
            positionSide: side === 'buy' ? 'long' : 'short'
        };

        const order = await exchange.createOrder(
            symbol,
            'limit',      // Тип ордера
            side,         // buy или sell
            amount,       // Кол-во
            price,        // Цена (лимит)
            params
        );

        console.log(`✅ LIMIT ${side.toUpperCase()} order placed:`, order);
        return order;
    } catch (err) {
        console.error('❌ Ошибка размещения лимитного ордера:', err.message);
    }
}


// Пример Закрытие позиции (по маркету)
async function closePosition(symbol, side, amount) {
    try {
        const oppositeSide = side === 'buy' ? 'sell' : 'buy'; // Закрываем в противоположную сторону
        const params = {
            positionSide: side === 'buy' ? 'long' : 'short'
        };

        const order = await exchange.createOrder(
            symbol,
            'market',
            oppositeSide,
            amount,
            null,
            params
        );

        console.log(`✅ Position closed:`, order);
        return order;
    } catch (err) {
        console.error('❌ Ошибка закрытия позиции:', err.message);
    }
}

// Пример Получение открытых ордеров
async function getOpenOrders(symbol) {
    try {
        const orders = await exchange.fetchOpenOrders(symbol);
        console.log(`📋 Открытые ордера для ${symbol}:`);
        console.dir(orders, { depth: null });
        return orders;
    } catch (err) {
        console.error('❌ Ошибка получения открытых ордеров:', err.message);
    }
}

// Примеры вызова:
// Открыть LONG
//openPosition('BTC/USDT:USDT', 'buy', 0.01);

// Закрыть LONG (продать)
//closePosition('BTC/USDT:USDT', 'buy', 0.01);

// Получить открытые ордера
//getOpenOrders('BTC/USDT:USDT');



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
