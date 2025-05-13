const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Загружаем настройки из .env
const envPath = path.resolve(__dirname, 'src', 'userData', '.env');
dotenv.config(envPath);

async function closeMarketBitunix(symbol, side, amount) {
    try {
        // Параметры ордера для закрытия
        const oppositeSide = side === 'buy' ? 'sell' : 'buy';  // Противоположная сторона для закрытия
        const params = {
            apiKey: process.env.BITUNIX_ApiKey,
            secretKey: process.env.BITUNIX_SecretKey,
            symbol: symbol,
            side: oppositeSide,  // sell if buy and vice versa
            amount: amount,
            type: 'market',
        };

        // Закрываем ордер на Bitunix
        const response = await axios.post(`${baseURL}/order`, null, { params });

        if (response.data.code === 200) {
            console.log('✅ Closed market order on Bitunix:', response.data);
            return response.data;
        } else {
            throw new Error(`Error closing order: ${response.data.message}`);
        }
    } catch (e) {
        console.error('❌ Close Market Error on Bitunix:', e.message);
    }
}
module.exports = closeMarketBitunix;