const ccxt = require('ccxt');

async function getKucoinPrice(symbol) { // symbol = 'BTC/USDT:USDT'
  const exchange = new ccxt.kucoinfutures(); // фьючерсы KuCoin
  try {
    await exchange.loadMarkets();
    const ticker = await exchange.fetchTicker(symbol);
    return ticker.last;
  } catch (err) {
    console.error('KuCoin error:', err.message);
    return null;
  }
}

module.exports = getKucoinPrice;
