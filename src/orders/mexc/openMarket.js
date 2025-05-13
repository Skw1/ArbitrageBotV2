const ccxt = require('ccxt');
const dotenv = require('dotenv');
const path = require('path');


const envPath = path.resolve(__dirname, '..', '..', 'userData', '.env');

dotenv.config({ path: envPath });

const mexc = new ccxt.mexc({
    apiKey: process.env.MEXC_ApiKey,
    secret: process.env.MEXC_SecretKey,
    enableRateLimit: true,
});

async function openMarketMexc(symbol, side, amount) {
    try {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            throw new Error(`❌ Invalid amount: ${amount}`);
        }

        console.log('Opening market order on MEXC:', { symbol, side, amount: parsedAmount });

        const order = await mexc.createMarketOrder(symbol, side, parsedAmount);
        console.log('✅ Opened market order on MEXC:', order);
        return order;
    } catch (e) {
        console.error('❌ Open Market Error on MEXC:', e.message);
    }
}

module.exports = openMarketMexc;
