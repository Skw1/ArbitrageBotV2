const ccxt = require('ccxt');
const dotenv = require('dotenv')
const path = require('path')


const envPath = path.resolve(__dirname, '..', '..', 'userData', '.env');
dotenv.config({ path: envPath });

const lbank = new ccxt.lbank({
    apiKey: process.env.LBANK_ApiKey,
    secret: process.env.LBANK_SecretKey,
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
