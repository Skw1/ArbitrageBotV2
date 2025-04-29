// OURBIT Parsing
/*
const axios = require('axios');

function getOurbitSpotOrderBook(symbol) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('wss://api.ourbit.com/market/ws');

        ws.on('open', () => {
            ws.send(JSON.stringify({
                method: "depth.subscribe",
                params: [symbol, 5, "0"],
                id: 1
            }));
        });

        ws.on('message', (data) => {
            const message = JSON.parse(data);
            if (message.method === "depth.update" && message.params) {
                const [orderbook] = message.params;
                resolve({
                    bids: orderbook.bids,
                    asks: orderbook.asks,
                    timestamp: Date.now()
                });
                ws.close();
            }
        });

        ws.on('error', (err) => {
            console.error("❌ Ourbit Spot WS error:", err.message);
            reject(null);
        });
    });
}

function getOurbitFuturesOrderBook(symbol) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('wss://contract.ourbit.com/ws');

        ws.on('open', () => {
            ws.send(JSON.stringify({
                method: "depth.subscribe",
                params: [symbol, 5, "0"],
                id: 1
            }));
        });

        ws.on('message', (data) => {
            const message = JSON.parse(data);
            if (message.method === "depth.update" && message.params) {
                const [orderbook] = message.params;
                resolve({
                    bids: orderbook.bids,
                    asks: orderbook.asks,
                    timestamp: Date.now()
                });
                ws.close();
            }
        });

        ws.on('error', (err) => {
            console.error("❌ Ourbit Futures WS error:", err.message);
            reject(null);
        });
    });
}

module.exports = {
    getOurbitSpotOrderBook,
    getOurbitFuturesOrderBook
};
*/