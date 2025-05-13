const express = require('express');
const multer = require('multer');
const path = require('path');
const zlib = require('zlib'); 

const PORT = 3000;
const app = express();

app.use('/', require('./src/routes/settings'))
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// getting prices bids/asks functions
const { getMEXCSpotOrderBook, getMEXCFuturesOrderBook, } = require('./src/api/mexc.js');
const { getLBankSpotOrderBook, connectLBankFuturesOrderBook } = require('./src/api/lbank.js');
const { getBybitSpotOrderBook, getBybitFuturesOrderBook } = require('./src/api/bybit.js');
const { getKucoinSpotOrderBook, getKucoinFuturesOrderBook } = require('./src/api/kucoin.js');
const { getBitunixSpotOrderBook, getBitunixFuturesOrderBook } = require('./src/api/bitunix.js');

// getting market prices functions
const  {getMEXCSpotPrice, getMEXCFuturesPrice}  = require('./src/market/mexc.js');
const  {getLBankSpotPrice, getLBankFuturesPrice}  = require('./src/market/lbank.js');
const  {getBybitSpotPrice, getBybitFuturesPrice}  = require('./src/market/bybit.js');
const  {getKucoinSpotPrice, getKucoinFuturesPrice}  = require('./src/market/kucoin.js');
const  {getBitunixSpotPrice, getBitunixFuturesPrice} = require('./src/market/bitunix.js');

// checking prices function
const checkPrices = require('./src/checkPrices/checkPrices.js')

// Funding Analysis
const { runFundingAnalysis } = require('./src/utilits/funding');



let userQuantity;
let userSpread;
let arbitrageType;
let lastComparisonTime = 0;

// platforms/platform`s symbols
let symbol1
let symbol2
let platform1
let platform2

// For Limit Orders
let orderBook1
let orderBook2

//For Market Orders
let merketPrice1
let merketPrice2

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/settings", (req,res) => {
    res.sendFile(path.join(__dirname , "public","settings.html"))
})

