import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/uploadCloudinary.js";
import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtGeneration.js";

export class UserRepository {
    async register(userdata) {
        if (!userdata) {
            throw new ApiError(400, "User data not found");
        }

        const { profileImage, email, name, username, password, confirmPassword } = userdata;

        if (!profileImage || !email || !name || !username || !password || !confirmPassword) {
            throw new ApiError(400, "User Data field is empty");
        }

        if (password !== confirmPassword) {
            throw new ApiError(400, "Password and confirm password not matched");
        }

        const path = profileImage.path;

        const profileImageUploadResponse = await uploadOnCloudinary(path, 'SyncCode Users');

        if (!profileImageUploadResponse) {
            throw new ApiError(422, "Image uploadation failed");
        }

        const user = await User.create({
            email,
            name,
            username,
            password,
            profileImage: {
                url: profileImageUploadResponse.url,
                publicId: profileImageUploadResponse.public_id
            }
        });

        if (!user) {
            throw new ApiError(500, "User creation failed");
        }

        console.log("User data in the repo: ", user);
        return user;
    }

    async login(userData) {
        if (!userData) {
            throw new ApiError(400, "User data not found");
        }

        const { username, password } = userData;

        if (!username || !password) {
            throw new ApiError(400, "Insufficient user data");
        }

        const user = await User.findOne({ username });

        if (!user) {
            throw new ApiError(404, "User account not found");
        }

        const passwordMatchStatus = await user.isPasswordMatching(password);

        if (!passwordMatchStatus) {
            throw new ApiError(401, "Password not matched");
        }

        const accessToken = await generateAccessToken(user.username, user.email, user._id);
        const refreshToken = await generateRefreshToken(user.username, user._id);

        return {user, accessToken, refreshToken};

    }
}
