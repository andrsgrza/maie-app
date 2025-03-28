import axios from "axios";
import { HOST_ENDPOINTS } from "../common/constants";
export class ResouceEntitlementClient {
  static apiClient = axios.create({
    baseURL: `${process.env.QUIZ_HOST_PATH}/${HOST_ENDPOINTS.RESOURCE_ENTITLEMENT}`, // Base URL for the backend
    withCredentials: true, // Include cookies in requests
  });

  static async getRoles() {
    try {
      const response = await this.apiClient.get("currentRoles");
      return { status: response.status, data: response.data };
    } catch (error) {
      error.stack = "removed";
      return {
        status: error.status,
        message: error.message,
      };
    }
  }

  static async getEntitlementForQuiz(quizId) {
    try {
      const response = await this.apiClient.get(`/entitlements/${quizId}`);
      return { status: response.status, data: response.data };
    } catch (error) {
      error.stack = "removed";
      return {
        status: error.status,
        message: error.message,
      };
    }
  }

  static async addQuizEntitlement(resourceId, userList, role) {
    try {
      const response = await this.apiClient.post(
        `/entitlements/quiz/${resourceId}`,
        {
          role: role,
          quizUserList: userList,
        }
      );

      return { status: response.status, data: response.data };
    } catch (error) {
      error.stack = "removed";
      return {
        status: error.status,
        message: error.message,
      };
    }
  }
  static async removeQuizEntitlement(resourceId, userList, role) {
    try {
      const response = await this.apiClient.delete(
        `/entitlements/quiz/${resourceId}`,
        {
          data: {
            quizUserList: userList,
            role: role,
          },
        }
      );
      return { status: response.status };
    } catch (error) {
      throw error;
    }
  }
}
