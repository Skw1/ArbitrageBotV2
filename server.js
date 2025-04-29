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


// Test Mexc Price Parsing
const { getMEXCSpotOrderBook, getMEXCFuturesOrderBook, } = require('./src/api/mexc.js');
async function mexcTest() {
    const spotSymbol = 'CETUSUSDT';
    const futuresSymbol = 'CETUS_USDT'; 
    console.log(await getMEXCSpotOrderBook(spotSymbol));
    console.log(await getMEXCFuturesOrderBook(futuresSymbol));
}
console.log("MEXC");
mexcTest();

// Test LBank Price Parsing
const { getLBankSpotOrderBook, connectLBankFuturesOrderBook } = require('./src/api/lbank.js');
async function lbankTest() {
    const spotSymbol = 'cetus_usdt';
    const futuresSymbol = 'CETUS_USDT'; 
    console.log(await getLBankSpotOrderBook(spotSymbol));
    console.log(await connectLBankFuturesOrderBook(futuresSymbol));
}
console.log("LBANK");
lbankTest();

// Test ByBit Price Parsing
const { getBybitSpotOrderBook, getBybitFuturesOrderBook } = require('./src/api/bybit.js');
async function bybitTest() {
    const spotSymbol = 'CETUSUSDT';
    const futuresSymbol = 'CETUSUSDT'; 
    console.log(await getBybitSpotOrderBook(spotSymbol));
    console.log(await getBybitFuturesOrderBook(futuresSymbol));
}
console.log("BYBIT");
bybitTest();

// Test KuCoin Price Parsing
const { getKucoinSpotOrderBook, getKucoinFuturesOrderBook } = require('./src/api/kucoin.js');
async function kucoinTest() {
    const spotSymbol = 'CETUS-USDT';
    const futuresSymbol = 'CETUSUSDTM'; // для фьючерсов на Kucoin нужно в конце добавлять M (BTCUSDTM почему то нету)
    console.log(await getKucoinSpotOrderBook(spotSymbol));
    console.log(await getKucoinFuturesOrderBook(futuresSymbol));
}
console.log("KUCOIN");
kucoinTest();

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
// Test Bitunix Price Parsing
const { getBitunixSpotOrderBook, getBitunixFuturesOrderBook } = require('./src/api/bitunix.js');
async function bitunixTest() {
    const spotSymbol = 'CETUSUSDT';
    const futuresSymbol = 'CETUSUSDT'; 
    console.log(await getBitunixSpotOrderBook(spotSymbol));
    console.log(await getBitunixFuturesOrderBook(futuresSymbol));
}
console.log("BITUNIX");
bitunixTest();

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
    
    switch (arbitrageType) {
        case 'Spot':
            
            switch (platform1) {
                
            }

            switch (platform2) {
                
            }

            break;
        case 'Futures':
            
            switch (platform1) {
                
            }

            switch (platform2) {
                
            }
            break;
    }


});


app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
