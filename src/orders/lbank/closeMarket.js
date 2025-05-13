const ccxt = require('ccxt');

const lbank = new ccxt.lbank({
    apiKey: 'your_api_key',
    secret: 'your_secret_key',
    enableRateLimit: true,
});

async function closeMarketLBank(symbol, side, amount) {
    const oppositeSide = side === 'buy' ? 'sell' : 'buy';
    try {
        const order = await lbank.createMarketOrder(symbol, oppositeSide, amount);
        console.log('✅ Closed market order on LBank:', order);
        return order;
    } catch (e) {
        console.error('❌ Close Market Error on LBank:', e.message);
    }
}

module.exports = closeMarketLBank;
