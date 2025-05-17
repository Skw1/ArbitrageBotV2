const ccxt = require('ccxt');

async function getBybitFuturesPrice(symbol) {
  const exchange = new ccxt.bybit({
    options: { defaultType: 'future' }, // Указываем работу с фьючерсами
  });

  try {
    await exchange.loadMarkets();

    if (!exchange.markets[symbol]) {
      console.error('Символ не найден на Bybit Futures:', symbol);
      return null;
    }

    const orderBook = await exchange.fetchOrderBook(symbol);

    const bestAskPrice = orderBook.asks[0] ? orderBook.asks[0][0] : null;
    const bestBidPrice = orderBook.bids[0] ? orderBook.bids[0][0] : null;

    if (!bestAskPrice || !bestBidPrice) {
      console.error('Нет доступных ордеров для символа', symbol);
      return null;
    }

    console.log('Лучшие цены для маркет ордера на Bybit Futures:');
    console.log('Bybit Best Ask (цена продажи):', bestAskPrice);
    console.log('Bybit Best Bid (цена покупки):', bestBidPrice);

    return {
      bestAskPrice,
      bestBidPrice,
    };

  } catch (err) {
    console.error('Ошибка при получении данных с Bybit Futures:', err.message);
    return null;
  }
}

module.exports = {
  getBybitFuturesPrice,
};
