const ccxt = require('ccxt');

const exchange = new ccxt.kucoin({
    apiKey: 'your_api_key', //
    secret: 'your_secret_key', // // Cюда передаем API ключ для KuCoin
    password: 'your_api_passphrase', // обязательный параметр для KuCoin, передавать торговый пароль 
    enableRateLimit: true,
    options: {
        defaultType: 'future'
    }
});

async function openMarketKucoin(symbol, side, amount) {
    const params = {
        leverage: 1,
    };

    try {
        const order = await exchange.createOrder(symbol, 'market', side, amount, undefined, params);
        console.log('✅ KuCoin Market Open:', order);
        return order;
    } catch (err) {
        console.error('❌ KuCoin Open Error:', err.message);
    }
}

module.exports = openMarketKucoin;
