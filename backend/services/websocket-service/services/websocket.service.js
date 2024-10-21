// src/services/websocket.service.js
import { WebSocketServer } from 'ws';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const connectedUsers = new Map();
let wss;

// Initialize WebSocket Server
export const initializeWebSocketServer = (onConnection) => {
    wss = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });
    wss.on('connection', onConnection);
    console.log(`WebSocket Server running on port ${process.env.WEBSOCKET_PORT}`);
    
};

export const getWebSocketServer = () => wss;
export const getConnectedUsers = () => connectedUsers;

// Setup Redis Client
export const setupRedisClient = async () => {
    const redisClient = createClient({ url: `redis://localhost:${process.env.REDIS_PORT}` });
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect();
    console.log('Connected to Redis');
    return redisClient;
};

// Add User Connection
export const addUserConnection = async (userId, ws, redisClient) => {
    console.log("userId:", userId);
    connectedUsers.set(userId, ws);
    console.log("user in adduser connection : ", connectedUsers.keys('*'));
    await redisClient.set(userId, "Connected");
    const users = await redisClient.keys('*')
    console.log("users in redis client : ", users);
    console.log(`User ${userId} added to Redis and WebSocket connection`);
};

// Remove User Connection
export const removeUserConnection = async (ws, redisClient) => {
    for (let [userId, socket] of connectedUsers.entries()) {
        if (socket === ws) {
            connectedUsers.delete(userId);
            await redisClient.del(userId);
            console.log(`User ${userId} removed from Redis`);
            break;
        }
    }
};

// Get All Users
export const getUsers = async (redisClient) => {
    const keys = await redisClient.keys('*');
    console.log('Current users in Redis:', keys);
    return keys;
};




