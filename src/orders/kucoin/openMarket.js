const ccxt = require('ccxt');
const dotenv = require('dotenv')
const path = require('path')


const envPath = path.resolve(__dirname, '..', '..', 'userData', '.env');
dotenv.config({ path: envPath });

const kucoin = new ccxt.kucoin({
    apiKey: process.env.MEXC_ApiKey,
    secret: process.env.MEXC_SecretKey,
    passphrase: process.env.KUCOIN_Passphrase, 
    enableRateLimit: true,
});

async function openMarketKuCoin(symbol, side, amount) {
    try {
        // Создание маркет-ордера на KuCoin
        const order = await kucoin.createMarketOrder(symbol, side, {
            amount: amount
        });
        console.log('✅ Opened market order on KuCoin:', order);
        return order;
    } catch (e) {
        console.error('❌ Open Market Error on KuCoin:', e.message);
    }
}

module.exports = openMarketKuCoin;
