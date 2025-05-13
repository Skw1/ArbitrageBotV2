const ccxt = require('ccxt');

const kucoin = new ccxt.kucoin({
    apiKey: 'your_api_key',  // Ваш API ключ для KuCoin
    secret: 'your_secret_key', // Ваш секретный ключ для KuCoin
    passphrase: 'your_passphrase', // Пароль для API KuCoin
    enableRateLimit: true,
});

async function openMarketKuCoin(symbol, side, amount) {
    try {
        // Создание маркет-ордера на KuCoin
        const order = await kucoin.createMarketOrder(symbol, side, {
            amount: amount
        });
        console.log('✅ Opened market order on KuCoin:', order);
        return order;
    } catch (e) {
        console.error('❌ Open Market Error on KuCoin:', e.message);
    }
}

module.exports = openMarketKuCoin;
