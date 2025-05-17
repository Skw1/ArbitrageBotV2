// Check Prices

// Parsing Prices Functions
const getMexcFuturesPrice = require('../market/mexc.js');
const getLBankFuturesPrice = require('../market/lbank.js');
const getKucoinFuturesPrice = require('../market/kucoin.js');
const getBitunixFuturesPrice = require('../market/bitunix.js');
const getBinanceFuturesPrice = require('../market/binance.js');
const getBybitFuturesPrice = require('../market/bybit.js');

// Open Market Order Functions
const openMarketMEXC = require('../orders/mexc/openMarket.js');
const openMarketLBank = require('../orders/lbank/openMarket.js');
const openMarketKuCoin = require('../orders/kucoin/openMarket.js');
const openMarketBitunix = require('../orders/bitunix/openMarket.js');
const openMarketBinance = require('../orders/binance/openMarket.js');

// Close Market Order Functions
const closeMarketMEXC = require('../orders/mexc/closeMarket.js');
const closeMarketLBank = require('../orders/lbank/closeMarket.js');
const closeMarketKuCoin = require('../orders/kucoin/closeMarket.js');
const closeMarketBitunix = require('../orders/bitunix/closeMarket.js');
const closeMarketBinance = require('../orders/binance/closeMarket.js');



