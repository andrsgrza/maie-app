import axios from "axios";
import { HOST_ENDPOINTS } from "../common/constants";

import mockTrainings from "../../resources/mock-trainings.json";

export default class SessionClient {
  static apiBaseUrl = `${process.env.QUIZ_HOST_PATH}/${HOST_ENDPOINTS.TRAININGS}`;
  static apiClient = axios.create({
    baseURL: SessionClient.apiBaseUrl,
    withCredentials: true,
  });

  // Static method to post a quiz
  static async post(quiz) {
    // try {
    //   const response = await QuizClient.apiClient.post("/saveQuiz", quiz);
    //   return { status: response.status, data: response.data };
    // } catch (error) {
    //   return { status: error.status, message: error.message };
    // }
  }

  // Static method to get all quizzes
  static async get() {
    const STATUS = ["Pending", "In Progress", "Completed"];
    const CLEAR_OUT_TYPES = [
      "Manual",
      "Perfect Score",
      "Minimum Performance",
      "Progressive",
      "Repetitions",
    ];

    function randomDate(start, end) {
      const d = new Date(+start + Math.random() * (end - start));
      return d.toISOString().split("T")[0];
    }

    function randomClearOutType() {
      return CLEAR_OUT_TYPES[
        Math.floor(Math.random() * CLEAR_OUT_TYPES.length)
      ];
    }

    function randomStatus() {
      return STATUS[Math.floor(Math.random() * STATUS.length)];
    }

    const MOCK_SESSIONS = Array.from({ length: 50 }).map((_, i) => {
      const TRAININGS = [
        "Project Management Basics",
        "React Advanced Patterns",
        "Golang Intro",
      ];
      const clearOutType = randomClearOutType();
      const status = randomStatus();
      return {
        id: `SESSION_${i + 1}`,
        trainingTitle: TRAININGS[i % TRAININGS.length],
        status,
        dueDate: randomDate(new Date(2025, 6, 1), new Date(2025, 8, 31)), // julio a sept 2025
        clearOutType,
        minScore:
          clearOutType === "Minimum Performance"
            ? 70 + Math.floor(Math.random() * 30)
            : undefined,
        repeatCount:
          clearOutType === "Repetitions"
            ? 1 + Math.floor(Math.random() * 5)
            : undefined,
        createdAt: new Date(
          Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 40
        ).toISOString(),
      };
    });
    return { status: 200, data: MOCK_SESSIONS };
  }

  // Static method to delete a quiz by ID
  static async delete(quizId) {
    // try {
    //   const response = await QuizClient.apiClient.delete(`/${quizId}`);
    //   return response.data;
    // } catch (error) {
    //   throw error;
    // }
  }

  // Static method to update a quiz
  static async update(quiz) {}

  // Static method to get a quiz by ID
  static async getById(quizId) {}

  // Static method to get quizzes by user
  static async getByUser(userId) {}
  //Experimental
  static async search({ title, ownerId, tags } = {}) {}
}
