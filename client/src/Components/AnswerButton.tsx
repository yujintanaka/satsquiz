import React, { useState, useEffect } from 'react'
import { AnswerObject } from '../App';


type Props = {
    answer: string;
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer: AnswerObject | undefined;
    correct: boolean | undefined;
    userClicked: boolean | undefined;
    disable: boolean;
}

const AnswerButton: React.FC<Props> = ({userAnswer, answer, callback, correct, userClicked, disable}) => {
    let className = '';
    if(!correct && userClicked) {
        className = 'incorrect'
    } else if(correct) {
        className ='correct'
    }
  return (
    <button className={className} disabled={disable} value={answer} onClick={callback}>
        <span dangerouslySetInnerHTML={{__html: answer}}></span>
    </button>
  )
}

export default AnswerButton