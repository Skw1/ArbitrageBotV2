// Prices

// Example from ChatGPT -> we need to check and fix 
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
        
        result += `📈 Arbitrage Type: ${arbitrageType.toUpperCase()}\n</br>`;

        const bestAsk1 = parseFloat(orderBook1.asks[0][0]);
        const bestBid1 = parseFloat(orderBook1.bids[0][0]);
        const bestAsk2 = parseFloat(orderBook2.asks[0][0]);
        const bestBid2 = parseFloat(orderBook2.bids[0][0]);

        result += `</br>🔍 Лучшая цена покупки и продажи:\n </br>`;
        result += `${platform1}: Ask ${bestAsk1} / Bid ${bestBid1}\n</br>`;
        result += `${platform2}: Ask ${bestAsk2} / Bid ${bestBid2}\n</br>`;

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
            result += `</br>✅ Возможность: </br> Купить на ${platform1} по ${bestAsk1}, </br> Продать на ${platform2} по ${bestBid2},</br> </br> профит: ${profit1.toFixed(2)}%\n`;
        } 
        else if (profit2 >= userSpread) {
            result += `</br>✅ Возможность: </br> Купить на ${platform2} по ${bestAsk2}, </br> Продать на ${platform1} по ${bestBid1},</br> </br> профит: ${profit2.toFixed(2)}%\n`;
        } 
        else {
            result += `</br>❌ Нет подходящего спреда. </br> Профит макс: ${Math.max(profit1, profit2).toFixed(2)}%\n`;
        }
    } catch (err) {
        result += `</br>❌ Ошибка при проверке цен: ${err.message}\n`;
    }
    return result;
}

//====================================================================//
/*
let spread; 

// Обработка цен
function comparePrices() {
    const now = Date.now();
    if (!mexcOrderBook || !lbankOrderBook || now - lastComparisonTime < 1000) return;

    lastComparisonTime = now;

    const mexcBestBid = parseFloat(mexcOrderBook.bids[0][0]);
    const mexcBestAsk = parseFloat(mexcOrderBook.asks[0][0]);
    const lbankBestBid = parseFloat(lbankOrderBook.bids[0][0]);
    const lbankBestAsk = parseFloat(lbankOrderBook.asks[0][0]);

    console.log('\n=== 📊 Сравнение цен ===');
    console.log(`MEXC: Bid ${mexcBestBid} | Ask ${mexcBestAsk}`);
    console.log(`LBank: Bid ${lbankBestBid} | Ask ${lbankBestAsk}`);

    if (lbankBestAsk > mexcBestBid) {
        spread = ((lbankBestAsk - mexcBestBid) / mexcBestBid) * 100;
        console.log(`🔴 Арбитраж! Spread: ${spread.toFixed(2)}%`);
        console.log('→ SHORT на LBank по', lbankBestAsk);
        console.log('→ LONG на MEXC по', mexcBestBid);
    }

    if (lbankBestBid < mexcBestAsk) {
        spread = ((mexcBestAsk - lbankBestBid) / lbankBestBid) * 100;
        console.log(`🟢 Закрытие позиции! Spread: ${spread.toFixed(2)}%`);
        console.log('→ BUY на LBank по', lbankBestBid);
        console.log('→ SELL на MEXC по', mexcBestAsk);
    }
}
    */