const openMarketMEXC = require('../orders/mexc/openMarket.js');
const openMarketLBank = require('../orders/lbank/openMarket.js');
const openMarketKuCoin = require('../orders/kucoin/openMarket.js');
const openMarketBitunix = require('../orders/bitunix/openMarket.js'); // Добавляем Bitunix
const closeMarketMEXC = require('../orders/mexc/closeMarket.js');
const closeMarketLBank = require('../orders/lbank/closeMarket.js');
const closeMarketKuCoin = require('../orders/kucoin/closeMarket.js');
const closeMarketBitunix = require('../orders/bitunix/closeMarket.js'); // Добавляем Bitunix

module.exports = async function checkPrices({ 
    platform1, platform2, 
    marketPrice1, marketPrice2, 
    userSpread,
    arbitrageType,
    orderType,
    symbol,
    amount,
}) {
    let result = '';
    try {
        result += `📈 Arbitrage Type: ${arbitrageType.toUpperCase()}</br> </br>Order Type: ${orderType.toUpperCase()}\n</br>`;

        // Функция для вычисления профита
        function calculateProfit(mp1Ask, mp1Bid, mp2Ask, mp2Bid) {
            let profit1 = (mp2Bid - mp1Ask) / mp1Ask * 100;
            let profit2 = (mp1Bid - mp2Ask) / mp2Ask * 100;
            return { profit1, profit2 };
        }

        // Функция для вызова нужной функции ордера в зависимости от платформы
        async function openOrder(platform, symbol, action, amount) {
            if (platform === 'MEXC') {
                return action === 'buy' ? openMarketMEXC(symbol, 'buy', amount) : openMarketMEXC(symbol, 'sell', amount);
            } else if (platform === 'LBank') {
                return action === 'buy' ? openMarketLBank(symbol, 'buy', amount) : openMarketLBank(symbol, 'sell', amount);
            } else if (platform === 'KuCoin') {
                return action === 'buy' ? openMarketKuCoin(symbol, 'buy', amount) : openMarketKuCoin(symbol, 'sell', amount);
            } else if (platform === 'Bitunix') {
                return action === 'buy' ? openMarketBitunix(symbol, 'buy', amount) : openMarketBitunix(symbol, 'sell', amount);
            }
        }

        // Проверка на маркет-ордер
        if (orderType.toLowerCase() === 'market') {
            console.log('Начало проверки цен...');

            const intervalId = setInterval(async () => {
                console.log('Проверка цен...');

                if (!marketPrice1 || !marketPrice2 || !marketPrice1.bestAskPrice || !marketPrice2.bestAskPrice) {
                    console.error('Market data missing or incomplete:', marketPrice1, marketPrice2);
                    result += '❌ Рыночные цены недоступны\n</br>';
                    clearInterval(intervalId); // Останавливаем интервал
                    return;
                }

                const mp1Ask = parseFloat(marketPrice1.bestAskPrice);
                const mp1Bid = parseFloat(marketPrice1.bestBidPrice);
                const mp2Ask = parseFloat(marketPrice2.bestAskPrice);
                const mp2Bid = parseFloat(marketPrice2.bestBidPrice);

                result += `</br>🔍 Рыночные цены:\n</br>`;
                result += `${platform1}: Ask ${mp1Ask}, Bid ${mp1Bid}\n</br>`;
                result += `${platform2}: Ask ${mp2Ask}, Bid ${mp2Bid}\n</br>`;

                // Расчет профита
                const { profit1, profit2 } = calculateProfit(mp1Ask, mp1Bid, mp2Ask, mp2Bid);

                if (profit1 >= userSpread) {
                    result += `</br>✅ Возможность:\n</br> Купить на ${platform1} по ${mp1Ask}, </br> Продать на ${platform2} по ${mp2Bid},\n</br> </br>Профит: ${profit1.toFixed(2)}%\n`;
                    await openOrder(platform1, symbol, 'buy', amount);
                    await openOrder(platform2, symbol, 'sell', amount);
                    clearInterval(intervalId); // Останавливаем интервал после выполнения
                } else if (profit2 >= userSpread) {
                    result += `</br>✅ Возможность:\n</br> Купить на ${platform2} по ${mp2Ask}, </br> Продать на ${platform1} по ${mp1Bid},\n</br> </br>Профит: ${profit2.toFixed(2)}%\n`;
                    await openOrder(platform2, symbol, 'buy', amount);
                    await openOrder(platform1, symbol, 'sell', amount);
                    clearInterval(intervalId); // Останавливаем интервал после выполнения
                } else {
                    result += `</br>❌ Нет подходящего спреда.\n</br> Профит макс: ${Math.max(profit1, profit2).toFixed(2)}%\n`;
                }
            }, 5000); // Проверка каждые 5 секунд

        } else if (orderType.toLowerCase() === 'limit') {
            result += `</br>⚠️ Лимитные ордера не поддерживаются.\n</br>`;
            return result;
        } else {
            result += '</br>❌ Неверный тип ордера\n</br>';
            return result;
        }

    } catch (err) {
        result += `</br>❌ Ошибка при проверке цен: </br>${err.message}\n`;
    }

    return result;
}
