const axios = require('axios');

async function getBitunixPrice(symbol = 'BTCUSDT') {
  try {
    const res = await axios.get(`https://api.bitunix.com/api/v1/contract/quote/ticker/24hr?symbol=${symbol}`);
    return res.data.data.lastPrice;
  } catch (err) {
    console.error('Bitunix error:', err.message);
    return null;
  }
}

module.exports = getBitunixPrice;
