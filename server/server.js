require('dotenv').config()
const express =  require('express');
const app = express();
const http = require('http');
const server =  http.createServer(app);
const PORT = 3000;
const cors = require('cors');
const { Server } = require("socket.io");
const {makeid} = require('./utils')
const {questions, initGame, initPlayer, initQuestions} = require('./game.js')
const {createInvoice, checkInvoice, createWithdraw} = require('./payments')

const SATS_PER_QUESTION  = 400;

// express
app.use(cors());
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

//set up API for calling to specific room with payment message.
app.post('/', (req, res)=>{
    res.send({message: `OK`})
    console.log(req.body.webhook)
})
app.post('/:room', (req, res)=>{
    res.send({message: `OK`})
    io.to(req.params.room).emit('invoice-paid')
})

server.listen(PORT, ()=>{
    console.log(`express server listening on port: ${PORT}`)
})

//socket io

const clientRooms = {};
const state = {};

io.on('connection', client =>{
    client.on('join-game', handleJoinGame);
    client.on('create-game', handleCreateGame);
    client.on('start-game', handleStartGame);
    client.on('save-answer', handleSaveAnswer);
    client.on('question-start', handleQuestionStart);
    client.on('to-scoreboard', handleToScoreboard);
    client.on('next-question', handleNextQuestion);
    client.on('finish-game', handleFinishGame);
    client.on('check-invoice', handleCheckInvoice);
    client.on('create-withdraw', handleCreateWithdraw);

    function sendWithdraw(lnurl, player){
        io.to(player).emit('withdraw-ready', lnurl)
    }

    function handleCreateWithdraw(room){
        for (player in state[room].players){
            // createWithdraw(state[room].players[player].score, player, sendWithdraw);
            createWithdraw(25, player, sendWithdraw);
        }
    }

    function handleCheckInvoice(paymentHash){
        checkInvoice(paymentHash, sendInvoiceStatus);
    }

    function sendInvoice(data){
        client.emit('invoice-ready', data);
        console.log(data)
    }
    function sendInvoiceStatus(paid){
        client.emit('invoice-status', paid)
    }

    function handleFinishGame(room){
        //send players to the payout page
        //send the client to payment screen
        let amount = 25;

        // let amount = 0;
        // for(player in state[room].players){
        //     amount += state[room].players[player].score
        // }

        io.to(room).emit('payout-page')
        createInvoice(amount, room, sendInvoice);
    }

    function handleNextQuestion(room){
        io.to(room).emit('next-started', state[room].questionNumber);
    }

    function handleToScoreboard(room){
        io.to(room).emit('scoreboard', state[room]);
    }
    function handleQuestionStart(room){
        let questionNumber = state[room].questionNumber;
        setTimeout(()=>{
            if(questionNumber === state[room].questionNumber){
                endQuestion(room)
            }
        },30000)
    }
    function handleSaveAnswer(answerObject, room){
        state[room].players[client.id].userAnswers.push(answerObject);
        state[room].players[client.id].answered = true;
        //checks for any unanswered
        let isFull = true;
        for (player in state[room].players){
            if(state[room].players[player].answered === false){
                isFull = false;
                break;
            }
        }
        //if full, endQuestion
        if (isFull === true){
            endQuestion(room);
        }
    }
    function endQuestion(room){
        //blocks the timer call for endquestion
        state[room].questionNumber +=1;
        io.to(room).emit('question-ended');

        // updates scores and readies it for the scoreboard
        let count = 0;
        let prevQuestionNumber = state[room].questionNumber -1;
        for (player in state[room].players){
            if(state[room].players[player].answered === false){
                //pushes in empty answer object
                const answerObj = {
                    question: 'none',
                    answer: 'none',
                    correct: false,
                    correctAnswer: 'none',
                }
                state[room].players[player].userAnswers.push(answerObj);
            }
            // resets answered status
            state[room].players[player].answered = false;

            if(state[room].players[player].userAnswers[prevQuestionNumber].correct === true){
                count += 1;
            }
        }
        let scorePerPerson = Math.floor(SATS_PER_QUESTION/count)
        if(count === 0){
            scorePerPerson = 0;
        }
        console.log(`count is: ${count} with score per: ${scorePerPerson}`)
        for(player in state[room].players){
            if(state[room].players[player].userAnswers[prevQuestionNumber].correct === true){
                state[room].players[player].score += scorePerPerson;
            }
        }
        //updates scores
    }

    function handleStartGame(room){
        //replace temp with questions
        const questionState = initQuestions(questionsTemp)
        io.to(room).emit('game-started', questionState)
        console.log(`Game Started at room:${room} ${state[room]}`)
    }

    function handleJoinGame(room, name){
        if(state[room]===undefined){
            client.emit('room-not-found');
            return;
        }
        clientRooms[client.id] = room;
        const newPlayer = initPlayer(name, client.id);
        state[room].players[client.id] = newPlayer
        client.join(room);
        client.emit('init-player', room);
        io.to(room).emit('update-players', state[room])
    }
    
    function handleCreateGame(){
        const room = makeid(4);
        clientRooms[client.id] = room;
        client.emit('init-host', room);
        state[room] = initGame();
        client.join(room)
    }
})


const questionsTemp = [{
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
},];