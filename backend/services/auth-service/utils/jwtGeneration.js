import jwt from 'jsonwebtoken';

const generateAccessToken = async (username, email, _id) => {
    console.log(username, email, _id);
    const accessToken = await jwt.sign({
        data: {
            'Issuer': username,
            'email': email,
            'id': _id
        }
    },
        process.env.ACCESSTOKEN_SECRET_KEY,
        {
            expiresIn: '1h'
        }
    )
    return accessToken;
}

const generateRefreshToken = async (username, _id) => {
    const refreshToken = await jwt.sign(
        {
            'Issuer': username,
            'Id': _id
        },
        process.env.REFRESHTOKEN_SECRET_KEY,
        {
            expiresIn: "2d"
        }
    )

    return refreshToken;
}

const generateVerificationToken = async function (user) {
    return jwt.sign(
        {
            email: user.email,
            id: user._id
        },
        process.env.VERIFICATION_SECRET_KEY,
        {
            expiresIn: '10min'
        }
    );
};

export { generateAccessToken, generateRefreshToken, generateVerificationToken };