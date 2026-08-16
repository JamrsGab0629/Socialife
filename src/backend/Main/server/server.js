import app from "./app.js";
import sequelize from "../config/database.config.js";
import "dotenv/config";
import User from "../model/user.model.js";
import "../model/tokenBlocklist.model.js";


const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();

        console.log("Database connected successfully.");

        await sequelize.sync();

        console.log("Database tables synchronized.");
        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

startServer();