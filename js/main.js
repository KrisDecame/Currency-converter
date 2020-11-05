const xhrFunction = (link) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', link);
        xhr.addEventListener('loadend', () => {
            const data = JSON.parse(xhr.responseText);
            resolve(data)
        })
        xhr.send();
    })
}
const valuteSelectElements = document.querySelectorAll('.value-select');

const firstValuteSelectElement = document.querySelector('#first-valute-select');
const secondValuteSelectElement = document.querySelector('#second-valute-select');
const convertButton = document.querySelector('#convert-button');
const changeValuteButton = document.querySelector('#change-valute');
const inputValue = document.querySelector('#value-input');
const currencyValueElement = document.querySelector('.currency-value');
let first;
let second;

let selectElementHTML;

const createData = async (selectElements) => {
    const data = await xhrFunction('http://api.currencylayer.com/live?access_key=9607596d0edd20cd8476166232523834&format=1')
    const currencyQuotes = data.quotes;

    for (let key in currencyQuotes) {
        if (currencyQuotes.hasOwnProperty(key)) {
            let cleanedKey = key.slice(3);
            const value = currencyQuotes[key];

            selectElementHTML += `<option data-value="${value}">${cleanedKey}</option>`
        }
    }

    for (const element of selectElements) {
        element.innerHTML += selectElementHTML;
    }

    for (let i = 0; i < firstValuteSelectElement.options.length; i++) {
        if (firstValuteSelectElement.options[i].value === 'HRK') {
            firstValuteSelectElement.selectedIndex = i;
            first = i;
        } 
    }

    for (let i = 0; i < secondValuteSelectElement.options.length; i++) {
        if (secondValuteSelectElement.options[i].value === 'EUR') {
            secondValuteSelectElement.selectedIndex = i;
            second = i;
        } 
    }
    
    firstValuteSelectElement.onchange = (e) => {
        first = e.target.selectedIndex;
    }
    
    secondValuteSelectElement.onchange = (e) => {
        second = e.target.selectedIndex;
    }

    changeValuteButton.addEventListener('click', () => {
        firstValuteSelectElement.selectedIndex = second;
        secondValuteSelectElement.selectedIndex = first;
        [first, second] = [second, first];
    })

    convertButton.addEventListener('click', () => {
        let inputValueValue = inputValue.value;
        const firstValue = firstValuteSelectElement.options[firstValuteSelectElement.selectedIndex].dataset.value;
        const secondValue = secondValuteSelectElement.options[secondValuteSelectElement.selectedIndex].dataset.value;
        const quote = (secondValue / firstValue)
        
        if (inputValueValue === '') {
            inputValueValue = 1;
        }

        const result =  quote * inputValueValue;

        console.log(result);
        console.log(`1 ${firstValuteSelectElement.value} = ${quote} ${secondValuteSelectElement.value}`);
        currencyValueElement.innerHTML = `${result} ${secondValuteSelectElement.value}`;
    })
}


createData(valuteSelectElements);