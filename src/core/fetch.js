import axios from "axios"
import "dotenv/config"

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
const BASE_DB_URL = `http://${HOST}:${PORT}/api`;

export default async function Fetch( { param , ...args = [] } ){
    if ( !param || !param.has("/")){
        throw new Error("Complete parameter is needed");
    }
    
    DB_URL_PATH = `${BASE_DB_URL}${param};`
    arguments = args?.[0] || {};

    try {
        const response = await axios.post( DB_URL_PATH, {} );
        // console.log("debug.fetch", response);

        if (!response.ok) throw new Error("Feching failed:", response.status);
        
        const data = await response.json();
        console.log("debug.fetch", data);
        return data;
    } catch (error) {
        console.error(error);
        return;
    }
}