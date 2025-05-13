const openMarketMEXC = require('../orders/mexc/openMarket.js');
const openMarketLBank = require('../orders/lbank/openMarket.js');
const openMarketKuCoin = require('../orders/kucoin/openMarket.js');
const closeMarketMEXC = require('../orders/mexc/closeMarket.js');
const closeMarketLBank = require('../orders/lbank/closeMarket.js');
const closeMarketKuCoin = require('../orders/kucoin/closeMarket.js');

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
                    await openMarketMEXC(symbol, 'buy', amount);
                    await openMarketKuCoin(symbol, 'sell', amount);
                    clearInterval(intervalId); // Останавливаем интервал после выполнения
                } else if (profit2 >= userSpread) {
                    result += `</br>✅ Возможность:\n</br> Купить на ${platform2} по ${mp2Ask}, </br> Продать на ${platform1} по ${mp1Bid},\n</br> </br>Профит: ${profit2.toFixed(2)}%\n`;
                    await openMarketLBank(symbol, 'buy', amount);
                    await openMarketKuCoin(symbol, 'sell', amount);
                    clearInterval(intervalId); // Останавливаем интервал после выполнения
                } else {
                    result += `</br>❌ Нет подходящего спреда.\n</br> Профит макс: ${Math.max(profit1, profit2).toFixed(2)}%\n`;
                }
            }, 5000); // Проверка каждые 5 секунд

        } else {
            result += '</br>❌ Неверный тип ордера\n</br>';
            return result;
        }

    } catch (err) {
        result += `</br>❌ Ошибка при проверке цен: </br>${err.message}\n`;
    }

    return result;
}


// Prices
// Order Book Prices 
// Было
/*
module.exports = async function checkPrices({ 
    platform1, platform2, 
    orderBook1, orderBook2, 
    userSpread,
    arbitrageType
}) {
    let result = '';
    try {
        if (!orderBook1 || !orderBook2) {
            result += '❌ Ордербуки отсутствуют\n</br>';
            return result;
        }
        
        result += 📈 Arbitrage Type: ${arbitrageType.toUpperCase()}\n</br>;

        const bestAsk1 = parseFloat(orderBook1.asks[0][0]);
        const bestBid1 = parseFloat(orderBook1.bids[0][0]);
        const bestAsk2 = parseFloat(orderBook2.asks[0][0]);
        const bestBid2 = parseFloat(orderBook2.bids[0][0]);

        result += </br>🔍 Лучшая цена покупки и продажи:\n </br>;
        result += ${platform1}: Ask ${bestAsk1} / Bid ${bestBid1}\n</br>;
        result += ${platform2}: Ask ${bestAsk2} / Bid ${bestBid2}\n</br>;

        let profit1, profit2;

        if (arbitrageType.toLowerCase() === 'spot') {
            profit1 = (bestBid2 - bestAsk1) / bestAsk1 * 100;
            profit2 = (bestBid1 - bestAsk2) / bestAsk2 * 100;
        } 
        else if (arbitrageType.toLowerCase() === 'futures') {
            profit1 = (bestBid2 - bestAsk1) / bestAsk1 * 100;
            profit2 = (bestBid1 - bestAsk2) / bestAsk2 * 100;
        } 
        else {
            result += '</br>❌ Неверный тип арбитража\n';
            return result;
        }

        if (profit1 >= userSpread) {
            result += </br>✅ Возможность: </br> Купить на ${platform1} по ${bestAsk1}, </br> Продать на ${platform2} по ${bestBid2},</br> </br> Профит: ${profit1.toFixed(2)}%\n;
        } 
        else if (profit2 >= userSpread) {
            result += </br>✅ Возможность: </br> Купить на ${platform2} по ${bestAsk2}, </br> Продать на ${platform1} по ${bestBid1},</br> </br> Профит: ${profit2.toFixed(2)}%\n;
        } 
        else {
            result += </br>❌ Нет подходящего спреда. </br> Профит макс: ${Math.max(profit1, profit2).toFixed(2)}%\n;
        }
    } catch (err) {
        result += </br>❌ Ошибка при проверке цен: </br> ${err.message}\n;
    }
    return result;
}

*/
