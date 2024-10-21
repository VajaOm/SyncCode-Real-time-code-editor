// src/app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import ApiError from './utils/ApiError.js';

const app = express();

app.use(cookieParser());
app.use(express.json());


// Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        console.log("Into ApiError handler");
        return res.status(err.statusCode).json({
            success: false,
            message: err.message || "Internal Server Error",
            statusCode: err.statusCode
        });
    }

    console.error("Unhandled Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        statusCode: 500
    });
});

export default app;