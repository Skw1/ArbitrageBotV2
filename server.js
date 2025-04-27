const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
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


async function isMEXCSymbolAvailable(symbol) {
    try {
        const res = await axios.get("https://contract.mexc.com/api/v1/contract/detail");
        return res.data.data.some(contract => contract.symbol === symbol);
    } catch (e) {
        console.error("Ошибка при получении контрактов MEXC:", e.message);
        return false;
    }
}

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

function connectLBankFutures() {
    const ws = new WebSocket('wss://www.lbkex.net/ws/V2/');

    ws.on('open', () => {
        const subscribeMsg = {
            action: "subscribe",
            subscribe: "depth",
            pair: lbankFuturesSymbol.toLowerCase(),
            depth: "60",
            binary: true
        };
        ws.send(JSON.stringify(subscribeMsg));
    });

    ws.on('message', (data) => {
        // Если бинарь — возможно сжат, попытаемся его распаковать
        if (Buffer.isBuffer(data)) {
            try {
                const decompressed = zlib.gunzipSync(data).toString('utf-8');
                parseLBankMessage(decompressed);
            } catch (e) {
                try {
                    // если не gzip, может быть обычная строка
                    const fallback = data.toString('utf-8');
                    parseLBankMessage(fallback);
                } catch (e2) {
                    console.error('❌ Ошибка при обработке бинарных данных LBank:', e2.message);
                }
            }
        } else if (typeof data === 'string') {
            parseLBankMessage(data);
        } else {
            console.warn('⚠️ Неизвестный формат сообщения от LBank:', data);
        }
    });

    ws.on('error', (err) => {
        console.error("❌ WebSocket ошибка:", err.message);
    });

    ws.on('close', () => {
        console.warn("⚠️ LBank WebSocket закрыт. Переподключение через 5 сек...");
        setTimeout(connectLBankFutures, 5000);
    });
}

function parseLBankMessage(rawData) {
    try {
        const message = JSON.parse(rawData);

        if (message.depth && Array.isArray(message.depth.bids) && Array.isArray(message.depth.asks)) {
            lbankOrderBook = {
                bids: message.depth.bids,
                asks: message.depth.asks,
                timestamp: Date.now()
            };
            comparePrices();
        } else if (message.ping) {
            // обработка ping
            ws.send(JSON.stringify({ action: "pong", pong: message.ping }));
        } else {
            console.log('ℹ️ Сообщение от LBank:', message);
        }
    } catch (e) {
        console.error("❌ Ошибка при парсинге сообщения от LBank:", e.message);
        console.error("Сырые данные:", rawData);
    }
}

let spread; 

// Обработка цен
function comparePrices() {
    const now = Date.now();
    if (!mexcOrderBook || !lbankOrderBook || now - lastComparisonTime < 1000) return;

    lastComparisonTime = now;

    const mexcBestBid = parseFloat(mexcOrderBook.bids[0][0]);
    const mexcBestAsk = parseFloat(mexcOrderBook.asks[0][0]);
    const lbankBestBid = parseFloat(lbankOrderBook.bids[0][0]);
    const lbankBestAsk = parseFloat(lbankOrderBook.asks[0][0]);

    console.log('\n=== 📊 Сравнение цен ===');
    console.log(`MEXC: Bid ${mexcBestBid} | Ask ${mexcBestAsk}`);
    console.log(`LBank: Bid ${lbankBestBid} | Ask ${lbankBestAsk}`);

    if (lbankBestAsk > mexcBestBid) {
        spread = ((lbankBestAsk - mexcBestBid) / mexcBestBid) * 100;
        console.log(`🔴 Арбитраж! Spread: ${spread.toFixed(2)}%`);
        console.log('→ SHORT на LBank по', lbankBestAsk);
        console.log('→ LONG на MEXC по', mexcBestBid);
    }

    if (lbankBestBid < mexcBestAsk) {
        spread = ((mexcBestAsk - lbankBestBid) / lbankBestBid) * 100;
        console.log(`🟢 Закрытие позиции! Spread: ${spread.toFixed(2)}%`);
        console.log('→ BUY на LBank по', lbankBestBid);
        console.log('→ SELL на MEXC по', mexcBestAsk);
    }
}

// Открытие и закрытие ордеров
function createOrder(){
    if(spread == userSpread || spread > 2){
      console.log(spread);
      console.log('→ SHORT на LBank по', lbankBestAsk);
      console.log('→ LONG на MEXC по', mexcBestBid); 

    }
    else if(spread == userSpread || spread < 2 ){
        console.log('→ BUY на LBank по', lbankBestBid);
        console.log('→ SELL на MEXC по', mexcBestAsk);
    }
    else{
        console.log('Ошибка создания ордеров');
    }


}

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
