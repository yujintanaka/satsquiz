

// function createInvoice(amount, room, sendInvoice) {
//     console.log(room);
//     fetch('https://legend.lnbits.com/api/v1/payments?api-key=4f3330e2637d4ea987953d9e4f0d50b9', {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "out": false,
//             "amount": amount,
//             "memo": "SatsQuiz",
//             "expiry": 1000,
//             "unit": "sat",
//             "internal": false,
//             "webhook": `https://localhost:3000/${room}`
//         })
//     }).then(res => res.json())
//     .then(data => sendInvoice(data));
// }
function createInvoice(amount, room, sendInvoice) {
    console.log(room);
    fetch(`https://legend.lnbits.com/api/v1/payments?api-key=${process.env.LNBITS_API_KEY}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "out": false,
            "amount": amount,
            "memo": "SatsQuiz",
            "expiry": 1000,
            "unit": "sat",
            "internal": false,
        })
    }).then(res => res.json())
    .then(data => sendInvoice(data));
}

function checkInvoice(payment_hash, sendInvoiceStatus){
    fetch(`https://legend.lnbits.com/api/v1/payments/${payment_hash}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "X-Api-Key": process.env.LNBITS_API_KEY,
        },
    }).then(res => res.json())
    .then(data => sendInvoiceStatus(data.paid) );
}

function createWithdraw(score, player, sendWithdraw){
    fetch('https://legend.lnbits.com/withdraw/api/v1/links', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Api-Key": process.env.LNBITS_ADMIN_KEY,
        },
        body: JSON.stringify({
            "title": 'SatsQuiz', 
            "min_withdrawable": score, 
            "max_withdrawable": score, 
            "uses": 1, 
            "wait_time": 10, 
            "is_unique": false,                
        })
    }).then(res => res.json())
    .then(data => sendWithdraw(data.lnurl, player) );
}

module.exports = {
    createInvoice,
    checkInvoice,
    createWithdraw,
}

// checkInvoice('50be43d0641fd7bcf7ff90257029636e733bd28b7f10d20bc287b41d9e638d70', sendInvoiceStatus)

// function sendInvoiceStatus(paid){
//     console.log(paid)
// }