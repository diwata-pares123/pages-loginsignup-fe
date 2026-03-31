import { getAppConfig } from '../config/appConfig';

const { apiBaseUrl } = getAppConfig();

export const api = {
  postForm: async (endpoint: string, formData: FormData) => {
    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
          // Do NOT set Content-Type: 'multipart/form-data', fetch handles this automatically.
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong with the request');
      }

      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  },
};