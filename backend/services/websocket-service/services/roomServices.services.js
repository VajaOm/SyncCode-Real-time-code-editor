import { RoomRepository } from "../repository/roomRepository.js";
import mongoose from "mongoose";
import { getConnectedUsers } from "./websocket.service.js";

export class RoomService {
    constructor() {
        this.roomrepository = new RoomRepository();
    }

    async createRoom(redisClient, userId, roomName) {
        const roomId = Date.now() + roomName + userId;

        await redisClient.set(`room:${roomName}`, roomId);

        // Create the room in the database
        const result = await this.roomrepository.createRoomIntoDb({
            roomName: roomName,
            roomId: roomId,
            creator: new mongoose.Types.ObjectId(userId),
            members: [new mongoose.Types.ObjectId(userId)]
        });

        await redisClient.sAdd(roomId, userId);
        console.log(`User ${userId} created and joined room: ${roomName} (ID: ${roomId})`);

        return roomId;
    }

    async joinRoomByName(redisClient, userId, roomName) {
        const roomId = await redisClient.get(`room:${roomName}`);
        if (!roomId) {
            console.log(`Room with name ${roomName} does not exist`);
            return false;
        }

        // Add the user to the Redis set
        await redisClient.sAdd(roomId, userId);
        console.log(`User ${userId} joined room: ${roomName}`);

        // Add the member to the room in the database
        await this.roomrepository.addMemberIntoRoom(userId, roomId);

        // Retrieve all users in the room to confirm
        const usersInRoom = await redisClient.sMembers(roomId);
        console.log(`Current users in room ${roomName}`, usersInRoom);

        return { roomId, usersInRoom };
    }

    async leaveRoomByName(ws, redisClient, userId, roomName) {
        if (!userId) {
            ws.send(JSON.stringify({ error: 'User id not found' }));
            return;
        }

        if (!roomName) {
            ws.send(JSON.stringify({ error: 'Room name required' }));
            return;
        }

        const roomId = await redisClient.get(`room:${roomName}`);

        if (!roomId) {
            ws.send(JSON.stringify({ error: "Room name is not exists" }));
            return;
        }

        // removing user from redis room member
        await redisClient.sRem(roomId, userId);

        const result = await this.roomrepository.removeMemberFromRoom(roomId, userId);

        return true;

    }

    async deleteRoom(ws, redisClient, userId, roomName) {
        const roomId = await redisClient.get(`room:${roomName}`);

        if (!roomId) {
            ws.send(JSON.stringify({ error: "Room Id not found" }));
            return;
        }

        await redisClient.del(`room:${roomName}`);

        const result = this.roomrepository.deleteRoomFromDb(roomId, userId);

        return true;

    }

    async updateCodeIntoRoom(ws, redisClient, parsedData, wss) {
        try {
            const roomId = await redisClient.get(`room:${parsedData.roomName}`);

            if (!roomId) {
                ws.send(JSON.stringify({ error: "Room Name not valid" }));
                return;
            }

            const isMember = await redisClient.sIsMember(roomId, parsedData.userId);


            if (isMember) {
                await this.sendCode(redisClient, ws, parsedData.userId, roomId, parsedData.code, wss);
            }

            else {
                ws.send(JSON.stringify({ error: "You are not a member of this room" }));
            }

        } catch (error) {
            ws.send(JSON.stringify({ error: error.message }));
        }
    }

    async sendCode(redisClient, ws, userId, roomId, updatedCode, wss) {
        try {
            let code = await redisClient.get(`code:${roomId}`);

            if (!code) {
                code = updatedCode;
                await redisClient.set(`code:${roomId}`, code);
            } else {
                code = code + updatedCode;
                await redisClient.set(`code:${roomId}`, code);
            }

            const members = await redisClient.sMembers(roomId);
            // console.log("client : ", [...wss.clients]);
            // console.log("members : ", members);
            const connectedUsers = getConnectedUsers();
            members.forEach((memberId) => {
                const client = connectedUsers.get(memberId.toString());

                if (client && client.readyState === WebSocket.OPEN) {
                    //sending updated code 
                    client.send(JSON.stringify({ from: userId, code: updatedCode }));
                }
            });

        } catch (error) {
            ws.send(JSON.stringify({ error: error.message }));
        }
    }

    async insertCodeIntoDb(ws, redisClient, parsedData) {
        try {
            
            const roomId = await redisClient.get(`room:${parsedData.roomName}`);

            if(!roomId) {
                ws.send(JSON.stringify({error: "Room name not found"}));
                return;
            }

            await this.roomrepository.addCode(roomId, parsedData.code);
            

        } catch (error) {
            ws.send(JSON.stringify({error: error.message}));
            return;
        }
    }

}
