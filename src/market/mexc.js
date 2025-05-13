const ccxt = require('ccxt');

async function getMexcFuturesPrice(symbol) { 
  const exchange = new ccxt.mexc();
  try {
    await exchange.loadMarkets(); // Загружаем все рынки

    if (!exchange.markets[symbol]) {
      console.error('Символ не найден на MEXC:', symbol);
      return null;
    }

    const orderBook = await exchange.fetchOrderBook(symbol);
    
    // Получаем лучшую цену для покупки (best ask) и продажи (best bid)
    const bestAskPrice = orderBook.asks[0] ? orderBook.asks[0][0] : null; // Цена продажи
    const bestBidPrice = orderBook.bids[0] ? orderBook.bids[0][0] : null; // Цена покупки
    
    if (!bestAskPrice || !bestBidPrice) {
      console.error('Нет доступных ордеров для символа', symbol);
      return null;
    }

    console.log('Лучшие цены для маркет ордера:');
    console.log('MEXC Best Ask (цена продажи):', bestAskPrice);
    console.log('MEXC Best Bid (цена покупки):', bestBidPrice);
    
    // Вы можете выбрать, какую цену использовать в зависимости от того, хотите ли вы купить или продать
    return {
      bestAskPrice,
      bestBidPrice
    };

  } catch (err) {
    console.error('Ошибка при получении данных с MEXC:', err.message);
    return null;
  }
}

module.exports = {
  getMexcFuturesPrice,
};
