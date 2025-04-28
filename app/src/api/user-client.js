import axios from "axios";
import { HOST_ENDPOINTS } from "../common/constants";

export class UserClient {
  static apiClient = axios.create({
    baseURL: `${process.env.LOGIN_HOST_PATH}/${HOST_ENDPOINTS.USER}`,
    withCredentials: true, // Include cookies in requests
  });

  static async getUser(userId) {
    try {
      const response = await axios.get("", {
        userId,
      });
      return response;
    } catch (error) {
      return { error: error };
    }
  }
  static async whoAmI() {
    try {
      const response = await this.apiClient.get("whoAmI");
      return { status: response.status, data: response.data };
    } catch (error) {
      error.stack = "removed";
      return {
        status: error.status,
        message: error.message,
      };
    }
  }

  static async fetchUsernames(userIds) {
    try {
      const response = await axios.post("batch", userIds);
      return response.data; // Returns a map { userId: username }
    } catch (error) {
      return {}; // Fallback to an empty map
    }
  }

  static async searchUsers(query) {
    try {
      const response = await this.apiClient.get("search", {
        params: { query },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
