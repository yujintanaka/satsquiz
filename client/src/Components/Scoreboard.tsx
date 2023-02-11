import React from 'react'

type Props = {
  players: {[char: string]: Player};
  room: string;
  isHost: boolean;
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  questionNumber: number;
  totalQuestions: number;
}

type Player = {
  id: string;
  displayName:string;
  score: number;
}

const Scoreboard: React.FC<Props> = ({players, isHost, callback, questionNumber, totalQuestions}) => {
  const playersArray = Object.keys(players).map(key=>players[key])
  return (
    <div>
        <h1>Leaderboards</h1>
        {playersArray.map((player)=> {
        return <h2 key={player.id}>{player.displayName} score: {player.score}</h2>
        })}
        {isHost && <button onClick={callback}>{questionNumber===totalQuestions ? 'Finish Game' : 'Next Question'}</button>}
    </div>
  )
}



export default Scoreboard