// Create Orders 
// LImit order 1x

// LBANK Orders Example
async function placeLBankFuturesOrder({
    symbol,
    side,        // 'long' или 'short'
    action,      // 'open' или 'close'
    amount,      // объем сделки
    price = null, // цена для лимитного ордера (если limit)
    orderType = 'limit' // 'limit' или 'market'
}) {
    const url = 'https://api.lbkex.com/v2/swap/place_order.do';

    let direction = '';

    if (action === 'open') {
        direction = side === 'long' ? 'open_long' : 'open_short';
    } else if (action === 'close') {
        direction = side === 'long' ? 'close_long' : 'close_short';
    } else {
        throw new Error('❌ Неверный action! Используй "open" или "close".');
    }

    const params = {
        api_key: API_KEY,
        symbol: symbol.toLowerCase(),
        direction: direction,
        volume: amount,
        leverage: 1, // Плечо всегда 1x
        order_type: orderType === 'market' ? 1 : 0 // 1 — маркет, 0 — лимит
    };

    if (orderType === 'limit') {
        if (!price) {
            throw new Error('❌ Для лимитного ордера нужно указать цену!');
        }
        params.price = price;
    }

    params.sign = generateLBankSign(params);

    try {
        const res = await axios.post(url, null, { params });
        console.log(`✅ Ордер ${direction} (${orderType}) отправлен:`, res.data);
    } catch (err) {
        console.error('❌ Ошибка отправки ордера:', err.response?.data || err.message);
    }
}

/*
// Открыть LONG лимитным ордером:
await placeLBankFuturesOrder({
    symbol: 'btc_usdt',
    side: 'long',
    action: 'open',
    amount: 1,
    price: '60000', // для лимитного ордера обязательно цена
    orderType: 'limit'
});

// Открыть SHORT по рынку:
await placeLBankFuturesOrder({
    symbol: 'btc_usdt',
    side: 'short',
    action: 'open',
    amount: 1,
    orderType: 'market'
});

//  Закрыть LONG лимитным ордером:
await placeLBankFuturesOrder({
    symbol: 'btc_usdt',
    side: 'long',
    action: 'close',
    amount: 1,
    price: '60500',
    orderType: 'limit'
});

//Закрыть SHORT по рынку:
await placeLBankFuturesOrder({
    symbol: 'btc_usdt',
    side: 'short',
    action: 'close',
    amount: 1,
    orderType: 'market'
});



// Открытие и закрытие ордеров
function createOrder(){
    if(spread == userSpread || spread > 2){
      console.log(spread);
      console.log('→ SHORT на LBank по', lbankBestAsk);
      console.log('→ LONG на MEXC по', mexcBestBid); 

    }
    else if(spread == userSpread || spread < 2 ){
        console.log('→ BUY на LBank по', lbankBestBid);
        console.log('→ SELL на MEXC по', mexcBestAsk);
    }
    else{
        console.log('Ошибка создания ордеров');
    }


}
    */




// KUCOIN Example 
/*
// Открытие лимитного ордера с отменой через 2 секунды
async function placeLimitOrderWithTimeout(symbol, side, price, size) {
    const clientOid = uuidv4(); // Уникальный идентификатор заказа
    const orderData = {
      symbol,
      side, // 'buy' или 'sell'
      type: 'limit',
      price: price.toString(),
      size: size.toString(),
      timeInForce: 'GTT',
      cancelAfter: 2000, // Отмена через 2000 миллисекунд (2 секунды)
      clientOid
    };
  
    try {
      const response = await kucoinRequest('POST', '/api/v1/orders', orderData);
      console.log('Лимитный ордер размещен:', response.data.orderId);
      return response.data.orderId;
    } catch (error) {
      console.error('Ошибка при размещении лимитного ордера:', error.message);
      return null;
    }
  }

//  Симуляция закрытия позиции маркет-ордером с учетом стакана (PnL)
function calculateAveragePrice(orderBookSide, amount) {
    let remaining = amount;
    let totalCost = 0;
  
    for (const [priceStr, qtyStr] of orderBookSide) {
      const price = parseFloat(priceStr);
      const qty = parseFloat(qtyStr);
      const tradeQty = Math.min(remaining, qty);
      totalCost += tradeQty * price;
      remaining -= tradeQty;
      if (remaining <= 0) break;
    }
  
    if (remaining > 0) {
      console.warn('Недостаточно ликвидности в стакане для полного закрытия позиции.');
      return null;
    }
  
    return totalCost / amount;
  }

// Подключение WebSocket для обновления ордербуков
const WebSocket = require('ws');

function connectOrderBook(symbol, onUpdate) {
  const ws = new WebSocket('wss://futures.kucoin.com/endpoint');

  ws.on('open', () => {
    const subscribeMessage = {
      id: Date.now(),
      type: 'subscribe',
      topic: `/contractMarket/level2:${symbol}`,
      response: true
    };
    ws.send(JSON.stringify(subscribeMessage));
  });

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.topic && message.data) {
      onUpdate(message.data);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed. Reconnecting...');
    setTimeout(() => connectOrderBook(symbol, onUpdate), 1000);
  });
}
*/