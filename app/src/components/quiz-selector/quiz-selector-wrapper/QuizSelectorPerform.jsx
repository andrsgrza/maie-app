import React from 'react';
import QuizSelector from '../QuizSelector';
import useFetchQuizzes from '../../../hooks/useFetchQuizzes';

export default function QuizSelectorPerform({onSelected}) {
    
    const { quizzes, setQuizzes, isLoading, error } = useFetchQuizzes();

    return (
        <div className='quiz-selector-wrapper'>
            <QuizSelector
                quizzes={quizzes}
                setQuizzes={setQuizzes}
                editable={false}
                selectible={true}
                onSelected={onSelected}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
}