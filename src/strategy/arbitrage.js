// Create Orders 

// Limit order 1x
// Order Example for MEXC
/*
const ccxt = require('ccxt');

// 🔐 Вставь свои API ключи от MEXC Futures
const apiKey = 'ApiKey';
const secret = 'SecretKey';

const exchange = new ccxt.mexc({
    apiKey,
    secret,
    enableRateLimit: true,
    options: {
        defaultType: 'swap', // обязательно для фьючерсов
    },
});

// ✅ Проверка баланса
async function checkBalance(symbol, amountInUSDT) {
    try {
        const balance = await exchange.fetchBalance();
        const freeBalance = balance.total.USDT;

        if (freeBalance < amountInUSDT) {
            console.log(`❌ Недостаточно средств! Доступно: ${freeBalance.toFixed(2)} USDT`);
            return false;
        } else {
            console.log(`✅ Баланс достаточен. Доступно: ${freeBalance.toFixed(2)} USDT`);
            return true;
        }
    } catch (err) {
        console.error('❌ Ошибка получения баланса:', err.message);
        return false;
    }
}

// ✅ Открытие позиции с разбиением по стакану
async function openLimitPosition(symbol, side, amount) {
    const baseCurrency = symbol.split('/')[0];
    const quoteCurrency = symbol.split('/')[1];

    try {
        const orderbook = await exchange.fetchOrderBook(symbol);
        const bookSide = side === 'buy' ? orderbook.asks : orderbook.bids;

        let remainingAmount = amount;
        let totalCost = 0;
        const orders = [];

        for (let i = 0; i < bookSide.length && remainingAmount > 0; i++) {
            const [priceStr, quantityStr] = bookSide[i];
            const price = parseFloat(priceStr);
            const available = parseFloat(quantityStr);

            const volumeToBuy = Math.min(remainingAmount, available);
            const cost = volumeToBuy * price;

            const hasBalance = await checkBalance(symbol, cost);
            if (!hasBalance) break;

            const params = {
                positionSide: side === 'buy' ? 'long' : 'short',
                leverage: 1,
            };

            const order = await exchange.createOrder(
                symbol,
                'limit',
                side,
                volumeToBuy,
                price,
                params
            );

            console.log(`✅ Лимитный ордер: ${volumeToBuy} ${baseCurrency} по ${price}`);
            orders.push(order);

            remainingAmount -= volumeToBuy;
            totalCost += cost;
        }

        if (remainingAmount > 0) {
            console.log(`⚠️ Недостаточно ликвидности. Не размещено: ${remainingAmount.toFixed(6)} ${baseCurrency}`);
        } else {
            console.log(`🎯 Все ${amount} ${baseCurrency} размещены лимитами. Общая стоимость: ${totalCost.toFixed(2)} ${quoteCurrency}`);
        }

        return orders;
    } catch (err) {
        console.error('❌ Ошибка при размещении лимитных ордеров:', err.message);
    }
}

// ✅ Получение открытых ордеров
async function getOpenOrders(symbol) {
    try {
        const orders = await exchange.fetchOpenOrders(symbol);
        console.log(`📋 Открытые ордера для ${symbol}:`);
        console.dir(orders, { depth: null });
        return orders;
    } catch (err) {
        console.error('❌ Ошибка получения открытых ордеров:', err.message);
    }
}

// ✅ Закрытие позиции по маркету
async function closePosition(symbol, side, amount) {
    try {
        const oppositeSide = side === 'buy' ? 'sell' : 'buy';
        const baseCurrency = symbol.split('/')[0];

        const params = {
            positionSide: side === 'buy' ? 'long' : 'short',
        };

        const order = await exchange.createOrder(
            symbol,
            'market',
            oppositeSide,
            amount,
            null,
            params
        );

        console.log(`✅ Позиция закрыта маркет-ордером: ${amount} ${baseCurrency}`);
        return order;
    } catch (err) {
        console.error('❌ Ошибка закрытия позиции:', err.message);
    }
}

// 🚀 Основная функция
async function main() {
    const symbol = 'BTC/USDT'; // Торговая пара
    const amount = 0.01;       // Кол-во BTC

    await openLimitPosition(symbol, 'buy', amount);  // Открыть long по стакану с разбиением
    await getOpenOrders(symbol);                     // Посмотреть открытые ордера
    // await closePosition(symbol, 'buy', amount);   // Закрытие позиции по маркету
}

main();
*/