import axios from "axios";
import { HOST_ENDPOINTS } from "../common/constants";

export default class QuizClient {
  static apiBaseUrl = `${process.env.QUIZ_HOST_PATH}/${HOST_ENDPOINTS.QUIZZES}`;
  static apiClient = axios.create({
    baseURL: QuizClient.apiBaseUrl,
    withCredentials: true,
  });

  // Static method to post a quiz
  static async postQuiz(quiz) {
    try {
      const response = await QuizClient.apiClient.post("/saveQuiz", quiz);
      return { status: response.status, data: response.data };
    } catch (error) {
      return { status: error.status, message: error.message };
    }
  }

  // Static method to get all quizzes
  static async get() {
    try {
      const response = await QuizClient.apiClient.get("/getAll");
      return { status: response.status, data: response.data };
    } catch (error) {
      return {
        status: error.status,
        message: error.message,
      };
    }
  }

  // Static method to delete a quiz by ID
  static async delete(quizId) {
    try {
      const response = await QuizClient.apiClient.delete(`/${quizId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Static method to update a quiz
  static async updateQuiz(quiz) {
    try {
      const response = await QuizClient.apiClient.put(`/${quiz.id}`, quiz);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Static method to get a quiz by ID
  static async getQuizById(quizId) {
    try {
      const response = await QuizClient.apiClient.get(`/${quizId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Static method to get quizzes by user
  static async getQuizzesByUser(userId) {
    try {
      const response = await QuizClient.apiClient.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  //Experimental
  static async searchQuizzes({ title, ownerId, tags } = {}) {
    try {
      const params = new URLSearchParams();
      if (title) params.append("title", title);
      if (ownerId) params.append("ownerId", ownerId);
      if (tags) params.append("tags", tags);

      const response = await QuizClient.apiClient.get(
        `/search?${params.toString()}`
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      return { status: error.status, message: error.message };
    }
  }
}
