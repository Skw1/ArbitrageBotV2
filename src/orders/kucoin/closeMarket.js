const ccxt = require('ccxt');
const dotenv = require('dotenv')
const path = require('path')


const envPath = path.resolve(__dirname, '..', '..', 'userData', '.env');
dotenv.config({ path: envPath });

const kucoin = new ccxt.kucoin({
    apiKey: process.env.KUCOIN_ApiKey,
    secret: process.env.KUCOIN_SecretKey,
    password: process.env.KUCOIN_Passphrase,
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
