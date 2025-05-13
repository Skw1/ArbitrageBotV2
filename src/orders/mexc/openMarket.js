const ccxt = require('ccxt');

const mexc = new ccxt.mexc({
    apiKey: 'your_api_key',
    secret: 'your_secret_key',
    options: { defaultType: 'swap' },
    enableRateLimit: true,
});

async function openMarketMEXC(symbol, side, amount) {
    try {
        const order = await mexc.createMarketOrder(symbol, side, amount);
        console.log('✅ Opened market order on MEXC:', order);
        return order;
    } catch (e) {
        console.error('❌ Open Market Error on MEXC:', e.message);
    }
}

module.exports = openMarketMEXC;
