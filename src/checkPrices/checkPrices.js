// Check Prices

// Parsing Prices Functions
const { getMexcFuturesPrice } = require('../market/mexc.js');
const { getLBankFuturesPrice } = require('../market/lbank.js');
const { getKucoinFuturesPrice } = require('../market/kucoin.js');
const { getBitunixFuturesPrice } = require('../market/bitunix.js');
const { getBinanceFuturesPrice } = require('../market/binance.js');
const { getBybitFuturesPrice } = require('../market/bybit.js');

// Open Market Order Functions
const openMarketMEXC = require('../orders/mexc/openMarket.js');
const openMarketLBank = require('../orders/lbank/openMarket.js');
const openMarketKuCoin = require('../orders/kucoin/openMarket.js');
const openMarketBitunix = require('../orders/bitunix/openMarket.js');
const openMarketBinance = require('../orders/binance/openMarket.js');
const openMarketBybit = require('../orders/bybit/openMarket.js');

// Close Market Order Functions
const closeMarketMEXC = require('../orders/mexc/closeMarket.js');
const closeMarketLBank = require('../orders/lbank/closeMarket.js');
const closeMarketKuCoin = require('../orders/kucoin/closeMarket.js');
const closeMarketBitunix = require('../orders/bitunix/closeMarket.js');
const closeMarketBinance = require('../orders/binance/closeMarket.js');
const closeMarketBybit = require('../orders/bybit/closeMarket.js');

