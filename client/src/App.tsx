import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import io from "socket.io-client"
import Lobby from './Components/Lobby'
import QuestionCard from './Components/QuestionCard'
import Scoreboard from './Components/Scoreboard'
import Payout from './Components/Payout'
import QRcode from 'qrcode';


const socket = io('https://satsquiz.onrender.com/')

export type Invoice = {
  payment_hash: string,
  payment_request: string,
  checking_id: string,
}

export type GameState = {
  players: {[char: string]: Player},
  questionNumber: number,
}
export type Player = {
  id: string
  displayName: string,
  score: number
}
export type QuestionState={
  questions: Question[],
  TOTAL_QUESTIONS: number,
}

export type Question = {
    id: number,
    question: string,
    correct_answer: string,
    incorrect_answer: string[],
    answers: string[]
}

export type AnswerObject = {
  question: string,
  answer: string,
  correct: boolean,
  correctAnswer: string,
}

enum PageType  {
  Home = "HOME",
  Lobby = "LOBBY",
  Game = "GAME",
  Scoreboard = "SCOREBOARD",
  Payout = "PAYOUT"
}


function App() {
  // Used in Beginning ONLY
  const [TOTAL_QUESTIONS, setTOTAL_QUESTIONS] = useState(0);
  const [roomInput, setRoomInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [room, setRoom] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  // reccuring changes 
  const [number, setNumber] = useState(0);
  const [gameState, setGameState] = useState<GameState>({players:{},questionNumber: 0})
  const [page, setPage] = useState<PageType>(PageType.Home);
  const [reserve, setReserve] = useState<AnswerObject>()
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [disable, setDisable] = useState(false);
  const [paymentHash, setPaymentHash] = useState('');
  const [QRCODE, setQRCODE] = useState('');
  const [paid, setPaid] = useState(false);

  const createGame = (e:React.MouseEvent) => {
    e.preventDefault();
    socket.emit('create-game')
  }
  const joinGame = (e: React.SyntheticEvent) =>{
    if(roomInput==='' || nameInput===''){
      alert('Please fill out the fields first')
      setRoomInput('');
      setNameInput('');
      return;
    }
    e.preventDefault();
    socket.emit('join-game', roomInput, nameInput)
  }
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(isHost){
      return
    }
    //users answer
    const answer = e.currentTarget.value;
    //check answer
    const correct = questions[number].correct_answer === answer;
    //add score if answer is correct
    if (correct) setScore(prev => prev+1)
    //save answer in the array for user answers
    const answerObject:AnswerObject = {
      question: questions[number].question,
      answer,
      correct,
      correctAnswer: questions[number].correct_answer
    }
    socket.emit('save-answer', answerObject, room);
    setDisable(true);
    setReserve(answerObject);
  }
  function generateQRCode(url:string) {
    QRcode.toDataURL(url, (err, url)=>{
      if(err){
        return console.log(err)
      } 
      setQRCODE(url)
    })
  }

  // Host Functions
  function startGame(){
    socket.emit('start-game', room)
  }
  function toScoreboard(){
    socket.emit('to-scoreboard', room)
  }
  function nextQuestion(){
    if(number+1 === TOTAL_QUESTIONS){
      socket.emit('finish-game', room)
    } else {
      socket.emit('next-question', room);
      socket.emit('question-start', room);
    }
  }
  function checkInvoice(){
    socket.emit('check-invoice', paymentHash)
  }

  
  // Socket Handlers
  useEffect(()=>{
    socket.on('room-not-found', handleRoomNotFound)
    socket.on('init-host', handleInitHost);
    socket.on('init-player', handleInitPlayer);
    socket.on('update-players', handleUpdatePlayers);
    socket.on('game-started', handleGameStarted);
    socket.on('question-ended', handleQuestionEnded);
    socket.on('scoreboard', handleScoreBoard);
    socket.on('next-started', handleNextStarted);
    socket.on('payout-page', handlePayoutPage);
    socket.on('invoice-ready', handleInvoiceReady)
    socket.on('invoice-status', handleInvoiceStatus);
    socket.on('withdraw-ready', handleWithdrawReady);
    return () =>{
      socket.off('room-not-found')
      socket.off('init-host');
      socket.off('init-player');
      socket.off('update-players');
      socket.off('game-started');
      socket.off('question-ended');
      socket.off('scoreboard');
      socket.off('next-started');
      socket.off('payout-page');
      socket.off('invoice-ready');
      socket.off('invoice-status');
      socket.off('withdraw-ready')
    }
  }, [room, isHost, questions, number, gameState, page, reserve, userAnswers, score])

  function handleWithdrawReady(lnurl:string){
    generateQRCode(lnurl);
  }


  function handleInvoiceStatus(paid:boolean){
    if (paid === true){
      socket.emit('create-withdraw', room)
    }
    setPaid(paid);
  }
  function handleInvoiceReady(data:Invoice){
    generateQRCode(data.payment_request);
    setPaymentHash(data.payment_hash);
  }
  function handlePayoutPage(){
    setPage(PageType.Payout)
  }
  
  function handleNextStarted(questionNumber:number){
    setNumber(questionNumber);
    setPage(PageType.Game);
    setDisable(false)
  }
  function handleScoreBoard(gameState:GameState){
    setGameState(gameState);
    setPage(PageType.Scoreboard);
  }
  
  function handleQuestionEnded(){
    setDisable(true);
    if(reserve){
      setUserAnswers(prev => [...prev, reserve]);
    }
    setReserve(undefined);
  }
  function handleRoomNotFound(){
    setRoomInput('');
    setNameInput('');
    alert('room not found');
  }
  function handleGameStarted(questionState:QuestionState){
    if (isHost) {
      socket.emit('question-start', room);
    }
    // fetches questions hardcoded in game.js
    setQuestions(questionState.questions);
    setTOTAL_QUESTIONS(questionState.TOTAL_QUESTIONS);
    setPage(PageType.Game);
    setNumber(0);
    setDisable(false);
  }
  function handleUpdatePlayers(gameState:GameState){
    setGameState(gameState)
  }
  function handleInitHost(room:string){
    setRoom(room)
    setPage(PageType.Lobby);
    setIsHost(true);
  }
  function handleInitPlayer(room:string){
    setIsHost(false);
    setPage(PageType.Lobby);
    setRoom(room);
    setScore(0);
  }

  return (
    <div className="App">
      {page === "HOME" && (
        <>
        <button onClick={createGame}>Create Game</button>
        <form onSubmit={joinGame}>
          <input placeholder="enter room"type="text" value={roomInput} onChange={(e)=>setRoomInput(e.target.value)}/>
          <input placeholder='enter name' type="text" value={nameInput} onChange={(e)=>setNameInput(e.target.value)}/>
          <button type='submit'>Join Game</button>
        </form>
        </>
      )}
      {page === "LOBBY" && <Lobby players={gameState.players} room={room} isHost={isHost} callback={startGame}/>}
      {page === "GAME" && 
        <QuestionCard 
        questionNumber={number + 1} 
        totalQuestions={TOTAL_QUESTIONS} 
        question={questions[number].question} 
        answers={questions[number].answers} 
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
        disable={disable}
        isHost={isHost}
        toScoreboard={toScoreboard}
        />}
      {page === "SCOREBOARD" && <Scoreboard
        questionNumber={number + 1} 
        totalQuestions={TOTAL_QUESTIONS} 
        players={gameState.players} 
        room={room} isHost={isHost} 
        callback={nextQuestion}/> }
      {page === 'PAYOUT' && <Payout paid={paid} isHost={isHost} QRCODE={QRCODE} checkInvoice={checkInvoice}/>}
    </div>
  )
}

export default App
