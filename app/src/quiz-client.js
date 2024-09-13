import axios from 'axios';
const apiBaseUrl = 'http://localhost:8080/api/quizzes';

export async function postQuiz(quiz) {
  try {
    const response = await axios.post(`${apiBaseUrl}/saveQuiz`, quiz);
    return response.data;
  } catch (error) {
    console.error('Error saving quiz:', error);
    throw error;
  }
}

export async function getQuizzes() {
  try {
    const response = await axios.get(`${apiBaseUrl}/getAll`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
}

export async function deleteQuiz(quizId) {
  try {
    console.log(quizId)
    const response = await axios.delete(`${apiBaseUrl}/${quizId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error deleting quizzes:', error);
    throw error;
  }
}

//TODO
export async function etQuizById(quizId) {
  try {
    const response = await axios.get(`${apiBaseUrl}`, quizId);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
}
//TODO
export async function getQuizzesByUser(userId) {
  try {
    const response = await axios.get(`${apiBaseUrl}`, quizId);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
}