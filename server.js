const express = require('express');
const multer = require('multer');
const path = require('path');
const zlib = require('zlib'); // для распаковки бинарных данных, если они сжаты

const PORT = 3000;
const app = express();

app.use('/', require('./src/routes/settings'))
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// getting prices functions
const { getMEXCSpotOrderBook, getMEXCFuturesOrderBook, } = require('./src/api/mexc.js');
const { getLBankSpotOrderBook, connectLBankFuturesOrderBook } = require('./src/api/lbank.js');
const { getBybitSpotOrderBook, getBybitFuturesOrderBook } = require('./src/api/bybit.js');
const { getKucoinSpotOrderBook, getKucoinFuturesOrderBook } = require('./src/api/kucoin.js');
const { getBitunixSpotOrderBook, getBitunixFuturesOrderBook } = require('./src/api/bitunix.js');




// Test OurBit Price Parsing
/*
const { getOurbitSpotOrderBook, getOurbitFuturesOrderBook } = require('./src/api/ourbit.js');
async function ourbitTest() {
    const spotSymbol = 'CETUSUSDT';
    const futuresSymbol = 'CETUSUSDT'; 
    console.log(await getOurbitSpotOrderBook(spotSymbol));
    console.log(await getOurbitFuturesOrderBook(futuresSymbol));
}
console.log("OURBIT");
ourbitTest();
*/



let userQuantity;
let userSpread;
let arbitrageType;
let lastComparisonTime = 0;

// platforms/platform`s symbols
let symbol1
let symbol2
let platform1
let platform2

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
                case 'BYBIT':
                    getBybitSpotOrderBook(symbol1)
                    break;
                case 'KUCION':
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
                case 'BYBIT':
                    getBybitSpotOrderBook(symbol2)
                    break;
                case 'KUCION':
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
                getMEXCFuturesOrderBook(symbol1)
            break;
            case 'LBANK':
                connectLBankFuturesOrderBook(symbol1)
            case 'BYBIT':
                getBybitFuturesOrderBook(symbol1)
                break;
            case 'KUCION':
                getKucoinFuturesOrderBook(symbol1)
                break;
            case 'BITUNIX':
                getBitunixFuturesOrderBook(symbol1);
                break;
                
        }

        switch (platform2) {
            case 'MEXC':
                getMEXCFuturesOrderBook(symbol2)
            break;
            case 'LBANK':
                connectLBankFuturesOrderBook(symbol2)
            case 'BYBIT':
                getBybitFuturesOrderBook(symbol2)
                break;
            case 'KUCION':
                getKucoinFuturesOrderBook(symbol2)
                break;
            case 'BITUNIX':
                getBitunixFuturesOrderBook(symbol2);
                break;
    }}

    // compare price here
    // functiontocompare(firstprice, second);


});


app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
