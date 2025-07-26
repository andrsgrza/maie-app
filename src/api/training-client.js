import axios from "axios";
import { HOST_ENDPOINTS } from "../common/constants";

import mockTrainings from "../../resources/mock-trainings.json";

export default class TrainingClient {
  static apiBaseUrl = `${process.env.QUIZ_HOST_PATH}/${HOST_ENDPOINTS.TRAININGS}`;
  static apiClient = axios.create({
    baseURL: TrainingClient.apiBaseUrl,
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
    return { status: 200, data: mockTrainings };
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
