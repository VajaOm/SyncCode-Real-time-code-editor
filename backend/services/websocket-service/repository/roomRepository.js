import { Room } from "../models/Room.model.js";
import mongoose from "mongoose";

export class RoomRepository {
    async createRoomIntoDb(roomData) {
        try {
            const { roomName, roomId, creator, members } = roomData;
            console.log("room repo");
            const result = await Room.create({
                roomName,
                roomId,
                creator: new mongoose.Types.ObjectId(creator),
                members
            });

            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async addMemberIntoRoom(memberId, roomId) {
        const room = await Room.findOne({ roomId: roomId });

        if (!room) {
            throw new Error('Room not found');
        }

        room.members.push(new mongoose.Types.ObjectId(memberId));
        await room.save();
        return room;
    }

    async removeMemberFromRoom(roomId, memberId) {
        const room = await Room.findOne({ roomId: roomId });

        if (!room) {
            throw new Error('Room not found');
        }

        room.members = room.members.filter(member => member.toString() !== memberId.toString());
        await room.save();
        console.log(`Member added successfully`);
        return room;
    }

    async deleteRoomFromDb(roomId, userId) {
        try {
            const status = await Room.findOneAndDelete({
                roomId: roomId,
                creator: new mongoose.Types.ObjectId(userId),
            });

            if (!status) {
                console.log(`Room with ID ${roomId} not found or you are not the creator`);
                return false;
            }

            console.log("Room deleted");
            return true;
        } catch (error) {
            console.error(`Error deleting room with ID ${roomId}: ${error.message}`);
            throw new Error('Failed to delete the room');
        }
    }

    async addCode(roomId, code) {
        const room = await Room.findOne({ roomId: roomId });

        if (!room) {
            throw new Error("Room not found");
        }

        room.code = code;
        await room.save();
        console.log(room);
        return room;
    }

}
