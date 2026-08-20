import axios from "axios"
import axiosRetry from "axios-retry";
import "dotenv/config"

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
const BASE_DB_URL = `http://${HOST}:${PORT}/api`;

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error);
    }
});

export default async function Fetch({ param, args }) {
    try {
        if (!param || !param.startsWith("/")) {
            throw new Error("Complete parameter is needed");
        }

        const DB_URL_PATH = `${BASE_DB_URL}${param}`;
        const extra_arguments = args || {};

        const response = await axios.post(DB_URL_PATH, extra_arguments);

        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("Server responded with error data:", error.response.data);
            throw new Error(`Error fetching: ${error.response.data.message} status: ${error.response.status}`);
        }

        throw error.message;
    }
}