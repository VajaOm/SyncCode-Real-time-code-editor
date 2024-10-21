import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { register, login } from "../service/index.js";

export class UserController {

    registerUser = asyncHandler(async (req, res, next) => {
        const profileImage = req.file;

        if (!profileImage) {
            throw new ApiError(400, "Profile image is required");
        }

        const { email, name, username, password, confirmPassword } = req.body;

        const userData = await register({
            email,
            name,
            username,
            password,
            confirmPassword,
            profileImage
        });

        res.status(201).json(
            new ApiResponse(201, "User registration successful", userData)
        );
    });

    authorizeUser = asyncHandler(async (req, res, next) => {
        const response = await login(req.body);

        const { user, accessToken, refreshToken } = response;

        const options = {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: 'None'
        };

        console.log("accessToken : ", accessToken);

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(201, "User log in successfully", user)
            );

    });

}