import app from "./app.js";
import sequelize from "../config/database.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();

        console.log("Database connected successfully.");

        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

startServer();