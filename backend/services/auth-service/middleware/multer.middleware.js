import multer from "multer";
import { v4 as uuid4 } from "uuid";
import path from 'path';

const storage = multer.diskStorage(
    {
        destination: function (req, res, cb) {
            cb(null, './public/temp')
        },

        filename: function (req, file, cb) {
            const filename = `${Date.now()}-${uuid4()}${path.extname(file.originalname)}`;
            cb(null, filename);
        }
    }
)

export const upload = multer({
    storage: storage
});