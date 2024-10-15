import express from "express";
import mongo from "mongodb";
import {queryGroups} from "../models/appModel.js";
const router = express.Router();

router.post("/user", (req, res) => {
    if(req.query.hasOwnProperty("status")) {
        res.send(!!req.session.user);
    } else {
        res.send(req.session.user);
    }
});

router.post("/groups", async (req, res) => {
    var groupObjects = req.session.user.groups;
    var groups = [];
    for (var i=0;i<groupObjects.length;i++) {
        groups.push(mongo.ObjectId(groupObjects[i].id));
    }

    var query = await queryGroups(groups);
    res.send(query);
})

export default router;