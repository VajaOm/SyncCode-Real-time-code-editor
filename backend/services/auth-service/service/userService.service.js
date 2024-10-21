import ApiError from "../utils/ApiError.js";
import { createUser, findByUsername } from "../repository/index.js";
import { uploadOnCloudinary } from "../utils/uploadCloudinary.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtGeneration.js";

export class UserService {

    async register(userData) {
        if (!userData) {
            throw new ApiError(400, "User data not found");
        }

        const { profileImage, email, name, username, password, confirmPassword } = userData;

        if (!profileImage || !email || !name || !username || !password || !confirmPassword) {
            throw new ApiError(400, "User Data field is empty");
        }

        if (password !== confirmPassword) {
            throw new ApiError(400, "Password and confirm password not matched");
        }

        const profileImageUploadResponse = await uploadOnCloudinary(profileImage.path, 'SyncCode Users');
        if (!profileImageUploadResponse) {
            throw new ApiError(422, "Image upload failed");
        }

        const user = await createUser({
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

        const user = await findByUsername(username);

        if (!user) {
            throw new ApiError(404, "User account not found");
        }

        const passwordMatchStatus = await user.isPasswordMatching(password);

        if (!passwordMatchStatus) {
            throw new ApiError(401, "Password not matched");
        }

        const accessToken = await generateAccessToken(user.username, user.email, user._id);
        const refreshToken = await generateRefreshToken(user.username, user._id);

        return { user, accessToken, refreshToken };
    }

}
