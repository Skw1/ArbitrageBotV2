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

async function openMarketLBank(symbol, side, amount) {
    try {
        // Создание маркет-ордера на LBank
        const order = await lbank.createMarketOrder(symbol, side, {
            amount: amount
        });
        console.log('✅ Opened market order on LBank:', order);
        return order;
    } catch (e) {
        console.error('❌ Open Market Error on LBank:', e.message);
    }
}

module.exports = openMarketLBank;
