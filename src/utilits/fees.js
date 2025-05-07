// Fees or Commissions

// Maker Fees for Spot and Futures
const makerFees = {
    MEXC: { spot: 0.00, futures: 0.0001 },
    LBANK: { spot: 0.002, futures: 0.0002 }, // spot problem, different fees
    BYBIT: { spot: 0.001, futures: 0.0002 },
    KUCOIN: { spot: 0.001, futures: 0.0002 },
    OURBIT: { spot: 0.001, futures: 0.0006 }, // no reliable information
    BITUNIX: { spot: 0.0008, futures: 0.0002 } 
};

// Taker Fees for Spot and Futures
const takerFees = {
    MEXC: { spot: 0.0005, futures: 0.0004 },
    LBANK: { spot: 0.002, futures: 0.0006 }, // spot problem, different fees
    BYBIT: { spot: 0.001, futures: 0.00055 },
    KUCOIN: { spot: 0.001, futures: 0.0006 },
    OURBIT: { spot: 0.001, futures: 0.0006 }, // no reliable information
    BITUNIX: { spot: 0.001, futures: 0.0006 } 
};

// Export commission constants
module.exports = {
    makerFees,
    takerFees
}



// Sources of information about commissions

// Mexc info about fees:
// https://www.mexc.com/ru-RU/fee

// Lbank info about fees:
// https://www.lbank.com/ru/fee/trading/details/future

// ByBit info about fees:
// https://www.bybit.com/en/help-center/article/Trading-Fee-Structure

// KuCoin info about fees:
// https://www.kucoin.com/ru/blog/ru-kucoin-fees-a-full-breakdown-before-trading-crypto

// OurBit info about fees:
// No Data / Info

// BitUnix info about fees:
// https://support.bitunix.com/hc/en-us/articles/14042741811865-Bitunix-Trading-Fees-and-VIP-System

