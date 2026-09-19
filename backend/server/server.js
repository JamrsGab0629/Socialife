
import "dotenv/config";
import app from "./app.js";
import sequelize from "../config/database.config.js";

import "../model/tokenBlocklist.model.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully.");
         
      
        await sequelize.sync({ alter: true });

        console.log("Database tables synchronized.");

        app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on PORT ${PORT}`);
});
        // app.listen(PORT, () => {
        //     console.log(`Server is running on PORT ${PORT}`);
        // });

    } catch (error) {
        console.error("Database connection failed:", error);
    }
    
};

startServer();