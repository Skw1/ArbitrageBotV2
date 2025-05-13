const ccxt = require('ccxt');
const dotenv = require('dotenv')
const path = require('path')


const envPath = path.resolve(__dirname, 'src', 'userData', '.env');
dotenv.config(envPath)

const mexc = new ccxt.mexc({
    apiKey: process.env.MEXC_ApiKey,
    secret: process.env.MEXC_SecretKey,
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
