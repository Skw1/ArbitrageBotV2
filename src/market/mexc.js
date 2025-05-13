const ccxt = require('ccxt');

async function getMexcFuturesPrice(symbol) { // Наприклад: 'AERGO/USDT'
  const exchange = new ccxt.mexc();
  try {
    await exchange.loadMarkets(); // Завантажуємо всі ринки
   // console.log('Доступні ринки:', Object.keys(exchange.markets)); // Логуємо доступні ринки

    if (!exchange.markets[symbol]) {
      console.error('Символ не знайдений на MEXC:', symbol);
      return null;
    }

    const ticker = await exchange.fetchTicker(symbol);
    console.log('Отриманий тикер:', ticker); // Логуємо тикер

    // Формуємо відповідь
    const response = {
      symbol: ticker.symbol,
      markPrice: ticker.info.markPrice || null,
      lastPrice: ticker.last,
      open: ticker.open || null,
      last: ticker.last,
      quoteVol: ticker.quoteVolume || null,
      baseVol: ticker.baseVolume || null,
      high: ticker.high || null,
      low: ticker.low || null
    };

    return response;
  } catch (err) {
    console.error('Помилка при отриманні даних з MEXC:', err.message);
    return null;
  }
}

module.exports = {
  getMexcFuturesPrice,
};
