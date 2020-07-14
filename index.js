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
    
    return Math.ceil(payment)
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})