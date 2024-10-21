import { UserService } from "./userService.service.js";

const userservice = new UserService();

const register = userservice.register;
const login = userservice.login;

export {
    register,
    login
}