const ccxt = require('ccxt');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, 'src', 'userData', '.env');
dotenv.config(envPath);

const bitunix = new ccxt.bitunix({
    apiKey: process.env.BITUNIX_ApiKey,
    secret: process.env.BITUNIX_SecretKey,
    enableRateLimit: true,
});

async function closeMarketBitunix(symbol, side, amount) {
    const oppositeSide = side === 'buy' ? 'sell' : 'buy';
    try {
        const order = await bitunix.createMarketOrder(symbol, oppositeSide, amount);
        console.log('✅ Closed market order on Bitunix:', order);
        return order;
    } catch (e) {
        console.error('❌ Close Market Error on Bitunix:', e.message);
    }
}

module.exports = closeMarketBitunix;
