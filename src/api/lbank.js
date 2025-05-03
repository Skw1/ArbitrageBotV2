// LBANK Parsing
const WebSocket = require('ws');
const axios = require('axios');
const path = require('path');
const zlib = require('zlib'); // для распаковки бинарных данных, если они сжаты

// LBank Spot Order Book
async function getLBankSpotOrderBook(symbol) {
    try {
        const res = await axios.get(`https://api.lbkex.com/v2/depth.do`, {
            params: {
               // symbol: symbol.toLowerCase(),
                size: 5,
                depth: 60
            }
        });

        const data = res.data;
        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
            console.log('=== 📈 LBank SPOT Order Book ===');
            console.log('Bids:', data.bids);
            console.log('Asks:', data.asks);
            return {
                bids: data.bids,
                asks: data.asks
            }
        } else {
            console.error('⚠️ Некорректный формат данных от LBank Spot:', data);
        }
    } catch (err) {
        console.error('❌ LBank Spot ошибка:', err.response?.status, err.response?.data, err.message);
    }
}

// LBank Futures Order Book (WebSocket)
async function connectLBankFuturesOrderBook(symbol) {
    const ws = new WebSocket('wss://www.lbkex.net/ws/V2/');

    ws.on('open', () => {
        const subscribeMsg = {
            action: "subscribe",
            subscribe: "depth",
            pair: symbol.toLowerCase(),
            depth: "60",
            binary: true
        };
        ws.send(JSON.stringify(subscribeMsg));
    });

    ws.on('message', (data) => {
        if (Buffer.isBuffer(data)) {
            try {
                const decompressed = zlib.gunzipSync(data).toString('utf-8');
                parseLBankFuturesMessage(decompressed);
            } catch (e) {
                try {
                    const fallback = data.toString('utf-8');
                    parseLBankFuturesMessage(fallback);
                } catch (e2) {
                    console.error('❌ Ошибка обработки бинарных данных LBank Futures:', e2.message);
                }
            }
        } else if (typeof data === 'string') {
            parseLBankFuturesMessage(data);
        }
    });

    ws.on('error', (err) => {
        console.error('❌ WebSocket ошибка LBank Futures:', err.message);
    });

    ws.on('close', () => {
        console.warn('⚠️ LBank Futures WebSocket закрыт.');
    });
}

function parseLBankFuturesMessage(rawData) {
    try {
        const message = JSON.parse(rawData);

        if (message.depth && Array.isArray(message.depth.bids) && Array.isArray(message.depth.asks)) {
            // console.log('=== 📈 LBank FUTURES Order Book ===');
            // console.log('Bids:', message.depth.bids);
            // console.log('Asks:', message.depth.asks);
            return {
                bids: message.depth.bids,
                asks: message.depth.asks
            }
        } else if (message.ping) {
            
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ action: "pong", pong: message.ping }));
            }
        }
    } catch (e) {
        console.error('❌ Ошибка парсинга сообщения LBank Futures:', e.message);
    }
}

module.exports = {
    getLBankSpotOrderBook,
    connectLBankFuturesOrderBook
};
