import axios from 'axios';

export default class QuizClient {
  // Create an Axios instance with the base URL and credentials configuration
  static apiBaseUrl = 'http://localhost:8081/api/quizzes'; // Base URL for the backend
  
  static apiClient = axios.create({
    baseURL: QuizClient.apiBaseUrl,
    withCredentials: true, // Include cookies in requests
  });

  // Static method to post a quiz
  static async postQuiz(quiz) {
    try {
      const response = await QuizClient.apiClient.post('/saveQuiz', quiz);
      return { status: response.status, data: response.data };
    } catch (error) {
      return { status:  error.status, message: error.message };
    }
  }

  // Static method to get all quizzes
  static async getQuizzes() {
    try {
      const response = await QuizClient.apiClient.get('/getAll');
      return { status: response.status, data: response.data };
    } catch (error) {
        return {
          status:  error.status,
          message: error.message,
        };
    }
  }

  // Static method to delete a quiz by ID
  static async deleteQuiz(quizId) {
    try {
      console.log(quizId);
      const response = await QuizClient.apiClient.delete(`/${quizId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  }

  // Static method to update a quiz
  static async updateQuiz(quiz) {
    try {
      console.log(quiz.id);
      const response = await QuizClient.apiClient.put(`/${quiz.id}`, quiz);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  }

  // Static method to get a quiz by ID
  static async getQuizById(quizId) {
    try {
      const response = await QuizClient.apiClient.get(`/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  // Static method to get quizzes by user
  static async getQuizzesByUser(userId) {
    try {
      const response = await QuizClient.apiClient.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes by user:', error);
      throw error;
    }
  }
}
