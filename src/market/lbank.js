const ccxt = require('ccxt');

async function getLbankFuturesPrice(symbol = 'BTC/USDT') {
  const exchange = new ccxt.lbank2(); // LBank используется как `lbank2` в ccxt
  try {
    await exchange.loadMarkets();
    const ticker = await exchange.fetchTicker(symbol);
    return ticker.last;
  } catch (err) {
    console.error('LBank error:', err.message);
    return null;
  }
}

module.exports = {
  getLbankFuturesPrice,
};
