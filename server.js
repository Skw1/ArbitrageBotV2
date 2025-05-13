const express = require('express');
const multer = require('multer');
const path = require('path');
const zlib = require('zlib'); 
const fs = require('fs');

const PORT = 3000;
const app = express();

const envPath = path.resolve(__dirname, 'src', 'userData', '.env')
const envContent = fs.readFileSync(envPath, 'utf-8');

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
// const { getMEXCFuturesOrderBook, } = require('./src/market/mexc.js');
// const { connectLBankFuturesOrderBook } = require('./src/market/lbank.js');
// const { getBybitFuturesOrderBook } = require('./src/market/bybit.js');
// const { getKucoinFuturesOrderBook } = require('./src/market/kucoin.js');
// const { getBitunixFuturesOrderBook } = require('./src/market/bitunix.js');

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
let orderBook1
let orderBook2

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
    symbol1 = req.body.symbol1
    symbol2 = req.body.symbol2
    platform1 = req.body.platform1
    platform2 = req.body.platform2
    console.log(symbol1,symbol2,platform1,platform2, arbitrageType)
    
    switch (arbitrageType) {
        case 'Spot':
            
            switch (platform1) {
                case 'MEXC':
                    getMEXCSpotOrderBook(symbol1)
                    break;
                case 'LBANK':
                    getLBankSpotOrderBook(symbol1)
                    break;
                case 'BYBIT':
                    getBybitSpotOrderBook(symbol1)
                    break;
                case 'KUCOIN':
                    getKucoinSpotOrderBook(symbol1)
                    break;
                case 'BITUNIX':
                    getBitunixSpotOrderBook(symbol1);
                    break;
                
            }

            switch (platform2) {
                case 'MEXC':
                    getMEXCSpotOrderBook(symbol2)
                    break;
                case 'LBANK':
                    getLBankSpotOrderBook(symbol2)
                    break;
                case 'BYBIT':
                    getBybitSpotOrderBook(symbol2)
                    break;
                case 'KUCOIN':
                    getKucoinSpotOrderBook(symbol2)
                    break;
                case 'BITUNIX':
                    getBitunixSpotOrderBook(symbol2);
                    break;
            }

            break;
        case 'Futures':
            
        switch (platform1) {
            case 'MEXC':
                orderBook1 = await getMEXCFuturesOrderBook(symbol1)
                break;
            case 'LBANK':
                orderBook1 = await connectLBankFuturesOrderBook(symbol1)
                break;
            case 'BYBIT':
                orderBook1 = await getBybitFuturesOrderBook(symbol1)
                break;
            case 'KUCOIN':
                orderBook1 = await getKucoinFuturesOrderBook(symbol1)
                break;
            case 'BITUNIX':
                orderBook1 = await getBitunixFuturesOrderBook(symbol1);
                break;
                
        }

        switch (platform2) {
            case 'MEXC':
                orderBook2 = await getMEXCFuturesOrderBook(symbol2)
                break;
            case 'LBANK':
                orderBook2 = await connectLBankFuturesOrderBook(symbol2)
                break;
            case 'BYBIT':
                orderBook2 = await getBybitFuturesOrderBook(symbol2)
                break;
            case 'KUCOIN':
                orderBook2 = await getKucoinFuturesOrderBook(symbol2)
                break;
            case 'BITUNIX':
                orderBook2 = await getBitunixFuturesOrderBook(symbol2);
                break;
    }}
    
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

