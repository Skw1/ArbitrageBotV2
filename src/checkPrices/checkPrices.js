const openMarketMEXC = require('../orders/mexc/openMarket.js');
const openMarketLBank = require('../orders/lbank/openMarket.js');
const openMarketKuCoin = require('../orders/kucoin/openMarket.js');
const openMarketBitunix = require('../orders/bitunix/openMarket.js');
const openMarketBinance = require('../orders/binance/openMarket.js');

const closeMarketMEXC = require('../orders/mexc/closeMarket.js');
const closeMarketLBank = require('../orders/lbank/closeMarket.js');
const closeMarketKuCoin = require('../orders/kucoin/closeMarket.js');
const closeMarketBitunix = require('../orders/bitunix/closeMarket.js');
const closeMarketBinance = require('../orders/binance/closeMarket.js');

module.exports = async function checkPrices({ 
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
    try {
        result += `📈 Arbitrage Type: ${arbitrageType.toUpperCase()}</br></br>Order Type: ${orderType.toUpperCase()}\n</br>`;

        function calculateProfit(mp1Ask, mp1Bid, mp2Ask, mp2Bid) {
            let profit1 = (mp2Bid - mp1Ask) / mp1Ask * 100;
            let profit2 = (mp1Bid - mp2Ask) / mp2Ask * 100;
            return { profit1, profit2 };
        }

        async function openOrder(platform, symbol, action, amount) {
            if (platform === 'MEXC') return openMarketMEXC(symbol, action, amount);
            if (platform === 'LBANK') return openMarketLBank(symbol, action, amount);
            if (platform === 'KUCOIN') return openMarketKuCoin(symbol, action, amount);
            if (platform === 'BITUNIX') return openMarketBitunix(symbol, action, amount);
            if (platform === 'BINANCE') return openMarketBinance(symbol, action, amount);
        }

        async function closeOrder(platform, symbol, action, amount) {
            if (platform === 'MEXC') return closeMarketMEXC(symbol, action, amount);
            if (platform === 'LBANK') return closeMarketLBank(symbol, action, amount);
            if (platform === 'KUCOIN') return closeMarketKuCoin(symbol, action, amount);
            if (platform === 'BITUNIX') return closeMarketBitunix(symbol, action, amount);
            if (platform === 'BINANCE') return closeMarketBinance(symbol, action, amount);
        }

        if (orderType.toLowerCase() !== 'market') {
            result += `</br>⚠️ Только маркет-ордера поддерживаются.\n</br>`;
            return result;
        }

        console.log('Начинаем мониторинг спреда...');

        const intervalId = setInterval(async () => {
            if (!marketPrice1 || !marketPrice2 || !marketPrice1.bestAskPrice || !marketPrice2.bestAskPrice) {
                console.error('Market data missing or incomplete:', marketPrice1, marketPrice2);
                result += '❌ Рыночные цены недоступны\n</br>';
                clearInterval(intervalId);
                return;
            }

            const mp1Ask = parseFloat(marketPrice1.bestAskPrice);
            const mp1Bid = parseFloat(marketPrice1.bestBidPrice);
            const mp2Ask = parseFloat(marketPrice2.bestAskPrice);
            const mp2Bid = parseFloat(marketPrice2.bestBidPrice);

            const { profit1, profit2 } = calculateProfit(mp1Ask, mp1Bid, mp2Ask, mp2Bid);

            // Выводим текущий спред в консоль
            console.log(`Текущий спред: ${profit1.toFixed(4)}% (первый вариант), ${profit2.toFixed(4)}% (второй вариант)`);

            // Добавим в результат тоже, если надо
            result += `</br>🔍 Текущий спред:</br> ${platform1}→${platform2}: ${profit1.toFixed(4)}% </br> ${platform2}→${platform1}: ${profit2.toFixed(4)}% </br>`;

            if (profit1 >= userSpread) {
                result += `</br>✅ Возможность арбитража:</br> Купить на ${platform1} по ${mp1Ask}, Продать на ${platform2} по ${mp2Bid}, Профит: ${profit1.toFixed(2)}%\n`;
                await openOrder(platform1, symbol1, 'buy', amount);
                await openOrder(platform2, symbol2, 'sell', amount);
                clearInterval(intervalId);

                // Ждем выравнивания цен для закрытия ордеров
                const closeIntervalId = setInterval(async () => {
                    const updatedMp1Ask = parseFloat(marketPrice1.bestAskPrice);
                    const updatedMp2Bid = parseFloat(marketPrice2.bestBidPrice);

                    if (updatedMp1Ask >= updatedMp2Bid) {  // логика может быть чуть проще или иначе
                        await closeOrder(platform1, symbol1, 'sell', amount);
                        await closeOrder(platform2, symbol2, 'buy', amount);
                        console.log(`✅ Позиции закрыты, спред выровнялся.`);
                        clearInterval(closeIntervalId);
                    }
                }, 5000);

            } else if (profit2 >= userSpread) {
                result += `</br>✅ Возможность арбитража:</br> Купить на ${platform2} по ${mp2Ask}, Продать на ${platform1} по ${mp1Bid}, Профит: ${profit2.toFixed(2)}%\n`;
                await openOrder(platform2, symbol2, 'buy', amount);
                await openOrder(platform1, symbol1, 'sell', amount);
                clearInterval(intervalId);

                // Ждем выравнивания цен для закрытия ордеров
                const closeIntervalId = setInterval(async () => {
                    const updatedMp2Ask = parseFloat(marketPrice2.bestAskPrice);
                    const updatedMp1Bid = parseFloat(marketPrice1.bestBidPrice);

                    if (updatedMp1Bid <= updatedMp2Ask) {
                        await closeOrder(platform1, symbol1, 'buy', amount);
                        await closeOrder(platform2, symbol2, 'sell', amount);
                        console.log(`✅ Позиции закрыты, спред выровнялся.`);
                        clearInterval(closeIntervalId);
                    }
                }, 5000);

            } else {
                // Спред не достиг userSpread, ждем
                result += `</br>❌ Спред недостаточен. Текущий максимум: ${Math.max(profit1, profit2).toFixed(2)}%\n`;
            }

        }, 5000);

    } catch (err) {
        result += `</br>❌ Ошибка при проверке цен: </br>${err.message}\n`;
    }

    return result;
}
