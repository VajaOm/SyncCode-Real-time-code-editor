import mongoose from 'mongoose';
import { encryptPassword, comparePassword } from '../utils/passwordHash.js';

const userSchema = mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    profileImage: {
        url: {
            type: String
        },
        publicId: {
            type: String
        }
    },
    password: {
        type: String,
        require: true
    }
},
    { timestamps: true }
);

//middleware for password modification
const passwordEncryption = async function (next) {
    if (this.isModified("password")) {
        this.password = await encryptPassword(this.password);
        next();
    }
    else {
        next();
    }
}

userSchema.pre("save", passwordEncryption);

// password matching
userSchema.methods.isPasswordMatching = async function (textPassword) {
    return await comparePassword(textPassword, this.password);
}

export const User = mongoose.model("User", userSchema);