// valuables
import { Notify } from 'https://unpkg.com/clean-toasts?module';
let platform = 'MEXC';

window.addEventListener('DOMContentLoaded', async() => {
    try {
        const response = await fetch('/get-keys', {
            method:'post',
            body:JSON.stringify({service: 'MEXC'}),
            headers: {'Content-Type': 'application/json'},
        })

        const data = await response.json()

        if (data) {
            if (data.api == '') {
                document.querySelector('#api').value = '';
            }
            else {
                document.querySelector('#api').value = data.api;
            }
            if(data.key == '') {
                document.querySelector('#key').value = '';
            }
            else {
                document.querySelector('#key').value = data.key;
            }
    }
    }
    catch(e) {
        Notify.error('Ошибка!');
        console.log(e);
    }})

let platformsOption = document.querySelectorAll('.form-list-item-button');

platformsOption.forEach(btn => {
    btn.addEventListener('click', async() => {
        platformsOption.forEach(buttons => {buttons.classList.remove('active')})
        platform = btn.innerText;
        btn.classList.add('active');

        try {
            const response = await fetch('/get-keys', {
                method:'post', 
                body:JSON.stringify({service: platform}),
                headers: {'Content-Type': 'application/json'},
            });

            const data = await response.json();
            
            if (data) {
               if(data.api == '') {
                    document.querySelector('#api').value = '';
               }
               else {
                    document.querySelector('#api').value = data.api
               }
               if (data.key == '') {
                    document.querySelector('#key').value = '';
               }
               else {
                    document.querySelector('#key').value = data.key
               }
            }

        }
        catch(e) {
            Notify.error('Ошибка!');
            console.log(e);
        }
    })
})


// saving info

document.querySelector('.save-btn').addEventListener('click', async(e)=> {
    e.preventDefault();
    let api = document.querySelector('#api').value;
    let key = document.querySelector('#key').value;
    if (api == '' || key == '') {
        //alert('fill all fields');
        Notify.warning('Заполните все поля!');
    }

    else {
        const formData = new FormData()
        formData.append('api', api)
        formData.append('key', key)
        formData.append('platform', platform)

       try {
            const response = await fetch('/settings', {
                method: 'POST',
                body:formData
            })

            const result = await response.json();

            if (result) {
                Notify.success('Ваши ключи сохранены!');
               // document.querySelector('.result-message').innerText = result.message
               // document.querySelector('.result-message').style.opacity = '1'
                document.querySelector('#api').value = '';
                document.querySelector('#key').value = '';
            }
       }
       catch(e) {
        console.log(e);
        Notify.error('Ошибка!');
       }
}})
  
// clearing info
document.querySelector('#clear-btn').addEventListener('click', async(e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('platform', platform)

    try {
       const response = await fetch('/deleting', {
            method:'post',
            body:formData
       })

       const result = await response.json();

       if (result) {
        Notify.success('Ваши ключи удалены!');
        //document.querySelector('.result-message').innerText = result.message
       // document.querySelector('.result-message').style.opacity = '1'
    }
    }
    catch(e) {
        console.log(e);
        Notify.error('Ошибка!');
    }
})