import axios from 'axios';

export class LoginClient {
    // Create an Axios instance with the base URL and credentials configuration
    static apiClient = axios.create({
        baseURL: 'http://localhost:8080',  // Base URL for the backend
        withCredentials: true,             // Include cookies in requests
    });

    // Set up an interceptor to handle responses
    static setupInterceptors() {
        // Response interceptor to handle errors globally
        this.apiClient.interceptors.response.use(
            response => response, // Pass through successful responses
            error => {
                if (error.response && error.response.status === 401) {
                    // Handle 401 Unauthorized (e.g., token expired or not authenticated)
                    console.warn('User is not authenticated or token has expired.');
                }
                return Promise.reject(error); // Propagate the error
            }
        );
    }

    // Login request: authenticate with username and password
    static async requestLogin(username, password) {
        try {
            const response = await this.apiClient.post('/api/auth/login', {
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
            const response = await this.apiClient.post('/api/auth/register', {
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
            const response = await this.apiClient.post('/api/auth/logout');
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
