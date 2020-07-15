let btn = document.querySelector('#submit')

btn.addEventListener('click', event => {
    console.log('...started')
    // event.preventDefault();
    let pmt = calculatePayment();
    
    let target = document.querySelector('#mortgage-payment')
    target.innerHTML = formatter.format(pmt)

})

const calculatePayment = () => {
    let principal = document.getElementById('principal').value
    if (typeof principal === "string") {
        principal = principal.replace(',','')
    }
    let rate = document.getElementById('rate').value / 12 / 100  
    let term = document.getElementById('term').value
    
    let a = Math.pow((1 + rate), term) //interest money cost factor
    let numerator = a * rate //the top part of the equation
    let denominator = a - 1  //the bottom part of the equation

    let payment = principal * numerator / denominator

    amortize(payment, rate, term, principal)
    
    return payment
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

const amortize = (payment, rate, term, balance) => {
    let amortizationSchedule = []
    for(let i = 0; i < term; i++) {
        let interestPaydown = balance * rate / 12
        let principalPaydown = payment - interestPaydown
        balance = balance - payment
        if(balance > payment) {
            amortizationSchedule.push([i, interestPaydown, principalPaydown, balance])
        } else {
            amortizationSchedule.push([i, 0, 0, balance])
        }
    }
    createTable(amortizationSchedule)
}

const createTable = (array) => {
    for(let i = 0; i < array.length - 1; i++){
        let newRow = document.createElement('tr')
        newRow.setAttribute('id', `row-${i}`)
        let tableSchedule = document.getElementById('table-to-fill')
        tableSchedule.appendChild(newRow)
        
        array[i].forEach((el, index) => {
            let tableData = document.createElement('td')
            tableData.setAttribute('id', `${el}-index`)
            tableData.value = el
            if(index == 0) {
                newRow.append(tableData.value)
            } else {
                newRow.append(formatter.format(tableData.value))
            }
        })
    }
}