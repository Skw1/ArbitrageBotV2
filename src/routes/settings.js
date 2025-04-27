const express = require('express');
const path = require('path');
const { execArgv } = require('process');
const dotenv = require('dotenv')
const { env } = require('process');
const fs = require('fs')
const multer = require('multer')

const app = express()
// reading .env file
let envContent = fs.readFileSync('.env', 'utf-8');
let envPath = path.resolve(__dirname,'..', '..', '.env');

// settings storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// changing api/key

app.post('/settings', upload.none(), (req,res) => {
    let api = req.body.api;
    let key = req.body.key;
    let platform = req.body.platform;

    switch (platform) {
        case 'MEXC':
            envContent = envContent.replace(/^MEXC_Api=.*/m, `MEXC_Api=${api}`).replace(/^MEXC_Key=.*/m, `MEXC_Key=${key}`)
            break;
        case 'LBANK':
            envContent = envContent.replace(/^LBANK_Api=.*/m, `LBANK_Api=${api}`).replace(/^LBANK_Key=.*/m, `LBANK_Key=${key}`)
            break;
        case 'BYBIT':
            envContent = envContent.replace(/^BYBIT_Api=.*/m, `BYBIT_Api=${api}`).replace(/^BYBIT_Key=.*/m, `BYBIT_Key=${key}`)
            break;
        case 'KUCOIN':
            envContent = envContent.replace(/^KUCOIN_Api=.*/m, `KUCOIN_Api=${api}`).replace(/^KUCOIN_Key=.*/m, `KUCOIN_Key=${key}`)
            break;
        case 'OURBIT':
            envContent = envContent.replace(/^OURBIT_Api=.*/m, `OURBIT_Api=${api}`).replace(/^OURBIT_Key=.*/m, `OURBIT_Key=${key}`)
            break;
        case 'BITUNIX':
            envContent = envContent.replace(/^BITUNIX_Api=.*/m, `BITUNIX_Api=${api}`).replace(/^BITUNIX_Key=.*/m, `BITUNIX_Key=${key}`)
            break;
    }       
    fs.writeFileSync(envPath, envContent);
    res.json({
        message:'You have successfuly changed api/key'
    })
})

app.post('/deleting', upload.none(), (req,res) => {
    let platform = req.body.platform;

    switch (platform) {
        case 'MEXC':
            envContent = envContent.replace(/^MEXC_Api=.*/m, `MEXC_Api=`).replace(/^MEXC_Key=.*/m, `MEXC_Key=`)
            break;
        case 'LBANK':
            envContent = envContent.replace(/^LBANK_Api=.*/m, `LBANK_Api=`).replace(/^LBANK_Key=.*/m, `LBANK_Key=`)
            break;
        case 'BYBIT':
            envContent = envContent.replace(/^BYBIT_Api=.*/m, `BYBIT_Api=`).replace(/^BYBIT_Key=.*/m, `BYBIT_Key=`)
            break;
        case 'KUCOIN':
            envContent = envContent.replace(/^KUCOIN_Api=.*/m, `KUCOIN_Api=`).replace(/^KUCOIN_Key=.*/m, `KUCOIN_Key=`)
            break;
        case 'OURBIT':
            envContent = envContent.replace(/^OURBIT_Api=.*/m, `OURBIT_Api=`).replace(/^OURBIT_Key=.*/m, `OURBIT_Key=`)
            break;
        case 'BITUNIX':
            envContent = envContent.replace(/^BITUNIX_Api=.*/m, `BITUNIX_Api=`).replace(/^BITUNIX_Key=.*/m, `BITUNIX_Key=`)
            break;
    }       
    fs.writeFileSync(envPath, envContent)
    res.json({message:`${platform} api/key has just been deleted`})
})  


module.exports = app