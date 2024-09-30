import bcrypt from 'bcryptjs';

const encryptPassword = async (textPassword) => {
    return await bcrypt.hash(textPassword, 10);
};

const comparePassword = async (textPassword, encryptedPassword) => {
    return await bcrypt.compare(textPassword, encryptedPassword);
}

export { encryptPassword, comparePassword };