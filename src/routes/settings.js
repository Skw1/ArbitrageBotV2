const express = require('express');
const path = require('path');
const { execArgv } = require('process');
const dotenv = require('dotenv')
const { env } = require('process');
const fs = require('fs')
const multer = require('multer')

const app = express()
app.use(express.json())
// reading .env file
let envPath = path.resolve(__dirname,'..', 'userData', '.env');
let envContent = fs.readFileSync(envPath, 'utf-8');

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
            envContent = envContent.replace(/^MEXC_ApiKey=.*/m, `MEXC_ApiKey=${api}`).replace(/^MEXC_SecretKey=.*/m, `MEXC_SecretKey=${key}`)
            break;
        case 'LBANK':
            envContent = envContent.replace(/^LBANK_ApiKey=.*/m, `LBANK_ApiKey=${api}`).replace(/^LBANK_SecretKey=.*/m, `LBANK_SecretKey=${key}`)
            break;
        case 'BYBIT':
            envContent = envContent.replace(/^BYBIT_ApiKey=.*/m, `BYBIT_ApiKey=${api}`).replace(/^BYBIT_SecretKey=.*/m, `BYBIT_SecretKey=${key}`)
            break;
        case 'KUCOIN':
            envContent = envContent.replace(/^KUCOIN_ApiKey=.*/m, `KUCOIN_ApiKey=${api}`).replace(/^KUCOIN_SecretKey=.*/m, `KUCOIN_SecretKey=${key}`)
            break;
        case 'OURBIT':
            envContent = envContent.replace(/^OURBIT_ApiKey=.*/m, `OURBIT_ApiKey=${api}`).replace(/^OURBIT_SecretKey=.*/m, `OURBIT_SecretKey=${key}`)
            break;
        case 'BITUNIX':
            envContent = envContent.replace(/^BITUNIX_ApiKey=.*/m, `BITUNIX_ApiKey=${api}`).replace(/^BITUNIX_SecretKey=.*/m, `BITUNIX_SecretKey=${key}`)
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
            envContent = envContent.replace(/^MEXC_ApiKey=.*/m, `MEXC_ApiKey=`).replace(/^MEXC_SecretKey=.*/m, `MEXC_SecretKey=`)
            break;
        case 'LBANK':
            envContent = envContent.replace(/^LBANK_ApiKey=.*/m, `LBANK_ApiKey=`).replace(/^LBANK_SecretKey=.*/m, `LBANK_SecretKey=`)
            break;
        case 'BYBIT':
            envContent = envContent.replace(/^BYBIT_ApiKey=.*/m, `BYBIT_ApiKey=`).replace(/^BYBIT_SecretKey=.*/m, `BYBIT_SecretKey=`)
            break;
        case 'KUCOIN':
            envContent = envContent.replace(/^KUCOIN_ApiKey=.*/m, `KUCOIN_ApiKey=`).replace(/^KUCOIN_SecretKey=.*/m, `KUCOIN_SecretKey=`)
            break;
        case 'OURBIT':
            envContent = envContent.replace(/^OURBIT_ApiKey=.*/m, `OURBIT_ApiKey=`).replace(/^OURBIT_SecretKey=.*/m, `OURBIT_SecretKey=`)
            break;
        case 'BITUNIX':
            envContent = envContent.replace(/^BITUNIX_ApiKey=.*/m, `BITUNIX_ApiKey=`).replace(/^BITUNIX_SecretKey=.*/m, `BITUNIX_SecretKey=`)
            break;
    }       
    fs.writeFileSync(envPath, envContent)
    res.json({message:`${platform} api/key has just been deleted`})
})  

app.post('/get-keys', async(req,res) => {
    let platform = req.body.service;
    let lines = envContent.split('\n');

    let ApiLine
    let KeyLine

    let Api;
    let Key;

    switch (platform) {
        case 'MEXC':
            ApiLine = lines.find(line => line.startsWith('MEXC_ApiKey='))
            KeyLine = lines.find(line => line.startsWith('MEXC_SecretKey='))
            Api = ApiLine.split('=')[1].trim()
            Key = KeyLine.split('=')[1].trim()
            break;
        case 'LBANK':
            ApiLine = lines.find(line => line.startsWith('LBANK_ApiKey='))
            KeyLine = lines.find(line => line.startsWith('LBANK_SecretKey='))
            Api = ApiLine.split('=')[1].trim()
            Key = KeyLine.split('=')[1].trim()
            break;
        case 'BYBIT':
            ApiLine = lines.find(line => line.startsWith('BYBIT_ApiKey='))
            KeyLine = lines.find(line => line.startsWith('BYBIT_SecretKey='))
            Api = ApiLine.split('=')[1].trim()
            Key = KeyLine.split('=')[1].trim()
            break;
        case 'KUCOIN':
            ApiLine = lines.find(line => line.startsWith('KUCOIN_ApiKey='))
            KeyLine = lines.find(line => line.startsWith('KUCOIN_SecretKey='))
            Api = ApiLine.split('=')[1].trim()
            Key = KeyLine.split('=')[1].trim()
            break;
        case 'OURBIT':
            ApiLine = lines.find(line => line.startsWith('OURBIT_ApiKey='))
            KeyLine = lines.find(line => line.startsWith('OURBIT_SecretKey='))
            Api = ApiLine.split('=')[1].trim()
            Key = KeyLine.split('=')[1].trim()
            break;
        case 'BITUNIX':
            ApiLine = lines.find(line => line.startsWith('BITUNIX_ApiKey='))
            KeyLine = lines.find(line => line.startsWith('BITUNIX_SecretKey='))
            Api = ApiLine.split('=')[1].trim()
            Key = KeyLine.split('=')[1].trim()
            break;
    }
    res.json({api:Api, key:Key})
})

module.exports = app