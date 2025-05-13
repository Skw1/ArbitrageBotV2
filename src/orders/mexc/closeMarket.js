const ccxt = require('ccxt');

const mexc = new ccxt.mexc({
    apiKey: 'your_api_key',
    secret: 'your_secret_key',
    options: { defaultType: 'swap' },
    enableRateLimit: true,
});

async function closeMarketMEXC(symbol, side, amount) {
    const oppositeSide = side === 'buy' ? 'sell' : 'buy';
    try {
        const order = await mexc.createMarketOrder(symbol, oppositeSide, amount);
        console.log('✅ Closed market order on MEXC:', order);
        return order;
    } catch (e) {
        console.error('❌ Close Market Error on MEXC:', e.message);
    }
}

module.exports = closeMarketMEXC;
