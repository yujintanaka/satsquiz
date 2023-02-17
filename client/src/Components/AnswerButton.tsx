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
    const [classes, setClasses] = useState('button-28')
    useEffect(()=>{
        if(!correct && userClicked) {
            setClasses('incorrect button-28')
        } else if(correct) {
            setClasses('correct button-28')
        }
    }, [userAnswer, answer, correct, userClicked, disable])
    function clickedOn(e:React.MouseEvent<HTMLButtonElement>){
        callback(e);
        setClasses('clickedOn button-28')
    }
  return (
    <button className={classes} disabled={disable} value={answer} onClick={clickedOn}>
        <span dangerouslySetInnerHTML={{__html: answer}}></span>
    </button>
  )
}

export default AnswerButton