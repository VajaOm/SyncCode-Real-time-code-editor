// src/repositories/UserRepository.js
import { User } from "../models/user.model.js";

export class UserRepository {
    async createUser(userData) {
        const user = await User.create(userData);
        return user;
    }

    async findByUsername(username) {
        const user = await User.findOne({ username });
        return user;
    }
}
