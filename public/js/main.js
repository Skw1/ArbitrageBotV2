// main.js for Front-End Interaction

// choosing platforms/arbitrageTypes
const buttonsPlatform1 = document.querySelectorAll('.platform1');
const buttonsPlatform2 = document.querySelectorAll('.platform2');
const buttonsArbitrageType = document.querySelectorAll('.trade-item-button')

let platform1;
let platform2;
let arbitrageType;

buttonsPlatform1.forEach(btn => {
    btn.addEventListener('click', () =>{
        buttonsPlatform1.forEach(butn => {butn.classList.remove('active')})
        btn.classList.add('active');
        platform1 = btn.innerText;
    })
})

buttonsPlatform2.forEach(btn => {
    btn.addEventListener('click', () =>{
        buttonsPlatform2.forEach(butn => {butn.classList.remove('active')})
        btn.classList.add('active');
        platform2 = btn.innerText;
    })
})

buttonsArbitrageType.forEach(btn => {
    btn.addEventListener('click', () =>{
        buttonsArbitrageType.forEach(butt => {butt.classList.remove('active')})
        btn.classList.add('active');
        arbitrageType = btn.innerText
    })
})


// Settings:
const mexcUserApiKey = document.getElementById('mexc-apikey-input');
const mexcUserSecretKey = document.getElementById('mexc-secretkey-input');

const lbankUserApiKey = document.getElementById('lbank-apikey-input');
const lbankUserSecretKey = document.getElementById('lbank-secretkey-input');

const bybitUserApiKey = document.getElementById('bybit-apikey-input');
const bybitUserSecretKey = document.getElementById('bybit-secretkey-input');

const kucoinUserApiKey = document.getElementById('kucoin-apikey-input');
const kucoinUserSecretKey = document.getElementById('kucoin-secretkey-input');

const ourbitUserApiKey = document.getElementById('ourbit-apikey-input');
const ourbitUserSecretKey = document.getElementById('ourbit-secretkey-input');

const biunixUserApiKey = document.getElementById('biunix-apikey-input');
const biunixUserSecretKey = document.getElementById('biunix-secretkey-input');

// Form:

// Inputs
const tickerInput = document.getElementById('ticker-input');
const quantityInput = document.getElementById('quantity-input');
const spreadInput = document.getElementById('spread-input');

// Start Button
const startButton = document.getElementById('start-btn');

// Result DIV for user
const resultDiv = document.getElementById('result-div');

// Tiker Converter for Spot and Futures
startButton.addEventListener('click' , async(e) => {
    e.preventDefault()
    const ticker = tickerInput.value;
    const spread = spreadInput.value;
    const quantity = quantityInput.value;

    if(platform1 == platform2) {
        alert('you can`t use same')
    }
    else if (!arbitrageType) {
        alert('you haven`t choosed type yet')
    }
    else {
        // Symbols 
        let symbol1;
        let symbol2;
        if (arbitrageType == 'Spot') {

            switch (platform1) {
                case 'MEXC':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
                case 'LBANK':
                    symbol1 = ticker.toLowerCase().replace('usdt', '_usdt').replace(' ','').replace('tron','trx'); // btc_usdt
                    break;
                case 'BYBIT':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
                case 'KUCOIN':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '-USDT'); // BTC-USDT
                    break;
                case 'OURBIT':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT // ?
                    break;
                case 'BITUNIX':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
            }
            switch (platform2) {
                case 'MEXC':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
                case 'LBANK':
                    symbol2 = ticker.toLowerCase().replace('usdt', '_usdt').replace(' ','').replace('tron','trx'); // btc_usdt
                case 'BYBIT':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
                case 'KUCOIN':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '-USDT'); // BTC-USDT
                    break;
                case 'OURBIT':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT // ?
                    break;
                case 'BITUNIX':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
            }
        }
        // Futures
        else {
            switch (platform1) {
                case 'MEXC':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '_USDT'); // BTC_USDT 
                    break;
                case 'LBANK':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '_USDT'); // BTC_USDT
                    break;
                case 'BYBIT':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT 
                    break;
                case 'KUCOIN':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', 'USDM'); // BTCUSDM
                    break;
                case 'OURBIT':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT 
                    break;
                case 'BITUNIX':
                    symbol1 =  ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT 
                    break;
            }
            switch (platform2) {
                case 'MEXC':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '_USDT'); // BTC_USDT
                    break;
                case 'LBANK':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '_USDT'); // BTC_USDT
                    break;
                case 'BYBIT':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
                case 'KUCOIN':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', 'USDM'); // BTCUSDM
                    break;
                case 'OURBIT':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
                case 'BITUNIX':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
            }
        }
        // Form Data
        const formData = new FormData();

        // API Keys and Secret Keys
        formData.append("mexcUserApiKey" ,  mexcUserApiKey);
        formData.append("mexcUserSecretKey" ,  mexcUserSecretKey);

        formData.append("lbankUserApiKey" ,  lbankUserApiKey);
        formData.append("lbankUserSecretKey" ,  lbankUserSecretKey);

        formData.append("bybitUserApiKey" ,  bybitUserApiKey);
        formData.append("bybitUserSecretKey" ,  bybitUserSecretKey);

        formData.append("kucoinUserApiKey" ,  kucoinUserApiKey);
        formData.append("kucoinUserSecretKey" ,  kucoinUserSecretKey);

        formData.append("ourbitUserApiKey" ,  ourbitUserApiKey);
        formData.append("ourbitUserSecretKey" ,  ourbitUserSecretKey);

        formData.append("biunixUserApiKey" ,  biunixUserApiKey);
        formData.append("biunixUserSecretKey" ,  biunixUserSecretKey);

        
        // Symbols 
        formData.append('symbol1', symbol1)
        formData.append('symbol2', symbol2)

        // Inputs
        formData.append("userSpread" , spread);
        formData.append("userQuantity" , quantity);

        // Arbitrage Type
        formData.append('arbitrageType', arbitrageType)
      
        // platforms
        formData.append('platform1', platform1)
        formData.append('platform2', platform2)
        try{
            const response = await fetch('/sendingInfo', {
                method: 'post',
                body: formData
            })
        }
        catch(e){
            console.log(e);
        }
        }
});



