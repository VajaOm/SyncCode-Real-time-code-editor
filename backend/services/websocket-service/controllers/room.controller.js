// src/controllers/room.controller.js
import { RoomService } from '../services/roomServices.services.js';
import { getWebSocketServer } from '../services/websocket.service.js';

const roomService = new RoomService();

export const handleRoomCreation = async (ws, userId, roomName, redisClient) => {
    if (!roomName) {
        ws.send(JSON.stringify({ error: "Room name is required" }));
        return;
    }

    try {
        const roomCreated = await roomService.createRoom(redisClient, userId, roomName);
        if (roomCreated) {
            ws.send(JSON.stringify({ success: `Room ${roomName} created`, roomId: roomCreated }));
        } else {
            ws.send(JSON.stringify({ error: "Failed to create room" }));
        }
    } catch (error) {
        ws.send(JSON.stringify({ error: error.message }));
    }
};

export const handleRoomJoining = async (ws, userId, roomName, redisClient) => {


    try {
        const result = await roomService.joinRoomByName(redisClient, userId, roomName);
        if (result) {
            const { roomId, usersInRoom } = result;
            ws.send(JSON.stringify({ success: `User ${userId} joined room ${roomName}`, roomId, usersInRoom }));
        } else {
            ws.send(JSON.stringify({ error: `Failed to join room ${roomName}, room may not exist` }));
        }
    } catch (error) {
        ws.send(JSON.stringify({ error: error.message }));
    }
};

export const handleRoomLeaving = async (ws, userId, roomName, redisClient) => {
    try {
        const result = await roomService.leaveRoomByName(ws, redisClient, userId, roomName);
        ws.send(JSON.stringify({ success: "User left room" }));
    } catch (error) {
        ws.send(JSON.stringify({ error: error.message }));
    }

};

export const handleRoomDeleting = async (ws, userId, roomName, redisClient) => {
    try {
        await roomService.deleteRoom(ws, redisClient, userId, roomName);
    } catch (error) {
        ws.send(JSON.stringify({ error: error.message }));
    }
};

export const handleCodeUpdation = async (ws, redisClient, parsedData, wss) => {
    await roomService.updateCodeIntoRoom(ws, redisClient, parsedData, wss);
};

export const handleSaveCode = async (ws, redisClient, parsedData) => {
    await roomService.insertCodeIntoDb(ws, redisClient, parsedData);
}