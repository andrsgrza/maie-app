import axios from 'axios';

export class UserClient {

    static apiClient = axios.create({
        baseURL: 'http://localhost:8080',  // Base URL for the backend
        withCredentials: true,             // Include cookies in requests
    });

    static async getUser(userId) {
        try {
            const response = await axios.get('http://localhost:8080/api/user', {
                userId,
            });            
            return response;
        } catch (error) {
            return { error: error };
        }
    }
    static async whoAmI() {
        try {
            const response = await this.apiClient.get('/api/user/whoAmI');
            return { status: response.status, data: response.data };
        } catch (error) {
            error.stack = 'removed'
            return {
                status:  error.status,
                message: error.message,
            };
        }
    }
   
}
