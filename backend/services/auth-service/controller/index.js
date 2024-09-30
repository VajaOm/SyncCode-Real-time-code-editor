import { UserController } from "./user.controller.js";

const usercontroller = new UserController();

const registerUser = usercontroller.registerUser;
const authorizeUser = usercontroller.authorizeUser;

export {
    registerUser,
    authorizeUser
};