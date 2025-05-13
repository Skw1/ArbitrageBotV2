// Funding

/*
const axios = require('axios');

// Статические значения по умолчанию (если API недоступен)
const DEFAULT_FUNDING = {
    MEXC: 0.0004,
    KUCOIN: 0.0006
};

// Получение funding для MEXC
async function getMEXCFunding(symbol) {
    try {
        const response = await axios.get(`https://contract.mexc.com/api/v1/private/fundingRate/${symbol}`);
        return parseFloat(response.data.data.fundingRate); // если формат такой
    } catch (error) {
        console.error('Ошибка при получении funding MEXC:', error.message);
        return DEFAULT_FUNDING.MEXC;
    }
}

// Получение funding для KuCoin
async function getKucoinFunding(symbol) {
    try {
        const response = await axios.get(`https://api-futures.kucoin.com/api/v1/funding-rate/${symbol}`);
        return parseFloat(response.data.data.fundingRate);
    } catch (error) {
        console.error('Ошибка при получении funding KUCOIN:', error.message);
        return DEFAULT_FUNDING.KUCOIN;
    }
}

// Основная функция анализа
async function runFundingAnalysis(symbol, spread) {
    const [fundingMEXC, fundingKUCOIN] = await Promise.all([
        getMEXCFunding(symbol),
        getKucoinFunding(symbol)
    ]);

    // Расчет среднего влияния разницы фандинга
    const averageImpact = Math.abs(fundingMEXC - fundingKUCOIN);
    
    // Корректировка спреда с учетом влияния фандинга
    const adjustedSpread = parseFloat(spread) - averageImpact;

    const fundingInfo = {
        fundingMEXC,
        fundingKUCOIN,
        averageFundingImpact: averageImpact,
        adjustedSpread: adjustedSpread
    };

    console.log('📊 Funding info:', fundingInfo);
    return fundingInfo;
}

module.exports = {
    runFundingAnalysis
};
*/