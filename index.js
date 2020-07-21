let btn = document.querySelector('#submit')
let form = document.querySelector('form.mortgage-group')

btn.addEventListener('click', event => {
    event.preventDefault()
    mortgageMath()
})

form.addEventListener('submit', event => {
    event.preventDefault()
    mortgageMath()
})

const mortgageMath = () => {
    let pmt = calculatePayment()
    let target = document.querySelector('#mortgage-payment')
    target.innerHTML = formatter.format(pmt)
    toggleTable()
}

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

    totalPaid(payment, term, principal)
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
    for(let i = 0; i < term + 1; i++) {
        let interestPaydown = balance * rate
        let principalPaydown = payment - interestPaydown
        balance -= principalPaydown
        if(balance > payment) {
            amortizationSchedule.push([i, principalPaydown, interestPaydown, balance])
        }
        if(balance < 0) {
            break
        }
    }
    createTable(amortizationSchedule)
}

const createTable = (array) => {
    for(let i = 1; i < array.length - 1; i++) {
        let table = document.getElementById('table-to-fill')
        let row = table.insertRow()
        array[i].forEach((el, index) => {
            let cell = row.insertCell()
            
            if (index == 0) {
                cell.innerHTML = el
            } else {
                cell.innerHTML = formatter.format(el)
            }
        })
    }
}

const toggleTable = () => {
    let mortgageSchedule = document.querySelector('.table-body-schedule')
    mortgageSchedule.style.visibility = 'visible'
}

const totalPaid = (payment, term, principal) => {
    let totalPayment = document.querySelector('#mortgage-total')
    let total = payment * term
    totalPayment.innerHTML = `${formatter.format(total)}`
    calculateInterest(total, principal)
}

const calculateInterest = (total, principal) => {
    let totalInterest = document.querySelector('#interest-total')
    let interest = total - principal
    totalInterest.innerHTML = `${formatter.format(interest)}`
}