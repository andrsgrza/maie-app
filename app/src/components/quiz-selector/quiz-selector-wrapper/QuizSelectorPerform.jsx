import React, {useState, useEffect} from 'react';
import QuizSelector from '../QuizSelector';

export default function QuizSelectorPerform({onSelected}) {
    const [quizzes, setQuizzes] = useState([])
    const fetchQuizzes = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/getQuizzes`);
            setQuizzes(response.data);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    },[])

    return (
        <div className='quiz-selector-wrapper'>
            <QuizSelector
                quizzes={quizzes}
                setQuizzes={setQuizzes}
                editable={false}
                selectible={true}
                onSelected={onSelected}
            />
        </div>
    );
}