import { useState, useEffect } from 'react';
import QuizClient from '../api/quiz-client';

const useFetchQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await QuizClient.getQuizzes();
                if (response.status >= 200 && response.status < 300) {
                    setQuizzes(response.data);
                } else {
                    setError(response.status);
                }
            } catch (err) {
                console.error("Error fetching quizzes:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    return { quizzes, setQuizzes, isLoading, error };
};

export default useFetchQuizzes;