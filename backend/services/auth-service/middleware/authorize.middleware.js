import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler";

export const authChecker = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        throw new ApiError(404, "User access token not found");
    }
    else {
        const decodedToken = await jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET_KEY);

        req.user = decodedToken;

        next();
    }
});