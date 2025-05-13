const ccxt = require('ccxt');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, 'src', 'userData', '.env');
dotenv.config(envPath);

const mexc = new ccxt.mexc({
    apiKey: process.env.MEXC_ApiKey,
    secret: process.env.MEXC_SecretKey,
    enableRateLimit: true,
});

async function openMarketMexc(symbol, side, amount) {
    try {
        // Добавим вывод параметров для отладки
        console.log('Opening market order on MEXC: ', { symbol, side, amount });

        // Создание маркет-ордера на MEXC
        const order = await mexc.createMarketOrder(symbol, side, {
            amount: amount,
        });
        console.log('✅ Opened market order on MEXC:', order);
        return order;
    } catch (e) {
        console.error('❌ Open Market Error on MEXC:', e.message);
    }
}

module.exports = openMarketMexc;
