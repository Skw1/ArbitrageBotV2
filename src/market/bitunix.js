const axios = require('axios');

async function getBitunixFuturesPrice(symbol) {
  try {
    const res = await axios.get(`https://fapi.bitunix.com/api/v1/futures/market/tickers?symbols=${symbol}`);
    const ticker = res.data.data?.find(item => item.symbol === symbol);
    if (!ticker) {
      console.error(`Symbol ${symbol} not found in response`);
      return null;
    }
    console.log('Full response:', ticker);
    return ticker.lastPrice;
  } catch (err) {
    console.error('Bitunix MarketPrice error:', err.message);
    return null;
  }
}

module.exports = getBitunixFuturesPrice;
