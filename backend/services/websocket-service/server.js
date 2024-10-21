// src/server.js
import app from './app.js';
import { initializeWebSocketServer, setupRedisClient, removeUserConnection, getWebSocketServer } from './services/websocket.service.js';
import { handleWebSocketMessage } from './controllers/websocket.controller.js';
import { RoomService } from './services/roomServices.services.js';
import dotenv from 'dotenv';
import { connectDatabase } from './db/index.js';

dotenv.config();

(async () => {
    try {
        const redisClient = await setupRedisClient();

        initializeWebSocketServer((ws, req) => {
            const wss = getWebSocketServer();
            let userId = req.headers['user-id'];
            ws.userId = userId;
            console.log('New WebSocket connection established.');

            ws.on('message', (data) => {
                handleWebSocketMessage(data, ws, redisClient, wss);
            });

            ws.on('close', async () => {
                console.log('WebSocket connection closed.');
                await removeUserConnection(ws, redisClient);
            });
        });

        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Server running on port ${process.env.SERVER_PORT}`);
            connectDatabase();
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
})();
