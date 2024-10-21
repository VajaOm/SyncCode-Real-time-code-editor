import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(`${process.env.DATABASEURL}/${DB_NAME}`);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error in database connection: ", error);
        throw new Error(`Error in database connection: ${error.message}`);
    }
};

