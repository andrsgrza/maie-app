import { useState, useEffect } from "react";
import QuizClient from "../api/quiz-client";
import TrainingClient from "../api/training-client";
import { useBanner } from "../context/BannerContext";
import { MESSAGES } from "../common/constants";
import SessionClient from "../api/session-client";

const clientMap = {
  quiz: QuizClient,
  training: TrainingClient,
  session: SessionClient,
};

const useFetchResources = (resourceType, filters = {}) => {
  const [resources, setResources] = useState([]);
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
        console.log("Generating response with client", resourceType, client);

        let response;
        if (Object.keys(filters).length === 0) {
          response = await client.get();
        } else {
          response = await client.get();
        }
        console.log("response", response);

        if (response.status >= 200 && response.status < 300) {
          setResources(response.data);
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

  return { resources, setResources, isLoading, error };
};

export default useFetchResources;
