const ccxt = require('ccxt');

const exchange = new ccxt.mexc({
    apiKey: 'your_api_key', // Cюда передаем API ключ для MEXC
    secret: 'your_secret_key', // Cюда передаем Secret ключ для MEXC
    options: { defaultType: 'swap' },
    enableRateLimit: true,
});

async function closeMarketMexc(symbol, side, amount) {
    const opposite = side === 'buy' ? 'sell' : 'buy';
    const params = {
        positionSide: side === 'buy' ? 'long' : 'short',
    };

    try {
        const order = await exchange.createOrder(symbol, 'market', opposite, amount, undefined, params);
        console.log('✅ MEXC Market Close:', order);
        return order;
    } catch (e) {
        console.error('❌ MEXC Close Error:', e.message);
    }
}

module.exports = closeMarketMexc;
