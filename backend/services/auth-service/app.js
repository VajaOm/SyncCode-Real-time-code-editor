import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ApiError from './utils/ApiError.js';
import { connectDatabase } from './database/index.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}))

app.use(express.json({ limit: '16kb' }));

app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(express.static("public"));

app.use(cookieParser());

app.listen(process.env.PORT, () => {
    connectDatabase();
    console.log(`Server running at ${process.env.PORT} port`);
});


import userRoutes from './routes/user.routes.js';
app.use("/api/v1/users", userRoutes);

//global error handler
app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging

    if (err instanceof ApiError) {
        // If the error is an instance of ApiError, return a custom response
        console.log("this is error  : ",err);
        return res.status(err.statusCode).json({
            success: false,
            message: err.message || "Internal Server Error",
            statusCode: err.statusCode
        });
    }

    // For any other errors, return a generic response
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        statusCode: 500
    });
});
