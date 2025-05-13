const ccxt = require('ccxt');

const kucoin = new ccxt.kucoin({
    apiKey: 'your_api_key',
    secret: 'your_secret_key',
    password: 'your_api_passphrase',
    enableRateLimit: true,
});

async function closeMarketKuCoin(symbol, side, amount) {
    const oppositeSide = side === 'buy' ? 'sell' : 'buy';
    try {
        const order = await kucoin.createMarketOrder(symbol, oppositeSide, amount);
        console.log('✅ Closed market order on KuCoin:', order);
        return order;
    } catch (e) {
        console.error('❌ Close Market Error on KuCoin:', e.message);
    }
}

module.exports = closeMarketKuCoin;
