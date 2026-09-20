import axios from "axios";
import axiosRetry from "axios-retry";
import BASE_DB_URL from "./url";

const VALID_METHODS = ["POST", "GET", "PATCH", "PUT", "DELETE"];

// 1. Dedicated Axios Instance
const api = axios.create({
    baseURL: BASE_DB_URL, // e.g., "http://localhost:3000/api"
    withCredentials: true, // Sends access_token and refresh_token HttpOnly cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// 2. Retry Logic Configuration
axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        // Retry on network or 5xx server issues, but NOT 401/403 auth errors
        return axiosRetry.isNetworkOrIdempotentRequestError(error);
    },
});

// Queue management for concurrent 401s during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, tokenResult = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(tokenResult);
        }
    });
    failedQueue = [];
};

// 3. Response Interceptor for Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip interceptor if error has no response or is not 401 Unauthorized
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // Check relative URL path to match api.post("/auth/refresh") and api.post("/auth/login")
        const requestUrl = originalRequest.url || "";
        const isAuthEndpoint = 
            requestUrl.endsWith("/auth/refresh") || 
            requestUrl.endsWith("/auth/login");

        // Prevent infinite refresh loops if auth endpoints return 401
        if (isAuthEndpoint || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Mark request to prevent duplicate retry calls
        originalRequest._retry = true;

        // Queue concurrent requests while a refresh request is already pending
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => api(originalRequest))
                .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
            // Call refresh endpoint relative to BASE_DB_URL
            await api.post("/auth/refresh", {}, { _retry: true });

            isRefreshing = false;
            processQueue(null);

            // Re-execute original failed request with renewed access cookie
            return api(originalRequest);
        } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError, null);

            console.error("Session expired or invalid refresh token. Please log in again.");

            return Promise.reject(refreshError);
        }
    }
);

// 4. Main Exported Request Utility
export default async function Request({ param, method, args }) {
    try {
        if (!param || typeof param !== "string" || !param.startsWith("/")) {
            throw new Error("Complete parameter starting with '/' is required");
        }

        const METHOD = method?.trim().toUpperCase();
        if (!METHOD || !VALID_METHODS.includes(METHOD)) {
            throw new Error("Invalid HTTP method specified");
        }

        const extra_arguments = args || {};

        const config = {
            method: METHOD,
            url: param,
        };

        if (METHOD === "GET") {
            config.params = extra_arguments;
        } else {
            config.data = extra_arguments;
        }

        const response = await api(config);
        return response.data;
    } catch (error) {
        if (error.response?.data) {
            console.error("Server responded with error data:", error.response.data);
            const message = error.response.data.message || "An error occurred";
            throw new Error(`Error fetching: ${message} status: ${error.response.status}`);
        }

        throw error instanceof Error ? error : new Error(String(error));
    }
}