module.exports = async function checkPrices({
  platform1, platform2,
  arbitrageType,
  userSpread,
  orderType,
  symbol1,
  symbol2,
  amount,
  resultDiv 
}) {
  userSpread = (userSpread == null || isNaN(userSpread)) ? 2 : userSpread;
  let result = '';
  let isTradeOpen = false;
  let monitoringActive = true;

  // Map platform names to price functions - Fixed to use properly imported functions
  const priceMap = {
    MEXC: getMexcFuturesPrice,
    LBANK: getLBankFuturesPrice,
    KUCOIN: getKucoinFuturesPrice,
    BITUNIX: getBitunixFuturesPrice,
    BINANCE: getBinanceFuturesPrice,
    BYBIT: getBybitFuturesPrice,
  };

  if (orderType.toLowerCase() !== 'market') {
    console.log('⚠️ Только маркет-ордера поддерживаются.');
    result += `⚠️ Только маркет-ордера поддерживаются.<br>`;
    updateResultDiv(result);
    return result;
  }

  console.log(`📈 Arbitrage Type: ${arbitrageType.toUpperCase()}`);
  console.log(`Order Type: ${orderType.toUpperCase()}\n`);
  result += `📈 Arbitrage Type: ${arbitrageType.toUpperCase()}<br>Order Type: ${orderType.toUpperCase()}<br><br>`;
  updateResultDiv(result);

  function updateResultDiv(content) {
    if (resultDiv) {
      resultDiv.innerHTML = content;
      resultDiv.scrollTop = resultDiv.scrollHeight;
    }
  }

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
      BYBIT: openMarketBybit,
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
      BYBIT: closeMarketBybit,
    };
    return map[platform]?.(symbol, action, amount);
  }

  // Fetch fresh prices from both platforms
  async function fetchPrices() {
    try {
      const priceFunction1 = priceMap[platform1.toUpperCase()];
      const priceFunction2 = priceMap[platform2.toUpperCase()];

      if (!priceFunction1 || !priceFunction2) {
        throw new Error(`Unsupported platform: ${platform1} or ${platform2}`);
      }

      console.log(`🔍 Fetching prices for ${platform1.toUpperCase()} (${symbol1}) and ${platform2.toUpperCase()} (${symbol2})`);

      const [marketPrice1, marketPrice2] = await Promise.all([
        priceFunction1(symbol1),
        priceFunction2(symbol2)
      ]);

      console.log('Raw price data:', { marketPrice1, marketPrice2 });

      return {
        mp1Ask: parseFloat(marketPrice1.bestAskPrice),
        mp1Bid: parseFloat(marketPrice1.bestBidPrice),
        mp2Ask: parseFloat(marketPrice2.bestAskPrice),
        mp2Bid: parseFloat(marketPrice2.bestBidPrice),
      };
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  }

  // Function to pause for N ms
  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function monitorClose(conditionFn, closeFn, timeout = 60000, interval = 3000) {
    const start = Date.now();
    const timeoutLog = `🕐 Начинаем мониторинг закрытия позиций (таймаут: ${timeout/1000}с)`;
    console.log(timeoutLog);
    result += timeoutLog + '<br>';
    updateResultDiv(result);

    while (monitoringActive) {
      if (Date.now() - start > timeout) {
        const timeoutMsg = '⏳ Время мониторинга истекло.';
        console.log(timeoutMsg);
        result += timeoutMsg + '<br>';
        updateResultDiv(result);
        break;
      }

      try {
        if (await conditionFn()) {
          await closeFn();
          const closeMsg = '✅ Позиции закрыты. Спред выровнялся.';
          console.log(closeMsg);
          result += closeMsg + '<br>';
          updateResultDiv(result);
          isTradeOpen = false;
          break;
        }
      } catch (error) {
        const errorMsg = `❌ Ошибка при мониторинге закрытия: ${error.message}`;
        console.error(errorMsg);
        result += errorMsg + '<br>';
        updateResultDiv(result);
      }

      await delay(interval);
    }
  }

  async function monitorSpread() {
    let cycleCount = 0;
    
    while (monitoringActive) {
      try {
        cycleCount++;
        const timestamp = new Date().toLocaleTimeString();
        
        // Add cycle separator for readability
        if (cycleCount > 1) {
          result += '<br>---<br>';
        }
        
        const cycleLog = `🔄 Цикл #${cycleCount} - ${timestamp}`;
        console.log(cycleLog);
        result += cycleLog + '<br>';
        updateResultDiv(result);

        const { mp1Ask, mp1Bid, mp2Ask, mp2Bid } = await fetchPrices();

        if (!mp1Ask || !mp2Ask) {
          const errorMsg = `❌ Данные о ценах недоступны: Platform1=${mp1Ask}, Platform2=${mp2Ask}`;
          console.error(errorMsg);
          result += errorMsg + '<br>';
          updateResultDiv(result);
          await delay(2000);
          continue;
        }

        // Display current prices
        const priceLog = `💰 ${platform1}: Ask=${mp1Ask.toFixed(4)}, Bid=${mp1Bid.toFixed(4)} | ${platform2}: Ask=${mp2Ask.toFixed(4)}, Bid=${mp2Bid.toFixed(4)}`;
        console.log(priceLog);
        result += priceLog + '<br>';

        const { profit1, profit2 } = calculateProfit(mp1Ask, mp1Bid, mp2Ask, mp2Bid);

        const spreadLog1 = `🔍 Спред ${platform1} → ${platform2}: ${profit1.toFixed(4)}%`;
        const spreadLog2 = `🔍 Спред ${platform2} → ${platform1}: ${profit2.toFixed(4)}%`;

        console.log(spreadLog1);
        console.log(spreadLog2);
        result += spreadLog1 + '<br>' + spreadLog2 + '<br>';

        // Only execute trades if no trade is currently open
        if (!isTradeOpen) {
          if (profit1 >= userSpread) {
            const arbLog = `✅ Арбитраж найден! Покупаем на ${platform1} по ${mp1Ask}, продаем на ${platform2} по ${mp2Bid}`;
            console.log(arbLog);
            result += arbLog + '<br>';
            updateResultDiv(result);

            isTradeOpen = true;
            
            try {
              await openOrder(platform1, symbol1, 'buy', amount);
              await openOrder(platform2, symbol2, 'sell', amount);

              await monitorClose(
                async () => {
                  const prices = await fetchPrices();
                  const currentSpread = (prices.mp2Bid - prices.mp1Ask) / prices.mp1Ask * 100;
                  const convergenceLog = `📊 Текущий спред для закрытия: ${currentSpread.toFixed(4)}%`;
                  console.log(convergenceLog);
                  result += convergenceLog + '<br>';
                  updateResultDiv(result);
                  return currentSpread <= 0.1; // Close when spread is minimal
                },
                async () => {
                  await closeOrder(platform1, symbol1, 'sell', amount);
                  await closeOrder(platform2, symbol2, 'buy', amount);
                }
              );
            } catch (error) {
              const orderErrorMsg = `❌ Ошибка при выполнении ордеров: ${error.message}`;
              console.error(orderErrorMsg);
              result += orderErrorMsg + '<br>';
              updateResultDiv(result);
              isTradeOpen = false;
            }
          } else if (profit2 >= userSpread) {
            const arbLog = `✅ Арбитраж найден! Покупаем на ${platform2} по ${mp2Ask}, продаем на ${platform1} по ${mp1Bid}`;
            console.log(arbLog);
            result += arbLog + '<br>';
            updateResultDiv(result);

            isTradeOpen = true;
            
            try {
              await openOrder(platform2, symbol2, 'buy', amount);
              await openOrder(platform1, symbol1, 'sell', amount);

              await monitorClose(
                async () => {
                  const prices = await fetchPrices();
                  const currentSpread = (prices.mp1Bid - prices.mp2Ask) / prices.mp2Ask * 100;
                  const convergenceLog = `📊 Текущий спред для закрытия: ${currentSpread.toFixed(4)}%`;
                  console.log(convergenceLog);
                  result += convergenceLog + '<br>';
                  updateResultDiv(result);
                  return currentSpread <= 0.1; // Close when spread is minimal
                },
                async () => {
                  await closeOrder(platform1, symbol1, 'buy', amount);
                  await closeOrder(platform2, symbol2, 'sell', amount);
                }
              );
            } catch (error) {
              const orderErrorMsg = `❌ Ошибка при выполнении ордеров: ${error.message}`;
              console.error(orderErrorMsg);
              result += orderErrorMsg + '<br>';
              updateResultDiv(result);
              isTradeOpen = false;
            }
          } else {
            const noArbLog = `❌ Недостаточный спред: максимум ${Math.max(profit1, profit2).toFixed(4)}% (требуется ${userSpread}%)`;
            console.log(noArbLog);
            result += noArbLog + '<br>';
          }
        } else {
          const waitingLog = `⏳ Ожидаем закрытия текущей позиции...`;
          console.log(waitingLog);
          result += waitingLog + '<br>';
        }

        updateResultDiv(result);

      } catch (e) {
        const errLog = `❌ Ошибка при обновлении: ${e.message}`;
        console.error(errLog);
        result += errLog + '<br>';
        updateResultDiv(result);
        
        // Don't break on errors, continue monitoring
        await delay(5000); // Wait a bit longer on errors
        continue;
      }

      // Wait 2 seconds before next check
      await delay(2000);
    }
  }

  // Start monitoring
  await monitorSpread();

  return result;
};