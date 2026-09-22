import axios from "axios";
import axiosRetry from "axios-retry";
import BASE_DB_URL from "./url.js";

const VALID_METHODS = ["POST", "GET", "PATCH", "PUT", "DELETE"];

// Axios instance
const api = axios.create({
    baseURL: BASE_DB_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Remove Content-Type header for FormData so browser sets multipart boundary correctly
api.interceptors.request.use((config) => {
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
        if (config.headers) {
            delete config.headers["Content-Type"];
        }
    }
    return config;
});

// Retry configuration
axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,

    // Retry network errors and idempotent requests.
    // Do NOT retry authentication errors.
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error);
    },
});

// Token refresh queue
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });

    failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        // No response or not a 401
        if (
            !error.response ||
            error.response.status !== 401
        ) {
            return Promise.reject(error);
        }

        // Prevent errors if config is missing
        if (!originalRequest) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url || "";

        // Don't refresh when login/refresh itself fails
        const isAuthEndpoint =
            requestUrl.endsWith("/auth/refresh") ||
            requestUrl.endsWith("/auth/login");

        if (isAuthEndpoint || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Mark request as retried
        originalRequest._retry = true;

        // If another request is already refreshing,
        // wait for that refresh to finish.
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                });
            })
                .then(() => {
                    return api(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        }

        isRefreshing = true;

        try {
            // Refresh access token.
            // HttpOnly refresh cookie is automatically sent.
            await api.post(
                "/auth/refresh",
                {}
            );

            isRefreshing = false;

            processQueue(null);

            // Retry the original request.
            return api(originalRequest);

        } catch (refreshError) {
            isRefreshing = false;

            processQueue(refreshError);

            console.error(
                "Session expired or invalid refresh token."
            );

            return Promise.reject(refreshError);
        }
    }
);

// Main request function
export default async function Request({
    param,
    method,
    args,
}) {
    try {
        // Validate endpoint
        if (
            !param ||
            typeof param !== "string" ||
            !param.startsWith("/")
        ) {
            throw new Error(
                "Complete parameter starting with '/' is required"
            );
        }

        // Validate HTTP method
        const METHOD = method?.trim().toUpperCase();

        if (
            !METHOD ||
            !VALID_METHODS.includes(METHOD)
        ) {
            throw new Error(
                "Invalid HTTP method specified"
            );
        }

        const extra_arguments = args || {};

        const config = {
            method: METHOD,
            url: param,
        };

        // GET → query parameters
        if (METHOD === "GET") {
            config.params = extra_arguments;
        }

        // POST/PATCH/PUT/DELETE → request body
        else {
            config.data = extra_arguments;
        }

        const response = await api(config);

        return response.data;

    } catch (error) {

        if (error.response?.data) {
            console.error(
                "Server responded with error data:",
                error.response.data
            );

            const message =
                error.response.data.message ||
                "An error occurred";

            throw new Error(
                `Error fetching: ${message} status: ${error.response.status}`
            );
        }

        throw error instanceof Error
            ? error
            : new Error(String(error));
    }
}