import axios from "axios";

// Accept either the API origin or its /api base path from the deployment env.
// Local development uses the Express server on port 5000 by default.
const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
const API_BASE_URL = configuredApiUrl
  ? /\/api$/i.test(configuredApiUrl)
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      (error.code === "ECONNABORTED"
        ? "BiblioDrop request timed out. Please try again."
        : error.response
          ? `Request failed with status ${error.response.status}.`
          : "Could not reach BiblioDrop. Check your API URL and connection.");

    error.userMessage = message;
    console.error("BiblioDrop API error:", {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      code: error.code,
      message: error.message,
      response: error.response?.data,
    });

    return Promise.reject(error);
  },
);

export async function uploadImage(file) {
  const body = new FormData();
  body.append("image", file);

  const { data } = await api.post("/uploads/image", body);
  return data.url;
}
