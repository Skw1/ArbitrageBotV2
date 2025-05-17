const ccxt = require('ccxt');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '..', 'userData', '.env');
dotenv.config({ path: envPath });

const bybit = new ccxt.bybit({
  apiKey: process.env.BYBIT_ApiKey,
  secret: process.env.BYBIT_SecretKey,
  options: { defaultType: 'future' }, // фьючерсы
  enableRateLimit: true,
});

async function openMarketBybit(symbol, side, amount) {
  try {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      throw new Error(`❌ Invalid amount: ${amount}`);
    }

    console.log('Opening market order on Bybit Futures:', { symbol, side, amount: parsedAmount });

    const order = await bybit.createMarketOrder(symbol, side, parsedAmount);
    console.log('✅ Opened market order on Bybit Futures:', order);
    return order;
  } catch (e) {
    console.error('❌ Open Market Error on Bybit Futures:', e.message);
  }
}

module.exports = openMarketBybit;
