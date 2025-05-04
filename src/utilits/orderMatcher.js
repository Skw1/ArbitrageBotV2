
// OrderMatcher

function matchOrders(asks, targetQuantity) {
    let remaining = targetQuantity;
    let totalCost = 0;
  
    for (const [priceStr, quantityStr] of asks) {
      if (remaining <= 0) break;
  
      const price = parseFloat(priceStr);
      const available = parseFloat(quantityStr);
      const take = Math.min(available, remaining);
  
      totalCost += take * price;
      remaining -= take;
  
      console.log(`Взято ${take} по цене ${price}`);
    }
  
    if (remaining > 0) {
      console.log(`⚠️ Недостаточно ликвидности. Осталось ${remaining}`);
    } else {
      console.log(`✅ Позиция закрыта. Цена: ${(totalCost / targetQuantity).toFixed(6)}`);
    }
  }
  module.exports = { matchOrders };
  