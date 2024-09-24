// api.js
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const checkWordExistence = async (textToTranslate) => {
  try {
    const response = await axios.get(
      `${backendUrl}/savedWord/existSavedWord?textToTranslate=${textToTranslate}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("Error checking data:", error);
    return false;
  }
};
