import { useState, useEffect } from "react";
import QuizClient from "../api/quiz-client";
import { useBanner } from "../context/BannerContext";
import { MESSAGES } from "../common/constants";

const useFetchQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addBanner } = useBanner();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await QuizClient.getQuizzes();
        if (response.status >= 200 && response.status < 300) {
          setQuizzes(response.data);
        } else {
          setError(response.status);
        }
        if (response.status != 200 && response.status != 404) {
          addBanner(
            MESSAGES.API_MESSAGES.FETCH_QUIZZES[response.status].TYPE,
            MESSAGES.API_MESSAGES.FETCH_QUIZZES[response.status].TITLE,
            MESSAGES.API_MESSAGES.FETCH_QUIZZES[response.status].MESSAGE
          );
        }
      } catch (err) {
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
