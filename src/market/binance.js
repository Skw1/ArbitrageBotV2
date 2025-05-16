const ccxt = require('ccxt');

async function getBinanceFuturesPrice(symbol) {
  const exchange = new ccxt.binance({
    options: { defaultType: 'future' }, // Работать с фьючерсами
  });

  try {
    await exchange.loadMarkets();

    if (!exchange.markets[symbol]) {
      console.error('Символ не найден на Binance Futures:', symbol);
      return null;
    }

    const orderBook = await exchange.fetchOrderBook(symbol);

    const bestAskPrice = orderBook.asks[0] ? orderBook.asks[0][0] : null;
    const bestBidPrice = orderBook.bids[0] ? orderBook.bids[0][0] : null;

    if (!bestAskPrice || !bestBidPrice) {
      console.error('Нет доступных ордеров для символа', symbol);
      return null;
    }

    console.log('Лучшие цены для маркет ордера на Binance Futures:');
    console.log('Binance Best Ask (цена продажи):', bestAskPrice);
    console.log('Binance Best Bid (цена покупки):', bestBidPrice);

    return {
      bestAskPrice,
      bestBidPrice,
    };

  } catch (err) {
    console.error('Ошибка при получении данных с Binance Futures:', err.message);
    return null;
  }
}

module.exports = {
  getBinanceFuturesPrice,
};
