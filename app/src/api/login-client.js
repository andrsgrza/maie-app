import axios from "axios";
import { HOST_ENDPOINTS } from "../common/constants";

export class LoginClient {
  // Create an Axios instance with the base URL and credentials configuration
  static apiClient = axios.create({
    baseURL: `${process.env.LOGIN_HOST_PATH}/${HOST_ENDPOINTS.LOGIN}`, // Base URL for the backend
    withCredentials: true, // Include cookies in requests
  });

  // Set up an interceptor to handle responses
  static setupInterceptors() {
    // Response interceptor to handle errors globally
    this.apiClient.interceptors.response.use(
      (response) => response, // Pass through successful responses
      (error) => {
        if (error.response && error.response.status === 401) {
          // Handle 401 Unauthorized (e.g., token expired or not authenticated)
        }
        return Promise.reject(error); // Propagate the error
      }
    );
  }

  // Login request: authenticate with username and password
  static async requestLogin(username, password) {
    console.log(
      "requestLogin",
      `${process.env.LOGIN_HOST_PATH}/${HOST_ENDPOINTS.LOGIN}`
    );
    try {
      const response = await this.apiClient.post("login", {
        username,
        password,
      });
      return { status: response.status, data: response.data };
    } catch (error) {
      return {
        status: error.status,
        message: error.message,
      };
    }
  }

  // Sign-up request: register a new user
  static async requestSignUp(username, password, email, telephone) {
    try {
      const response = await this.apiClient.post("register", {
        username,
        password,
        email,
        telephone,
      });
      return { status: response.status, data: response.data };
    } catch (error) {
      return {
        status: error.response ? error.response.status : 500,
        message: error.response ? error.response.data : error.message,
      };
    }
  }

  static async requestLogout() {
    try {
      const response = await this.apiClient.post("logout");
      return { status: response.status, data: response.data };
    } catch (error) {
      return {
        status: error.response ? error.response.status : 500,
        message: error.response ? error.response.data : error.message,
      };
    }
  }
}

// Initialize the interceptors
LoginClient.setupInterceptors();
