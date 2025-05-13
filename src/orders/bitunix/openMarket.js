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

async function openMarketBitunix(symbol, side, amount) {
    try {
        // Создание маркет-ордера на Bitunix
        const order = await bitunix.createMarketOrder(symbol, side, {
            amount: amount
        });
        console.log('✅ Opened market order on Bitunix:', order);
        return order;
    } catch (e) {
        console.error('❌ Open Market Error on Bitunix:', e.message);
    }
}

module.exports = openMarketBitunix;
