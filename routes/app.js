import express from "express";
import multer from "multer";
import { gfsQueryImg } from "../models/appModel.js";
import { sess } from "../server.js";
const router = express.Router();

router.post("/app/logout", (req, res) => {
    if(req.session.user) {
        req.session.destroy((err) => {
            if(err) console.log(err);
            res.redirect("/form/signIn");
        });
    } else {
        res.redirect("/form/signIn");
    };
})

router.post("/:uuid/:filename", async (req, res) => {
    var imgUUID = req.params.uuid+"/"+req.params.filename;
    var b64str = await gfsQueryImg(imgUUID);
    var b64data = b64str.split(",")[1];
    var img = Buffer.from(b64data, "base64");
    res.writeHead(200, {"Content-Type": "image/jpeg", "Content-Length": img.length});
    res.end(img);
})

export default router;