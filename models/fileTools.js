import { mongoURI } from "../config/env.js";
import crypto from "crypto";
import gfsStorage from "multer-gridfs-storage";

export var bucket = new gfsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return {
            bucketName: "gfs",
            filename: genFileUUID(file.originalname)
        }
    }
})

function genFileUUID(str) {
    var salt = crypto.randomBytes(16);
    var hash = crypto.pbkdf2Sync(str, salt, 1000, 32, "sha256").toString("hex");
    return `${hash}/${str}`;
}