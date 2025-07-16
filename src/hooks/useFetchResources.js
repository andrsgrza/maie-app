import { useState, useEffect } from "react";
import QuizClient from "../api/quiz-client";
import TrainingClient from "../api/training-client";
import { useBanner } from "../context/BannerContext";
import { MESSAGES } from "../common/constants";

const clientMap = {
  quiz: QuizClient,
  training: TrainingClient,
};

const useFetchResources = (resourceType, filters = {}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addBanner } = useBanner();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const client = clientMap[resourceType];
        if (!client)
          throw new Error(`Unsupported resource type: ${resourceType}`);

        let response;
        if (Object.keys(filters).length === 0) {
          response = await client.getQuizzes();
        } else {
          response = await client.getQuizzes();
        }

        if (response.status >= 200 && response.status < 300) {
          setItems(response.data);
        } else {
          setError(response.status);
        }

        if (response.status !== 200 && response.status !== 404) {
          addBanner(
            MESSAGES.API_MESSAGES[`FETCH_${resourceType.toUpperCase()}S`][
              response.status
            ].TYPE,
            MESSAGES.API_MESSAGES[`FETCH_${resourceType.toUpperCase()}S`][
              response.status
            ].TITLE,
            MESSAGES.API_MESSAGES[`FETCH_${resourceType.toUpperCase()}S`][
              response.status
            ].MESSAGE
          );
        }
      } catch (err) {
        setError(err.message || "Error fetching resources.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [resourceType, JSON.stringify(filters)]);

  return { items, setItems, isLoading, error };
};

export default useFetchResources;
