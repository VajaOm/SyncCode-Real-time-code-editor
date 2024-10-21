import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const authChecker = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        throw new ApiError(404, "User access token not found");
    }
    else {
        console.log(await jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET_KEY));
        const decodedToken = await jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET_KEY);
        req.user = decodedToken;
        console.log(JSON.stringify(decodedToken.data));
        next();
    }
});