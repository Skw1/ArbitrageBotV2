// Prices
// Order Book Prices 
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
        result += `📈 Arbitrage Type: ${arbitrageType.toUpperCase()} </br> Order Type: ${orderType.toUpperCase()}\n</br>`;

        // 🔒 Блокируем лимитные ордера
        if (orderType.toLowerCase() === 'limit') {
            result += `⚠️ Сейчас лимитные ордера не поддерживаются.\n</br>`;
            return result;
        }

        let priceBuy1, priceSell1, priceBuy2, priceSell2;

        if (orderType.toLowerCase() === 'market') {
            if (!marketPrice1 || !marketPrice2 || !marketPrice1.lastPrice || !marketPrice2.lastPrice) {
                result += '❌ Рыночные цены недоступны\n</br>';
                return result;
            }

            const mp1 = parseFloat(marketPrice1.lastPrice);
            const mp2 = parseFloat(marketPrice2.lastPrice);

            result += `🔍 Рыночные цены:\n</br>`;
            result += `${platform1}: ${mp1}\n</br>`;
            result += `${platform2}: ${mp2}\n</br>`;

            priceBuy1 = mp1;
            priceSell1 = mp1;
            priceBuy2 = mp2;
            priceSell2 = mp2;
        } 
        else {
            result += '❌ Неверный тип ордера\n</br>';
            return result;
        }

        // Profit calculation
        const profit1 = (priceSell2 - priceBuy1) / priceBuy1 * 100;
        const profit2 = (priceSell1 - priceBuy2) / priceBuy2 * 100;

        if (profit1 >= userSpread) {
            result += `✅ Возможность:\n</br> Купить на ${platform1} по ${priceBuy1}, </br> Продать на ${platform2} по ${priceSell2},\n</br> Профит: ${profit1.toFixed(2)}%\n`;
        } 
        else if (profit2 >= userSpread) {
            result += `✅ Возможность:\n</br> Купить на ${platform2} по ${priceBuy2}, </br> Продать на ${platform1} по ${priceSell1},\n</br> Профит: ${profit2.toFixed(2)}%\n`;
        } 
        else {
            result += `❌ Нет подходящего спреда.\n</br> Профит макс: ${Math.max(profit1, profit2).toFixed(2)}%\n`;
        }

    } catch (err) {
        result += `❌ Ошибка при проверке цен: </br>${err.message}\n`;
    }

    return result;
}



// Market Prices