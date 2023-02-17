function createInvoice(amount, room, sendInvoice, numberOfPlayers) {
    console.log(`Invoice created for ${room}`)
    const feeCoveredAmount = amount + (2*numberOfPlayers);
    fetch(`https://legend.lnbits.com/api/v1/payments?api-key=${process.env.LNBITS_API_KEY}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "out": false,
            "amount": feeCoveredAmount,
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
            "title": 'SatsQuiz Withdraw', 
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
