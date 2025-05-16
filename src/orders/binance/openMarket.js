const ccxt = require('ccxt');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '..', 'userData', '.env');
dotenv.config({ path: envPath });

const binance = new ccxt.binance({
  apiKey: process.env.BINANCE_ApiKey,
  secret: process.env.BINANCE_SecretKey,
  options: { defaultType: 'future' }, // фьючерсы
  enableRateLimit: true,
});

async function openMarketBinance(symbol, side, amount) {
  try {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      throw new Error(`❌ Invalid amount: ${amount}`);
    }

    console.log('Opening market order on Binance Futures:', { symbol, side, amount: parsedAmount });

    const order = await binance.createMarketOrder(symbol, side, parsedAmount);
    console.log('✅ Opened market order on Binance Futures:', order);
    return order;
  } catch (e) {
    console.error('❌ Open Market Error on Binance Futures:', e.message);
  }
}

module.exports = openMarketBinance;