app.post('/checking-keys', async(req,res) => {
    let service1 = req.body.service1;
    let service2 = req.body.service2;
    
    try {
        const lines = envContent.split('\n');
        // fisrt platform
        let ApiLineservice1;
        let Apiservice1;

        let KeyLineservice1;
        let Keyservice1;

        let PassphraseLine1;
        let Passphrase1;

        // second platform
        let ApiLineservice2;
        let Apiservice2;

        let KeyLineservice2;
        let Keyservice2;

        let PassphraseLine2;
        let Passphrase2;
        switch (service1) {
                case 'MEXC':
                    ApiLineservice1 = lines.find(line => line.startsWith('MEXC_ApiKey='))
                    Apiservice1 = ApiLineservice1.split('=')[1].trim()
                    KeyLineservice1 = lines.find(line => line.startsWith('MEXC_SecretKey='))
                    Keyservice1 = KeyLineservice1.split('=')[1].trim()
                    break;
                case 'LBANK':
                    ApiLineservice1 = lines.find(line => line.startsWith('LBANK_ApiKey='))
                    Apiservice1 = ApiLineservice1.split('=')[1].trim()
                    KeyLineservice1 = lines.find(line => line.startsWith('LBANK_SecretKey='))
                    Keyservice1 = KeyLineservice1.split('=')[1].trim()
                    break;
                case 'BYBIT':
                    ApiLineservice1 = lines.find(line => line.startsWith('BYBIT_ApiKey='))
                    Apiservice1 = ApiLineservice1.split('=')[1].trim()
                    KeyLineservice1 = lines.find(line => line.startsWith('BYBIT_SecretKey='))
                    Keyservice1 = KeyLineservice1.split('=')[1].trim()
                    break;
                case 'KUCOIN':
                    ApiLineservice1 = lines.find(line => line.startsWith('KUCOIN_ApiKey='))
                    Apiservice1 = ApiLineservice1.split('=')[1].trim();
                    KeyLineservice1 = lines.find(line => line.startsWith('KUCOIN_SecretKey='))
                    Keyservice1 = KeyLineservice1.split('=')[1].trim()
                    PassphraseLine1 = lines.find(line => line.startsWith('KUCOIN_Passphrase'))
                    Passphrase1 = PassphraseLine1.split('=')[1].trim()
                    break;
                case 'BITUNIX':
                    ApiLineservice1 = lines.find(line => line.startsWith('BITUNIX_ApiKey='))
                    Apiservice1 = ApiLineservice1.split('=')[1].trim()
                    KeyLineservice1 = lines.find(line => line.startsWith('BITUNIX_SecretKey='))
                    Keyservice1 = KeyLineservice1.split('=')[1].trim()
                    break;
            }

        switch (service2) {
                case 'MEXC':
                    ApiLineservice2 = lines.find(line => line.startsWith('MEXC_ApiKey='))
                    Apiservice2 = ApiLineservice2.split('=')[1].trim()
                    KeyLineservice2 = lines.find(line => line.startsWith('MEXC_SecretKey='))
                    Keyservice2 = KeyLineservice2.split('=')[1].trim()
                    break;
                case 'LBANK':
                    ApiLineservice2 = lines.find(line => line.startsWith('LBANK_ApiKey='))
                    Apiservice2 = ApiLineservice2.split('=')[1].trim()
                    KeyLineservice2 = lines.find(line => line.startsWith('LBANK_SecretKey='))
                    Keyservice2 = KeyLineservice2.split('=')[1].trim()
                    break;
                case 'BYBIT':
                    ApiLineservice1 = lines.find(line => line.startsWith('BYBIT_ApiKey='))
                    Apiservice1 = ApiLineservice1.split('=')[1].trim();
                    KeyLineservice1 = lines.find(line => line.startsWith('BYBIT_SecretKey='))
                    Keyservice1 = KeyLineservice1.split('=')[1].trim()
                    break;
                case 'KUCOIN':
                    ApiLineservice2 = lines.find(line => line.startsWith('KUCOIN_ApiKey='))
                    Apiservice2 = ApiLineservice2.split('=')[1].trim();
                    KeyLineservice2 = lines.find(line => line.startsWith('KUCOIN_SecretKey='))
                    Keyservice2 = KeyLineservice2.split('=')[1].trim()
                    PassphraseLine2 = lines.find(line => line.startsWith('KUCOIN_Passphrase'))
                    Passphrase2 = PassphraseLine2.split('=')[1].trim()
                    break;
                case 'BITUNIX':
                    ApiLineservice2 = lines.find(line => line.startsWith('BITUNIX_ApiKey='))
                    Apiservice2 = ApiLineservice2.split('=')[1].trim()
                    KeyLineservice2 = lines.find(line => line.startsWith('BITUNIX_SecretKey='))
                    Keyservice2 = KeyLineservice2.split('=')[1].trim()
                    break;
            }

        return res.json({service1Api: Apiservice1, service1Key:Keyservice1, service2Api: Apiservice2, service2Key: Keyservice2, service1Pass: Passphrase1, service2Pass:Passphrase2})
    }
    catch(e) {
        return res.json({success: false, message:`something went wrong ${e}`})
    }
})


app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
