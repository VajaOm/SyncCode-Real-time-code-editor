import mongoose from 'mongoose';

const schema = mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    code: {
        type: String
    }
}, { timestamps: true });

export const Room = mongoose.model('Room', schema);
