const ccxt = require('ccxt');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '..', 'userData', '.env');
dotenv.config({ path: envPath });

const binance = new ccxt.binance({
  apiKey: process.env.BINANCE_ApiKey,
  secret: process.env.BINANCE_SecretKey,
  options: { defaultType: 'future' },
  enableRateLimit: true,
});

async function closeMarketBinance(symbol, side, amount) {
  const oppositeSide = side === 'buy' ? 'sell' : 'buy';
  try {
    const order = await binance.createMarketOrder(symbol, oppositeSide, amount);
    console.log('✅ Closed market order on Binance Futures:', order);
    return order;
  } catch (e) {
    console.error('❌ Close Market Error on Binance Futures:', e.message);
  }
}

module.exports = closeMarketBinance;
