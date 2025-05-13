const openMarketMEXC = require('../orders/mexc/openMarket.js');
const openMarketLBank = require('../orders/lbank/openMarket.js');
const openMarketKuCoin = require('../orders/kucoin/openMarket.js');
const openMarketBitunix = require('../orders/bitunix/openMarket.js');

const closeMarketMEXC = require('../orders/mexc/closeMarket.js');
const closeMarketLBank = require('../orders/lbank/closeMarket.js');
const closeMarketKuCoin = require('../orders/kucoin/closeMarket.js');
const closeMarketBitunix = require('../orders/bitunix/closeMarket.js');

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
     console.log(platform1, platform2, marketPrice1, marketPrice2, arbitrageType,userSpread, orderType, symbol1, symbol2, amount,)
    let result = '';
    try {
        result += `📈 Arbitrage Type: ${arbitrageType.toUpperCase()}</br></br>Order Type: ${orderType.toUpperCase()}\n</br>`;

        // Функция для вычисления профита
        function calculateProfit(mp1Ask, mp1Bid, mp2Ask, mp2Bid) {
            let profit1 = (mp2Bid - mp1Ask) / mp1Ask * 100;
            let profit2 = (mp1Bid - mp2Ask) / mp2Ask * 100;
            return { profit1, profit2 };
        }

        // Универсальная функция для открытия ордера
        async function openOrder(platform, symbol, action, amount) {
            if (platform === 'MEXC') {
                return openMarketMEXC(symbol, action, amount);
            } else if (platform === 'LBANK') {
                return openMarketLBank(symbol, action, amount);
            } else if (platform === 'KUCOIN') {
                return openMarketKuCoin(symbol, action, amount);
            } else if (platform === 'BITUNIX') {
                return openMarketBitunix(symbol, action, amount);
            }
        }

        // Универсальная функция для закрытия ордера
        async function closeOrder(platform, symbol, action, amount) {
            if (platform === 'MEXC') {
                return closeMarketMEXC(symbol, action, amount);
            } else if (platform === 'LBANK') {
                return closeMarketLBank(symbol, action, amount);
            } else if (platform === 'KUCOIN') {
                return closeMarketKuCoin(symbol, action, amount);
            } else if (platform === 'BITUNIX') {
                return closeMarketBitunix(symbol, action, amount);
            }
        }

        // Проверка на маркет-ордер
        if (orderType.toLowerCase() !== 'market') {
            result += `</br>⚠️ Только маркет-ордера поддерживаются.\n</br>`;
            return result;
        }

        console.log('Начало проверки цен...');

        const intervalId = setInterval(async () => {
            console.log('Проверка цен...');

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

            result += `</br>🔍 Рыночные цены:\n</br>`;
            result += `${platform1}: Ask ${mp1Ask}, Bid ${mp1Bid}\n</br>`;
            result += `${platform2}: Ask ${mp2Ask}, Bid ${mp2Bid}\n</br>`;

            const { profit1, profit2 } = calculateProfit(mp1Ask, mp1Bid, mp2Ask, mp2Bid);

            // Логика открытия ордера, когда разница в цене >= userSpread
            if (profit1 >= userSpread) {
                result += `</br>✅ Возможность:\n</br> Купить на ${platform1} по ${mp1Ask}, </br> Продать на ${platform2} по ${mp2Bid},\n</br></br>Профит: ${profit1.toFixed(2)}%\n`;
                await openOrder(platform1, symbol1, 'buy', amount);  // Открываем на MEXC
                await openOrder(platform2, symbol2, 'sell', amount); // Открываем на LBank
                clearInterval(intervalId);

                // Ожидание выравнивания цен для закрытия ордеров
                const closeIntervalId = setInterval(async () => {
                    const updatedMp1Ask = parseFloat(marketPrice1.bestAskPrice);
                    const updatedMp2Bid = parseFloat(marketPrice2.bestBidPrice);

                    if (updatedMp1Ask === updatedMp2Bid) {
                        await closeOrder(platform1, symbol1, 'sell', amount); // Закрытие на MEXC
                        await closeOrder(platform2, symbol2, 'buy', amount);  // Закрытие на LBank
                        console.log(`✅ Позиции на ${platform1} и ${platform2} закрыты, спред выровнялся`);
                        clearInterval(closeIntervalId);
                    }
                }, 5000); // Проверка цен для закрытия каждые 5 секунд
            } else if (profit2 >= userSpread) {
                result += `</br>✅ Возможность:\n</br> Купить на ${platform2} по ${mp2Ask}, </br> Продать на ${platform1} по ${mp1Bid},\n</br></br>Профит: ${profit2.toFixed(2)}%\n`;
                await openOrder(platform2, symbol2, 'buy', amount);  // Открываем на LBank
                await openOrder(platform1, symbol1, 'sell', amount); // Открываем на MEXC
                clearInterval(intervalId);

                // Ожидание выравнивания цен для закрытия ордеров
                const closeIntervalId = setInterval(async () => {
                    const updatedMp2Ask = parseFloat(marketPrice2.bestAskPrice);
                    const updatedMp1Bid = parseFloat(marketPrice1.bestBidPrice);

                    if (updatedMp1Bid === updatedMp2Ask) {
                        await closeOrder(platform1, symbol1, 'buy', amount);  // Закрытие на MEXC
                        await closeOrder(platform2, symbol2, 'sell', amount); // Закрытие на LBank
                        console.log(`✅ Позиции на ${platform1} и ${platform2} закрыты, спред выровнялся`);
                        clearInterval(closeIntervalId);
                    }
                }, 5000); // Проверка цен для закрытия каждые 5 секунд
            } else {
                result += `</br>❌ Нет подходящего спреда.\n</br> Профит макс: ${Math.max(profit1, profit2).toFixed(2)}%\n`;
            }
        }, 5000); // Проверка цен каждые 5 секунд

    } catch (err) {
        result += `</br>❌ Ошибка при проверке цен: </br>${err.message}\n`;
    }

    return result;
}