module.exports = function checkPrices({
  platform1, platform2,
  marketPrice1, marketPrice2,
  arbitrageType,
  userSpread,
  orderType,
  symbol1,
  symbol2,
  amount,
}) {
  userSpread = (userSpread == null || isNaN(userSpread)) ? 2 : userSpread;
  let result = '';

  return new Promise((resolve) => {
    if (orderType.toLowerCase() !== 'market') {
      console.log('⚠️ Только маркет-ордера поддерживаются.');
      result += `⚠️ Только маркет-ордера поддерживаются.`;
      return resolve(result);
    }

    console.log(`📈 Arbitrage Type: ${arbitrageType.toUpperCase()}`);
    console.log(`Order Type: ${orderType.toUpperCase()}\n`);
    result +=`📈 Arbitrage Type: ${arbitrageType.toUpperCase()}<br><br>Order Type: ${orderType.toUpperCase()}<br>`;

    function calculateProfit(mp1Ask, mp1Bid, mp2Ask, mp2Bid) {
      const profit1 = (mp2Bid - mp1Ask) / mp1Ask * 100;
      const profit2 = (mp1Bid - mp2Ask) / mp2Ask * 100;
      return { profit1, profit2 };
    }

    async function openOrder(platform, symbol, action, amount) {
      const map = {
        MEXC: openMarketMEXC,
        LBANK: openMarketLBank,
        KUCOIN: openMarketKuCoin,
        BITUNIX: openMarketBitunix,
        BINANCE: openMarketBinance,
      };
      return map[platform]?.(symbol, action, amount);
    }

    async function closeOrder(platform, symbol, action, amount) {
      const map = {
        MEXC: closeMarketMEXC,
        LBANK: closeMarketLBank,
        KUCOIN: closeMarketKuCoin,
        BITUNIX: closeMarketBitunix,
        BINANCE: closeMarketBinance,
      };
      return map[platform]?.(symbol, action, amount);
    }

    console.log('⏱ Начинаем мониторинг спреда...\n');
    result += `⏱ Начинаем мониторинг спреда... <br>`;

    const intervalId = setInterval(async () => {
      try {
        if (!marketPrice1?.bestAskPrice || !marketPrice2?.bestAskPrice) {
          console.error('❌ Данные о ценах недоступны:', marketPrice1, marketPrice2);
          result +=`❌ Данные о ценах недоступны<br>`;
          clearInterval(intervalId);
          return resolve(result);
        }

        const mp1Ask = parseFloat(marketPrice1.bestAskPrice);
        const mp1Bid = parseFloat(marketPrice1.bestBidPrice);
        const mp2Ask = parseFloat(marketPrice2.bestAskPrice);
        const mp2Bid = parseFloat(marketPrice2.bestBidPrice);

        const { profit1, profit2 } = calculateProfit(mp1Ask, mp1Bid, mp2Ask, mp2Bid);

        console.log(`🔍 Спред ${platform1} → ${platform2}: ${profit1.toFixed(4)}%`);
        console.log(`🔍 Спред ${platform2} → ${platform1}: ${profit2.toFixed(4)}%\n`);
        result += `🔍 Спред ${platform1} → ${platform2}: ${profit1.toFixed(4)}% <br>`;
        result += `🔍 Спред ${platform2} → ${platform1}: ${profit2.toFixed(4)}%<br>`;

        if (profit1 >= userSpread) {
          console.log(`✅ Арбитраж найден! Покупаем на ${platform1} по ${mp1Ask}, продаем на ${platform2} по ${mp2Bid}`);
          result += `✅ Арбитраж найден! Покупаем на ${platform1} по ${mp1Ask}, продаем на ${platform2} по ${mp2Bid}<br>`;
          await openOrder(platform1, symbol1, 'buy', amount);
          await openOrder(platform2, symbol2, 'sell', amount);
          clearInterval(intervalId);

          monitorClose(
            () => parseFloat(marketPrice1.bestAskPrice) >= parseFloat(marketPrice2.bestBidPrice),
            async () => {
              await closeOrder(platform1, symbol1, 'sell', amount);
              await closeOrder(platform2, symbol2, 'buy', amount);
              console.log('✅ Позиции закрыты. Спред выровнялся.');
              result += `✅ Позиции закрыты. Спред выровнялся.<br>`;
              resolve(result);
            }
          );
        } else if (profit2 >= userSpread) {
          console.log(`✅ Арбитраж найден! Покупаем на ${platform2} по ${mp2Ask}, продаем на ${platform1} по ${mp1Bid}`);
          result += `✅ Арбитраж найден! Покупаем на ${platform2} по ${mp2Ask}, продаем на ${platform1} по ${mp1Bid}<br>`;
          await openOrder(platform2, symbol2, 'buy', amount);
          await openOrder(platform1, symbol1, 'sell', amount);
          clearInterval(intervalId);

          monitorClose(
            () => parseFloat(marketPrice1.bestBidPrice) <= parseFloat(marketPrice2.bestAskPrice),
            async () => {
              await closeOrder(platform1, symbol1, 'buy', amount);
              await closeOrder(platform2, symbol2, 'sell', amount);
              console.log('✅ Позиции закрыты. Спред выровнялся.');
              result += `✅ Позиции закрыты. Спред выровнялся.<br>`;
              resolve(result);
            }
          );
        } else {
          console.log(`❌ Недостаточный спред: максимум ${Math.max(profit1, profit2).toFixed(2)}%\n`);
          result += `❌ Недостаточный спред: максимум ${Math.max(profit1, profit2).toFixed(2)}%<br>`;
        }
      } catch (e) {
        console.error('❌ Ошибка при обновлении:', e.message);
        result += `❌ Ошибка при обновлении: ${e.message}<br>`;
        clearInterval(intervalId);
        resolve(result);
      }
    }, 3000);

    function monitorClose(conditionFn, closeFn) {
      const closeInterval = setInterval(async () => {
        try {
          if (conditionFn()) {
            clearInterval(closeInterval);
            await closeFn();
          }
        } catch (e) {
          console.error('❌ Ошибка в monitorClose:', e.message);
          result += `❌ Ошибка в monitorClose: ${e.message}<br>`;
          clearInterval(closeInterval);
          resolve(result);
        }
      }, 5000);
    }

    // Таймаут на максимальное ожидание 1 минута (чтобы не вешать Promise)
    setTimeout(() => {
      clearInterval(intervalId);
      result += `⏳ Время мониторинга истекло.<br>`;
      resolve(result);
    }, 6000);
  });
};