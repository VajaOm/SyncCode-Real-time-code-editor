import { UserRepository } from "./user.repository.js";

const userRepo = new UserRepository();

const createUser = userRepo.createUser;
const findByUsername = userRepo.findByUsername;

export {
    createUser,
    findByUsername
};