import axios from 'axios';

export class ResouceEntitlementClient {

    static apiClient = axios.create({
        baseURL: 'http://localhost:8080/api/resource-entitlement',  // Base URL for the backend
        withCredentials: true,             // Include cookies in requests
    });

    static async getRoles() {
        try {
            const response = await this.apiClient.get();
            return { status: response.status, data: response.data };
        } catch (error) {
            console.log('error', error)
            error.stack = 'removed'
            return {
                status:  error.status,
                message: error.message,
            };
        }
    }
   
}
