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
    <>
      <p className="number">
          Question: {questionNumber} / {totalQuestions}
      </p>
      <p dangerouslySetInnerHTML={{__html: question}}></p>
      <div>
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
          {isHost && disable && <button onClick={toScoreboard}>Results</button>}
      </div>
    </>
  )
}

export default QuestionCard