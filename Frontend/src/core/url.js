const env = (typeof process !== "undefined" && process.env && !process.env.HOST) ? process.env : {};

const HOST = env?.HOST ?? import.meta?.env?.HOST ?? "localhost";
const PORT = env?.PORT ?? import.meta?.env?.PORT ?? 3000;

const BASE_DB_URL = `/api`;

export default BASE_DB_URL;