app.post('/sendingInfo', upload.none(), async (req, res) => {

    userQuantity = req.body.userQuantity;
    userSpread = req.body.userSpread;
    arbitrageType = req.body.arbitrageType;
    orderType = req.body.orderType;
    symbol1 = req.body.symbol1;
    symbol2 = req.body.symbol2;
    platform1 = req.body.platform1;
    platform2 = req.body.platform2;
    console.log(symbol1,symbol2,platform1,platform2,orderType, arbitrageType);
    if (orderType == 'Limit'){
    switch (arbitrageType) {
        case 'Spot':
            
            switch (platform1) {
                case 'MEXC':
                    getMEXCSpotOrderBook(symbol1);
                    break;
                case 'LBANK':
                    getLBankSpotOrderBook(symbol1);
                    break;
                case 'BYBIT':
                    getBybitSpotOrderBook(symbol1);
                    break;
                case 'KUCOIN':
                    getKucoinSpotOrderBook(symbol1);
                    break;
                case 'BITUNIX':
                    getBitunixSpotOrderBook(symbol1);
                    break;
                
            }

            switch (platform2) {
                case 'MEXC':
                    getMEXCSpotOrderBook(symbol2);
                    break;
                case 'LBANK':
                    getLBankSpotOrderBook(symbol2);
                    break;
                case 'BYBIT':
                    getBybitSpotOrderBook(symbol2);
                    break;
                case 'KUCOIN':
                    getKucoinSpotOrderBook(symbol2);
                    break;
                case 'BITUNIX':
                    getBitunixSpotOrderBook(symbol2);
                    break;
            }

            break;
        case 'Futures':
            
        switch (platform1) {
            case 'MEXC':
                orderBook1 = await getMEXCFuturesOrderBook(symbol1);
                break;
            case 'LBANK':
                orderBook1 = await connectLBankFuturesOrderBook(symbol1);
                break;
            case 'BYBIT':
                orderBook1 = await getBybitFuturesOrderBook(symbol1);
                break;
            case 'KUCOIN':
                orderBook1 = await getKucoinFuturesOrderBook(symbol1);
                break;
            case 'BITUNIX':
                orderBook1 = await getBitunixFuturesOrderBook(symbol1);
                break;
                
        }

        switch (platform2) {
            case 'MEXC':
                orderBook2 = await getMEXCFuturesOrderBook(symbol2);
                break;
            case 'LBANK':
                orderBook2 = await connectLBankFuturesOrderBook(symbol2);
                break;
            case 'BYBIT':
                orderBook2 = await getBybitFuturesOrderBook(symbol2);
                break;
            case 'KUCOIN':
                orderBook2 = await getKucoinFuturesOrderBook(symbol2);
                break;
            case 'BITUNIX':
                orderBook2 = await getBitunixFuturesOrderBook(symbol2);
                break;
    }}
    }
    else if(orderType == 'Market'){
        switch (arbitrageType) {
        case 'Spot':
            
            switch (platform1) {
                case 'MEXC':
                    getMEXCSpotPrice(symbol1);
                    break;
                case 'LBANK':
                    getLBankSpotPrice(symbol1);
                    break;
                case 'BYBIT':
                    getBybitSpotPrice(symbol1);
                    break;
                case 'KUCOIN':
                    getKucoinSpotPrice(symbol1);
                    break;
                case 'BITUNIX':
                    getBitunixSpotPrice(symbol1);
                    break;
                
            }

            switch (platform2) {
                case 'MEXC':
                    getMEXCSpotPrice(symbol2);
                    break;
                case 'LBANK':
                    getLBankSpotPrice(symbol2);
                    break;
                case 'BYBIT':
                    getBybitSpotPrice(symbol2);
                    break;
                case 'KUCOIN':
                    getKucoinSpotPrice(symbol2);
                    break;
                case 'BITUNIX':
                    getBitunixSpotPrice(symbol2);
                    break;
            }

            break;

        case 'Futures':

        switch (platform1) {
            case 'MEXC':
                merketPrice1 = await getMEXCFuturesPrice(symbol1);
                break;
            case 'LBANK':
                merketPrice1 = await getLBankFuturesPrice(symbol1);
                break;
            case 'BYBIT':
                merketPrice1 = await getBybitFuturesPrice(symbol1);
                break;
            case 'KUCOIN':
                merketPrice1 = await getKucoinFuturesPrice(symbol1);
                break;
            case 'BITUNIX':
                merketPrice1 = await getBitunixFuturesPrice(symbol1);
                break;
                
        }

        switch (platform2) {
            case 'MEXC':
                merketPrice2 = await getMEXCFuturesPrice(symbol2);
                break;
            case 'LBANK':
                merketPrice2 = await getLBankFuturesPrice(symbol2);
                break;
            case 'BYBIT':
                merketPrice2 = await getBybitFuturesPrice(symbol2);
                break;
            case 'KUCOIN':
                merketPrice2 = await getKucoinFuturesPrice(symbol2);
                break;
            case 'BITUNIX':
                merketPrice2 = await getBitunixFuturesPrice(symbol2);
                break;
    }}
    }
     // compare price here
     if (orderBook1 && orderBook2) {
        console.log(orderBook1, orderBook2);
/*
        if (
            arbitrageType === 'Futures' &&
            ((platform1 === 'MEXC' && platform2 === 'KUCOIN') || (platform1 === 'KUCOIN' && platform2 === 'MEXC'))
          ) {
            const fundingInfo = await runFundingAnalysis({ symbol: symbol1, spread: userSpread });
            console.log('📊 Funding info:', fundingInfo);
            userSpread = fundingInfo.adjustedSpread;
          }
*/
        await checkPrices({
            platform1, 
            platform2, 
            orderBook1, 
            orderBook2, 
            userSpread, 
            arbitrageType
        }).then((message) => {
            res.json({ message });
        }).catch((err) => {
            res.status(500).json({ message: 'Ошибка при проверке цен.' });
        });
    } else {
        res.status(400).json({ message: 'Ошибка при получении данных ордербуков.' });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
