// src/utils/api.ts

// Replace with your actual computer IP (e.g., 192.168.1.15)
const BASE_URL = 'http://192.168.1.XX:3000'; 

export const createProfile = async (formData: FormData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: 'POST',
      body: formData, // No JSON.stringify here! FormData sets the headers automatically.
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Backend Error:', error);
    throw error;
  }
};