const ccxt = require('ccxt');

async function getKucoinFuturesPrice(symbol) {
  const exchange = new ccxt.kucoinfutures(); // KuCoin Futures
  try {
    await exchange.loadMarkets();

    // Проверка символа
    if (!exchange.markets[symbol]) {
      console.error(`Symbol ${symbol} not found on KuCoin Futures.`);
      return null;
    }

    // Получение ордербука
    const orderBook = await exchange.fetchOrderBook(symbol);
    const bestAskPrice = orderBook.asks[0] ? orderBook.asks[0][0] : null; // Цена продажи (ask)
    const bestBidPrice = orderBook.bids[0] ? orderBook.bids[0][0] : null; // Цена покупки (bid)

    if (!bestAskPrice || !bestBidPrice) {
      console.error('Нет доступных ордеров для символа', symbol);
      return null;
    }

    console.log('KuCoin Best Ask (цена продажи):', bestAskPrice);
    console.log('KuCoin Best Bid (цена покупки):', bestBidPrice);

    return {
      bestAskPrice,
      bestBidPrice
    };

  } catch (err) {
    console.error('KuCoin error:', err.message);
    return null;
  }
}

module.exports = {
  getKucoinFuturesPrice,
};
