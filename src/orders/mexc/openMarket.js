const ccxt = require('ccxt');

const exchange = new ccxt.mexc({
    apiKey: 'your_api_key', // Cюда передаем API ключ для MEXC
    secret: 'your_secret_key', // Cюда передаем Secret ключ для MEXC
    options: { defaultType: 'swap' },
    enableRateLimit: true,
});

async function openMarketMexc(symbol, side, amount) {
    const params = {
        positionSide: side === 'buy' ? 'long' : 'short',
        leverage: 1,
    };

    try {
        const order = await exchange.createOrder(symbol, 'market', side, amount, undefined, params);
        console.log('✅ MEXC Market Open:', order);
        return order;
    } catch (e) {
        console.error('❌ MEXC Open Error:', e.message);
    }
}

module.exports = openMarketMexc;
