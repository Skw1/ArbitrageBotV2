const ccxt = require('ccxt');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '..', 'userData', '.env');
dotenv.config({ path: envPath });

const bybit = new ccxt.bybit({
  apiKey: process.env.BYBIT_ApiKey,
  secret: process.env.BYBIT_SecretKey,
  options: { defaultType: 'future' },
  enableRateLimit: true,
});

async function closeMarketBybit(symbol, side, amount) {
  const oppositeSide = side === 'buy' ? 'sell' : 'buy';
  try {
    const order = await bybit.createMarketOrder(symbol, oppositeSide, amount);
    console.log('✅ Closed market order on Bybit Futures:', order);
    return order;
  } catch (e) {
    console.error('❌ Close Market Error on Bybit Futures:', e.message);
  }
}

module.exports = closeMarketBybit;
