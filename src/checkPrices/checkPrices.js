// Prices

// Example from ChatGPT -> we need to check and fix 

module.exports = async function checkPrices({ 
    platform1, platform2, 
    orderBook1, orderBook2, 
    userSpread,
    arbitrageType
}) {
    try {
        if (!orderBook1 || !orderBook2) {
            console.error('❌ Ордербуки отсутствуют');
            return;
        }

        // Проверка, на каком типе работаем
        console.log(`=== 📈 Arbitrage Type: ${arbitrageType.toUpperCase()} ===`);

        // Извлекаем лучшие цены:
        const bestAsk1 = parseFloat(orderBook1.asks[0][0]);
        const bestBid1 = parseFloat(orderBook1.bids[0][0]);
        const bestAsk2 = parseFloat(orderBook2.asks[0][0]);
        const bestBid2 = parseFloat(orderBook2.bids[0][0]);

        console.log(`=== 🔍 Лучшая цена покупки и продажи ===`);
        console.log(`${platform1}: Ask ${bestAsk1} / Bid ${bestBid1}`);
        console.log(`${platform2}: Ask ${bestAsk2} / Bid ${bestBid2}`);

        // Сценарии поиска арбитража:
        let profit1, profit2;

        if (arbitrageType.toLowerCase() === 'spot') {
            // Спотовый арбитраж (простая покупка-продажа)
            profit1 = (bestBid2 - bestAsk1) / bestAsk1 * 100;
            profit2 = (bestBid1 - bestAsk2) / bestAsk2 * 100;
        } 
        else if (arbitrageType.toLowerCase() === 'futures') {
            // Фьючерсный арбитраж (разные правила: часто Long/Short, но упростим пока)
            profit1 = (bestBid2 - bestAsk1) / bestAsk1 * 100;
            profit2 = (bestBid1 - bestAsk2) / bestAsk2 * 100;
        } 
        else {
            console.error('❌ Неверный тип арбитража');
            return;
        }

        // Проверка на минимальный спред
        if (profit1 >= userSpread) {
            console.log(`✅ Возможность: Купить на ${platform1} по ${bestAsk1}, продать на ${platform2} по ${bestBid2}, профит: ${profit1.toFixed(2)}%`);
        } 
        else if (profit2 >= userSpread) {
            console.log(`✅ Возможность: Купить на ${platform2} по ${bestAsk2}, продать на ${platform1} по ${bestBid1}, профит: ${profit2.toFixed(2)}%`);
        } 
        else {
            console.log(`❌ Нет подходящего спреда. Профит макс: ${Math.max(profit1, profit2).toFixed(2)}%`);
        }
    } catch (err) {
        console.error('❌ Ошибка при проверке цен:', err.message);
    }
}
