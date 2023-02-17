import React, { useState } from 'react'
import { AnswerObject } from '../App';
import AnswerButton from './AnswerButton';
import './styles/QuestionCard.css';

type Props = {
  question:  string;
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNumber: number;
  totalQuestions: number;
  disable: boolean;
  isHost: boolean;
  toScoreboard: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const QuestionCard: React.FC<Props> = ({question, answers, callback, userAnswer, questionNumber, totalQuestions, disable, isHost, toScoreboard}) => {
  return (
    <div className='card'>
      <h3 className="number">
          Question: {questionNumber} / {totalQuestions}
      </h3>
      <p dangerouslySetInnerHTML={{__html: question}}></p>
      <div className='questions'>
          {answers.map(answer=>{
              return(
                  <AnswerButton
                  answer={answer}
                  userAnswer = {userAnswer}
                  correct={userAnswer?.correctAnswer == answer}
                  userClicked={userAnswer?.answer == answer}
                  key={answer}
                  callback={callback}
                  disable={disable}
                  />
                )
          })}
          {isHost && disable && <button className='button-5' onClick={toScoreboard}>Results</button>}
      </div>
    </div>
  )
}

export default QuestionCard