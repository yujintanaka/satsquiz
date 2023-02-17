import React from 'react'


type Props = {
  players: {[char: string]: Player};
  room: string;
  isHost: boolean;
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

type Player = {
  id: string;
  displayName:string;
  score: number;
}

const Lobby: React.FC<Props> = ({players, room, isHost, callback}) => {
  const playersArray = Object.keys(players).map(key=>players[key])
  return (
    <div className='card'>
        <h1>Your Game Code is: {room}</h1>
        {playersArray.map((player)=> {
        return <h2 key={player.id}>{player.displayName}</h2>
        })}
        {isHost && <button className='button-5'onClick={callback}>Start Game</button>}
    </div>
  )
}



export default Lobby