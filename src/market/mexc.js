const ccxt = require('ccxt');

async function getMexcPrice(symbol = 'BTC/USDT') {
  const exchange = new ccxt.mexc();
  try {
    await exchange.loadMarkets();
    const market = exchange.market(symbol);
    const ticker = await exchange.fetchTicker(symbol);
    return ticker.last;
  } catch (err) {
    console.error('MEXC error:', err.message);
    return null;
  }
}

module.exports = getMexcPrice;
