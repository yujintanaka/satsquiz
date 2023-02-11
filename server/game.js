
const { shuffleArray } = require("./utils");

function initGame(){
    const state = {
        players: {},
        questionNumber: 0,
    }
    return state;
}

function initPlayer(name, id){
    const player = {
        id: id,
        displayName: name,
        score: 0,
        answered: false,
        userAnswers: [],
    }
    return player;
}

function initQuestions(questions){
    const questionsObj = questions.map((question)=>{
        return {
            ...question, 
            answers: shuffleArray([...question.incorrect_answer, question.correct_answer])
        }
    })
    const total = questions.length;
    return(
        {
            questions: questionsObj,
            TOTAL_QUESTIONS: total
        }
    ) 
}




const questions = [
    {
        id: 1,
        question: 'What is the only cause of sustained long-term inflation?',
        correct_answer: 'Expansion of the money supply',
        incorrect_answer: ['Corporate Greed', 'Wage Increases', 'Supply Chain Issues']
    },
    {
        id: 2,
        question: "What is closest the current US GDP? (Measure of value created in a year) ",
        correct_answer: '25 Trillion Dollars',
        incorrect_answer: ['50 Trillion Dollars', '10 Trillion Dollars', '5 Trillion Dollars']
    },
    {
        id: 3,
        question: 'Which is closest to the current US National debt?',
        correct_answer: '30 trillion dollars',
        incorrect_answer: ['15 trillion dollars', '5 trillion dollars', '500 billion dollars']
    },
    {
        id: 4,
        question: "Which is closest to the current US Unfunded Liabilities? (Social Security, Medicaid that hasn't been paid for yet)",
        correct_answer: '180 trillion dollars',
        incorrect_answer: ['220 trillion dollars', '55 trillion dollars', '25 trillion dollars']
    },
    {
        id: 5,
        question: "What is the most likely path the US Government when it comes time to pay for the debts?",
        correct_answer: 'Issue more debt to pay for the old ones',
        incorrect_answer: ['Increase taxes and cut programs', 'Default on their debt', 'GDP growth will cover payments']
    },
    {
        id: 6,
        question: "Who will buy the bulk of the debt? The US has to borrow from somewhere.",
        correct_answer: 'The Federal Reserve Bank (Bank that can print currency)',
        incorrect_answer: ['EU countries', 'Japan', 'American Private Sector']
    },
    {
        id: 7,
        question: "Which of these years did the US have a debt-ceiling crisis?(raise debt ceiling)",
        correct_answer: '2011, 2013 and 2023',
        incorrect_answer: ['2011', '2013', '2023']
    },
    {
        id: 8,
        question: "What is the real US debt ceiling? (implies expansion of money supply)",
        correct_answer: 'Infinity',
        incorrect_answer: ['Congress will stop spending', 'US debt can be maintained at 31 trillion', 'IRS will catch tax cheats']
    },
    {
        id: 9,
        question: "What is the the ceiling on the number of bitcoin?",
        correct_answer: '21 Million',
        incorrect_answer: ['Infinity', '20 thousand', '50 billion']
    },
    {
        id: 10,
        question: "How much bitcoin is there per person on Earth?",
        correct_answer: '0.0025 ~50 usd',
        incorrect_answer: ['0.25 ~5k usd', '0.025 bitcoin ~500 usd', '0.00025 ~5 usd']
    },
]

module.exports = {
    initGame,
    initPlayer,
    questions,
    initQuestions
}



// everything divided by 21 million