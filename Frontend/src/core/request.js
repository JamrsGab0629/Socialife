import axios from "axios";
import axiosRetry from "axios-retry";
import BASE_DB_URL from "./url";

const VALID_METHODS = ["POST", "GET", "PATCH", "PUT", "DELETE"];

// 1. Create a dedicated Axios Instance
const api = axios.create({
    baseURL: BASE_DB_URL,
    withCredentials: true, // Automatically sends HttpOnly cookies (access_token & refresh_token)
    headers: {
        "Content-Type": "application/json",
    },
});

// 2. Configure Retry Logic on the instance
axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        // Retry on network errors or 5xx server issues, but NOT on 401s
        return axiosRetry.isNetworkOrIdempotentRequestError(error);
    },
});

// Flag to prevent multiple simultaneous refresh requests (Infinite loop guard)
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
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 Unauthorized and we haven't already retried this request
        if (error.response?.status === 401 && !originalRequest._retry) {

            // Don't attempt to refresh if the failed request WAS the refresh or login endpoint
            if (originalRequest.url.includes("/api/auth/refresh") || originalRequest.url.includes("/api/auth/login")) {
                return Promise.reject(error);
            }

            // Mark request as retried
            originalRequest._retry = true;

            // Queue concurrent failed requests while the refresh request is in flight
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                // Call the refresh endpoint. Since credentials are enabled, 
                // the browser sends the refresh_token HttpOnly cookie automatically.
                await api.post("/api/auth/refresh");

                isRefreshing = false;
                processQueue(null);

                // Re-execute the original request with the new access_token cookie set
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError, null);

                // Optional: Redirect to login or clear app state if refresh token is expired/invalid (403)
                console.error("Session expired. Please log in again.");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// 4. Main Exported Request Wrapper
export default async function Request({ param, method, args }) {
    try {
        if (!param || typeof param !== "string" || !param.startsWith("/")) {
            throw new Error("Complete parameter is needed");
        }

        const METHOD = method?.trim().toUpperCase();
        if (!METHOD || !VALID_METHODS.includes(METHOD)) {
            throw new Error("Method invalid");
        }

        const extra_arguments = args || {};

        const config = {
            method: METHOD,
            url: param, // Using baseURL configured in Axios instance
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