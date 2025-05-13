const ccxt = require('ccxt');

const lbank = new ccxt.lbank({
    apiKey: 'your_api_key',  // Ваш API ключ для LBank
    secret: 'your_secret_key', // Ваш секретный ключ для LBank
    enableRateLimit: true,
});

async function openMarketLBank(symbol, side, amount) {
    try {
        // Создание маркет-ордера на LBank
        const order = await lbank.createMarketOrder(symbol, side, {
            amount: amount
        });
        console.log('✅ Opened market order on LBank:', order);
        return order;
    } catch (e) {
        console.error('❌ Open Market Error on LBank:', e.message);
    }
}

module.exports = openMarketLBank;
