import { addUserConnection, getUsers } from '../services/websocket.service.js';
import { handleRoomCreation, handleRoomJoining, handleRoomLeaving, handleRoomDeleting, handleCodeUpdation, handleSaveCode } from './room.controller.js';

export const handleWebSocketMessage = async (data, ws, redisClient, wss) => {
    let parsedData;

    try {
        parsedData = JSON.parse(data);
        console.log("Parsed Data:", parsedData);
    } catch (err) {
        ws.send(JSON.stringify({ error: "Invalid message format" }));
        return;
    }

    const { type, userId } = parsedData;
    console.log("Received Message Type:", type);
    console.log("Received UserId:", userId);

    if (!type) {
        ws.send(JSON.stringify({ error: "Message type is required" }));
        return;
    }

    switch (type) {
        case 'authenticate':
            if (!userId) {
                ws.send(JSON.stringify({ error: "User ID is required" }));
                return;
            }
            try {
                console.log("Calling addUserConnection with userId:", userId);
                await addUserConnection(userId, ws, redisClient);
                ws.send(JSON.stringify({ success: "User authenticated successfully" }));
                console.log(`User ${userId} authenticated`);
            } catch (err) {
                console.error("Error in addUserConnection:", err.message);
                ws.send(JSON.stringify({ error: "Failed to authenticate user in Redis" }));
            }
            break;

        case 'check':
            try {
                const users = await getUsers(redisClient);
                ws.send(JSON.stringify({ users: users, message: "hello found your message" }));
            } catch (err) {
                console.error("Error fetching users:", err.message);
                ws.send(JSON.stringify({ error: "Failed to fetch users" }));
            }
            break;

        case 'create-room':
            await handleRoomCreation(ws, userId, parsedData.roomName, redisClient);
            break;

        case 'join-room':
            await handleRoomJoining(ws, userId, parsedData.roomName, redisClient);
            break;

        case 'leave-room':
            await handleRoomLeaving(ws, userId, parsedData.roomName, redisClient);
            break;

        case 'delete-room':
            await handleRoomDeleting(ws, userId, parsedData.roomName, redisClient);
            break;

        case 'update-code':
            await handleCodeUpdation(ws, redisClient, parsedData, wss);
            break;

        case 'save-code':
            await handleSaveCode(ws, redisClient, parsedData);
            break;

        default:
            ws.send(JSON.stringify({ error: "Unknown message type" }));
    }
};
