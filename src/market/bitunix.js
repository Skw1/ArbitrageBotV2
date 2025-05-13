const axios = require('axios');

async function getBitunixFuturesPrice(symbol) {
  try {
    // Преобразуем символ в формат, который использует Bitunix (без '/')
    //const bitunixSymbol = symbol.replace('/', '').toUpperCase();

    // URL для получения данных по тикерам для фьючерсных рынков
    const url = `https://fapi.bitunix.com/api/v1/futures/market/tickers?symbols=${symbol}`;
    const response = await axios.get(url);

    // Логирование ответа для отладки
    //console.log('Response from Bitunix API:', response.data);
    
    // Проверяем, что в ответе есть нужный символ
    if (!response.data || !response.data.data || response.data.data[0].symbol !== symbol) {
      console.error(`Нет данных для символа ${symbol}`);
      return null;
    }

    const orderBook = response.data.data[0];

    // Получаем маркерную цену (markPrice) как лучшую цену
    const bestAskPrice = orderBook.markPrice || null;
    const bestBidPrice = orderBook.lastPrice || null; 

    if (!bestAskPrice || !bestBidPrice) {
      console.error('Нет доступных ордеров для символа', symbol);
      return null;
    }

    console.log('Bitunix Best Ask (цена продажи):', bestAskPrice);
    console.log('Bitunix Best Bid (цена покупки):', bestBidPrice);

    return {
      bestAskPrice,
      bestBidPrice
    };
  } catch (err) {
    console.error('Bitunix error:', err.message);
    return null;
  }
}

module.exports = {
  getBitunixFuturesPrice,
};
