import { UserRepository } from "./user.repository.js";

const userRepo = new UserRepository();

const register = userRepo.register;
const login = userRepo.login;

export {
    register,
    login
};

