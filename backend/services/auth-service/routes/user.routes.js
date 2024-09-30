import express from 'express';
import { registerUser, authorizeUser } from '../controller/index.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

router.route("/signup").post(upload.single('profileImage'), registerUser);

router.route("/login").post(authorizeUser);

export default router;