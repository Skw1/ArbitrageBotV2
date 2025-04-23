// MEXC Parsing


// MEXC Spot Order Book
async function getMEXCOrderBook(type = 'spot') {
    try {
        const endpoint = type === 'spot'
            ? `https://api.mexc.com/api/v3/depth?symbol=${mexcSpotSymbol}&limit=5`
            : `https://contract.mexc.com/api/v1/contract/depth/${mexcSpotSymbol}`;

        const res = await axios.get(endpoint);

        console.log(res.data.data || res.data);
    } catch (err) {
        console.error(`MEXC ${type} error:`, err.response?.status, err.response?.data, err.message);
        return null;
    }
}

// MEXC Futures Order Book
async function getMEXCFuturesOrderBook() {
    try {
        const endpoint = `https://contract.mexc.com/api/v1/contract/depth/${mexcFuturesSymbol}`;
        const res = await axios.get(endpoint);
        const data = res.data?.data;

        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
            mexcOrderBook = {
                bids: data.bids,
                asks: data.asks,
                timestamp: Date.now()
            };
            comparePrices();
        } else {
            console.error('⚠️ Некорректный формат данных от MEXC:', res.data);
        }
    } catch (err) {
        console.error("❌ MEXC futures error:", err.message);
    }
}