const axios = require('axios');
const crypto = require('crypto');

const API_KEY = 'your_api_key'; // Cюда передаем API ключ для LBank
const SECRET_KEY = 'your_secret_key'; // Cюда передаем Secret ключ для LBank
const BASE_URL = 'https://api.lbank.info';

function getTimestamp() {
  return Date.now();
}

function sign(params, secretKey) {
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  return crypto.createHmac('sha256', secretKey).update(sortedParams).digest('hex');
}

async function closeMarketOrder(symbol, side, amount) {
  const endpoint = '/v2/futures/order/create';
  const timestamp = getTimestamp();

  const oppositeSide = side === 'buy' ? 'sell' : 'buy';

  const params = {
    api_key: API_KEY, // Cюда передаем API ключ для LBank
    symbol: symbol, // Cюда передаем Symbol
    side: oppositeSide, // 
    type: 'market',
    size: amount.toString(),
    timestamp: timestamp
  };

  params.sign = sign(params, SECRET_KEY); // Cюда передаем Secret ключ для LBank

  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, null, { params });
    console.log('✅ Закрытие позиции:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка при закрытии позиции:', error.response ? error.response.data : error.message);
  }
}

module.exports = closeMarketOrder;
