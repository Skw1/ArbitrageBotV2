module.exports = async function checkPrices({ 
    platform1, platform2, 
    orderBook1, orderBook2, 
    marketPrice1, marketPrice2, 
    userSpread,
    arbitrageType,
    orderType, // 'Limit' або 'Market'
}) {
    let result = '';
    try {
        result += `📈 Arbitrage Type: ${arbitrageType.toUpperCase()} </br> </br>Order Type: ${orderType.toUpperCase()}\n</br>`;

        // 🔒 Блокируем лимитные ордера
        if (orderType.toLowerCase() === 'limit') {
            result += `⚠️ Сейчас лимитные ордера не поддерживаются.\n</br>`;
            return result;
        }

        let priceBuy1, priceSell1, priceBuy2, priceSell2;

        if (orderType.toLowerCase() === 'market') {
            // Отладочная информация для рыночных цен
            console.log('Market Price 1:', marketPrice1);
            console.log('Market Price 2:', marketPrice2);

            // Проверяем, что данные о ценах существуют и содержат bestAskPrice и bestBidPrice
            if (!marketPrice1 || !marketPrice2 || !marketPrice1.bestAskPrice || !marketPrice2.bestAskPrice) {
                console.error('Market data missing or incomplete:', marketPrice1, marketPrice2);
                result += '❌ Рыночные цены недоступны\n</br>';
                return result;
            }

            // Преобразуем строковые значения в числа
            const mp1Ask = parseFloat(marketPrice1.bestAskPrice);
            const mp1Bid = parseFloat(marketPrice1.bestBidPrice);
            const mp2Ask = parseFloat(marketPrice2.bestAskPrice);
            const mp2Bid = parseFloat(marketPrice2.bestBidPrice);

            result += `</br>🔍 Рыночные цены:\n</br>`;
            result += `${platform1}: Ask ${mp1Ask}, Bid ${mp1Bid}\n</br>`;
            result += `${platform2}: Ask ${mp2Ask}, Bid ${mp2Bid}\n</br>`;

            priceBuy1 = mp1Bid;
            priceSell1 = mp1Ask;

            priceBuy2 = mp2Bid;
            priceSell2 = mp2Ask;
        } 
        else if (orderType.toLowerCase() === 'orderbook') {
            if (!orderBook1 || !orderBook2) {
                result += '</br>❌ Ордербуки недоступны\n</br>';
                return result;
            }

            const bestAsk1 = parseFloat(orderBook1.asks[0][0]);
            const bestBid1 = parseFloat(orderBook1.bids[0][0]);
            const bestAsk2 = parseFloat(orderBook2.asks[0][0]);
            const bestBid2 = parseFloat(orderBook2.bids[0][0]);

            result += `</br>🔍 Лучшая цена покупки и продажи:\n</br>`;
            result += `${platform1}: Ask ${bestAsk1} / Bid ${bestBid1}\n</br>`;
            result += `${platform2}: Ask ${bestAsk2} / Bid ${bestBid2}\n</br>`;

            priceBuy1 = bestBid1;
            priceSell1 = bestAsk1;
            priceBuy2 = bestBid2;
            priceSell2 = bestAsk2;
        } 
        else {
            result += '</br>❌ Неверный тип ордера\n</br>';
            return result;
        }

        // Profit calculation
        let profit1, profit2;

        if (arbitrageType.toLowerCase() === 'spot') {
            profit1 = (priceSell2 - priceBuy1) / priceBuy1 * 100;
            profit2 = (priceSell1 - priceBuy2) / priceBuy2 * 100;
        } 
        else if (arbitrageType.toLowerCase() === 'futures') {
            profit1 = (priceSell2 - priceBuy1) / priceBuy1 * 100;
            profit2 = (priceSell1 - priceBuy2) / priceBuy2 * 100;
        } 
        else {
            result += '</br>❌ Неверный тип арбитража\n';
            return result;
        }

        // Оценка спреда и вывод
        if (profit1 >= userSpread) {
            result += `</br>✅ Возможность:\n</br> Купить на ${platform1} по ${priceBuy1}, </br> Продать на ${platform2} по ${priceSell2},\n</br> </br>Профит: ${profit1.toFixed(2)}%\n`;
            //result += `🔴 Цены:\n</br> ${platform1} - Покупка: ${priceBuy1}, Продажа: ${priceSell1}\n</br>`;
            //result += `🔴 ${platform2} - Покупка: ${priceBuy2}, Продажа: ${priceSell2}\n</br>`;
        } 
        else if (profit2 >= userSpread) {
            result += `</br>✅ Возможность:\n</br> Купить на ${platform2} по ${priceBuy2}, </br> Продать на ${platform1} по ${priceSell1},\n</br> </br>Профит: ${profit2.toFixed(2)}%\n`;
            //result += `🔴 Цены:\n</br> ${platform1} - Покупка: ${priceBuy1}, Продажа: ${priceSell1}\n</br>`;
            //result += `🔴 ${platform2} - Покупка: ${priceBuy2}, Продажа: ${priceSell2}\n</br>`;
        } 
        else {
            result += `</br>❌ Нет подходящего спреда.\n</br> Профит макс: ${Math.max(profit1, profit2).toFixed(2)}%\n`;
            //result += `🔴 Цены:\n</br> ${platform1} - Покупка: ${priceBuy1}, Продажа: ${priceSell1}\n</br>`;
            //result += `🔴 ${platform2} - Покупка: ${priceBuy2}, Продажа: ${priceSell2}\n</br>`;
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
