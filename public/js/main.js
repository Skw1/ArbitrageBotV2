// main.js for Front-End Interaction

import { Notify } from 'https://unpkg.com/clean-toasts?module';

// choosing platforms/arbitrageTypes
const buttonsPlatform1 = document.querySelectorAll('.platform1');
const buttonsPlatform2 = document.querySelectorAll('.platform2');
const buttonsArbitrageType = document.querySelectorAll('.trade-item-button');
const buttonsOrderType = document.querySelectorAll('.order-item-button');

// Inputs
const tickerInput = document.getElementById('ticker-input');
const quantityInput = document.getElementById('quantity-input');
const spreadInput = document.getElementById('spread-input');

// Start Button
const startButton = document.getElementById('start-btn');

// Clear Logs Button
const clearLogsBtn = document.querySelector('.clear-logs-button');

// Result DIV for user
const resultDiv = document.getElementById('result-div');

// Stop Button
const stopButton = document.getElementById('stop-btn');

let platform1;
let platform2;
let arbitrageType;
let orderType;
let symbol1;
let symbol2;

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
buttonsOrderType.forEach(btn => {
    btn.addEventListener('click', () =>{
        buttonsOrderType.forEach(butt => {butt.classList.remove('active')})
        btn.classList.add('active');
        orderType = btn.innerText
    })
})

// Clear Logs
clearLogsBtn.addEventListener('click', (e) => {
    e.preventDefault()
    resultDiv.innerHTML = 'No Data';
    Notify.warning('⚠️ Logs Cleared');
});

// Stop Button
stopButton.addEventListener('click', (e) => {
    e.preventDefault()
    Notify.error('Бот Остановлен');
});

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


// Tiker Converter for Spot and Futures
startButton.addEventListener('click' , async(e) => {
    e.preventDefault();
    const ticker = tickerInput.value;
    const spread = spreadInput.value;
    const quantity = quantityInput.value;
    resultDiv.innerHTML = '<p>Загрузка...</p>'; 
    if (platform1 == platform2) {
        Notify.warning('Вы не можете выбрать одинаковые платформы');
    } else if (!arbitrageType) {
        Notify.warning('Вы не выбрали тип торговли');
    } else if (!orderType) {
        Notify.warning('Вы не выбрали тип ордеров');
    } else {
        try {
            const response = await fetch('/checking-keys', {
                method: 'post',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({service1:platform1, service2:platform2})
            })

            const data = await response.json()

            if (data) {
                       console.log(data)
                if (data.success === false) {
                    Notify.error('something went wrong');
                    //resultDiv.innerHTML = data.message;
                    return;
                }
                if (!data.service1Api || !data.service1Key) {
                    Notify.error(`Заполните API и Secret ключи для ${platform1}`)
                   // resultDiv.innerHTML = `Заповніть api/ключи для ${platform1}`
                    return;
                }
                if (!data.service2Api || !data.service2Key) {
                    Notify.error(`Заполните API и Secret ключи для ${platform2}`)
                  // resultDiv.innerHTML = `Заповніть api/ключи для ${platform2}`
                    return;
                }
                if (platform1.trim().toLowerCase() == 'kucoin' && !data.service1Pass) {
                    Notify.error(`Заполните passphase для ${platform1}`)
                  //  resultDiv.innerHTML = `Заповніть passphase для ${platform1}`
                    return;
                }
                if (platform2.trim().toLowerCase() == 'kucoin' && !data.service2Pass) {
                    Notify.error(`Заполните passphase для ${platform2}`)
                   // resultDiv.innerHTML = `Заповніть passphase для ${platform2}`
                    return;
                }
                
        Notify.success('Бот запущен!');
        
        if (orderType == 'Limit' && arbitrageType == 'Spot'){
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
        else if (orderType == 'Limit' && arbitrageType == 'Futures') {
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
        else if (orderType == 'Market' && arbitrageType == 'Spot') {
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
        else if(orderType == 'Market' && arbitrageType == 'Futures'){
            switch (platform1) {
                case 'MEXC':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '/USDT'); // BTC/USDT 
                    break;
                case 'LBANK':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '/USDT'); // BTC/USDT
                    break;
                case 'BYBIT':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT 
                    break;
                case 'KUCOIN':
                    symbol1 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '/USDT:USDT'); // BTC/USDT:USDT
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
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '/USDT'); // BTC/USDT
                    break;
                case 'LBANK':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '/USDT'); // BTC/USDT
                    break;
                case 'BYBIT':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
                case 'KUCOIN':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX').replace('USDT', '/USDT:USDT'); // BTC/USDT:USDT
                    break;
                case 'OURBIT':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
                case 'BITUNIX':
                    symbol2 = ticker.toUpperCase().replace(' ','').replace('TRON','TRX'); // BTCUSDT
                    break;
            }
        }
    }

   // FormData
   const formData = new FormData();
   formData.append('symbol1', symbol1);
   formData.append('symbol2', symbol2);
   formData.append('userSpread', spread);
   formData.append('userQuantity', quantity);
   formData.append('arbitrageType', arbitrageType);
   formData.append('orderType', orderType);
   formData.append('platform1', platform1);
   formData.append('platform2', platform2);

   try {
       const response = await fetch('/sendingInfo', {
           method: 'POST',
           body: formData
       });

       if (!response.ok) {
           throw new Error('Не удалось получить данные');
       }

       const data = await response.json();


       resultDiv.innerHTML = `
           <div class="log-message">
               <p>${data.message}</p>
           </div>
       `;
       resultDiv.scrollTop = resultDiv.scrollHeight;
   } catch (error) {
       console.error('Ошибка:', error);
       Notify.error('Ошибка');
       resultDiv.innerHTML = `<p class="error">Произошла ошибка. </br> Попробуйте снова.</p>`;
   }
}  
 catch(e) {
    Notify.error(e)
 }} 
});
