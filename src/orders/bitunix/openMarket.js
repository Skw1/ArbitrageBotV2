const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Загружаем настройки из .env
const envPath = path.resolve(__dirname, 'src', 'userData', '.env');
dotenv.config(envPath);

// Базовый URL для API Bitunix
const baseURL = 'https://api.bitunix.com/v1';

async function openMarketBitunix(symbol, side, amount) {
    try {
        // Параметры ордера
        const params = {
            apiKey: process.env.BITUNIX_ApiKey,
            secretKey: process.env.BITUNIX_SecretKey,
            symbol: symbol,
            side: side,  // buy or sell
            amount: amount,
            type: 'market',  // Тип ордера
        };

        // Создаем ордер на Bitunix
        const response = await axios.post(`${baseURL}/order`, null, { params });

        if (response.data.code === 200) {
            console.log('✅ Opened market order on Bitunix:', response.data);
            return response.data;
        } else {
            throw new Error(`Error creating order: ${response.data.message}`);
        }
    } catch (e) {
        console.error('❌ Open Market Error on Bitunix:', e.message);
    }
}
module.exports = openMarketBitunix;