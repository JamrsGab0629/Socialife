import axios from "axios"
import axiosRetry from "axios-retry";
import BASE_DB_URL from "./url";

const VALID_METHODS = ["POST", "GET", "PATCH", "PUT", "DELETE"];

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error);
    }
});

export default async function Request({ param, method, args }) {
    try {
        // console.log(typeof param);
        if (!param || typeof param !== "string" || !param.startsWith("/")) {
            throw new Error("Complete parameter is needed");
        }

        if (!method || typeof method !== "string" || !VALID_METHODS.includes(method.trim().toUpperCase())) {
            throw new Error("Method invalid");
        }

        const DB_URL_PATH = `${BASE_DB_URL}${param}`;
        const METHOD = method.trim().toUpperCase();
        const extra_arguments = args || {};

        console.log("debug.extra_arguments", extra_arguments);

        const config = {
            method: METHOD,
            url: DB_URL_PATH,
            headers: {
                "Content-Type": "application/json",
            }
        };

        if (METHOD === "GET") {
            // Converts JS object into clean query string parameters (?email=user@domain.com)
            config.params = extra_arguments;
        } else {
            config.data = extra_arguments;
        }
        console.log("debug.config", config);

        const response = await axios(config);

        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("Server responded with error data:", error.response.data);
            throw new Error(`Error fetching: ${error.response.data.message} status: ${error.response.status}`);
        }

        throw error.message;
    }
}