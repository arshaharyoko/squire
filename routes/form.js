import express from "express";
import multer from "multer";
import crypto from "crypto";
import validate from "validator";
import { insertCredentials, getCredentials } from "../models/authHandler.js";

const upload = multer({});
const router = express.Router();

router.post("/register", upload.none(), async (req, res) => {
    var status = [];
    if (!validate.isLength(req.body.password, {min: 16})) status.push({field: "password", err: "Password must have a minimum length of 16."});
    if (validate.isEmpty(req.body.password)) status.push({field: "password", err: "Password cannot be empty."});
    if (!validate.isEmail(req.body.email)) status.push({field: "email", err: "Invalid email."});

    const query = await getCredentials(req.body.email);
    if (query!=null) status.push({field: "email", err: "An account with this email already exists."});

    if (status.length>0) {
        res.send(status);
    } else {
        insertCredentials(req.body.username, req.body.password, req.body.email);
        res.end();
    }
})

router.post("/login", upload.none(), async (req, res) => {
    var status = [];
    if (validate.isEmpty(req.body.email)) status.push({field: "email", err: "Email cannot be empty."});
    if (!validate.isEmail(req.body.email)) status.push({field: "email", err: "Invalid email."});
    if (validate.isEmpty(req.body.password)) status.push({field: "password", err: "Password cannot be empty."});

    var query = await getCredentials(req.body.email);
    if (query==null) status.push({field: "email", err: "An account with this email doesn't exist."});

    var hash = crypto.pbkdf2Sync(req.body.password, query.password.salt, 1000, 32, "sha256").toString("hex");
    if (hash!=query.password.hash) status.push({field: "password", err: "Incorrect password."});
    if(status.length>0) {
        res.send(status);
    } else {
        req.session.user = query;
        res.end();
    }
    
})

export default router;