import express from "express";
import multer from "multer";
import {
    createGroup,
    joinGroup,
    queryGroup,
    queryGroupCategories,
    queryCategoryChannels,
    createChannel,
    createCategory,
    queryMessages,
    bucket
} from "../models/appModel.js";
import { getCredentials } from "../models/authHandler.js";
const router = express.Router();
const upload = multer({
    limits: { fieldSize: 25 * 1024 * 1024 },
    storage: bucket
});

router.post("/create", upload.none(), (req, res) => {
    createGroup(req.body.name, req.body.icon, req.session.user.contacts.email);
    req.session.reload(() => {
        req.session.save(async () => {
            req.session.user = await getCredentials(req.session.user.contacts.email);
            res.end();
        })
    })
    
})

router.post("/join", upload.none(), async (req, res) => {
    joinGroup(req.session.user.contacts.email, req.body.name); // replace req.body.name with req.body.id
    req.session.reload(() => {
        req.session.save(async () => {
            req.session.user = await getCredentials(req.session.user.contacts.email);
            res.end();
        })
    })
})

router.post("/:id", async (req, res) => {
    
    //========================================
    // Link format:
    // /:id?categories
    // - Fetches all the group categories, chanels not included
    //========================================
    if(req.query.hasOwnProperty("categories")) {
        var queryCategories = await queryGroupCategories(req.params.id);
        if(queryCategories==null) return res.end();
        res.send(queryCategories);
    }

    //========================================
    // Link format:
    // /:id?channels=category_id
    // - Very flexible in the case of only reloading one category block
    //========================================
    if(req.query.hasOwnProperty("channels")) {
        var queryChannels = await queryCategoryChannels(req.query.channels);
        if(queryChannels==null) return res.end();
        res.send(queryChannels);
    }

    if(Object.keys(req.query).length===0) {
        var query = await queryGroup(req.params.id);
        res.send(query);
    }
})

router.post("/:id/:channel_id", async (req, res) => {
    var query = await queryMessages(req.params.channel_id);
    res.send(query);
})

router.post("/:id/create/category", upload.none(), async (req, res) => {
    if(!req.body.name) {
        res.send({err: "You must provide a title."});
    } else {
        createCategory(req.body.name, req.params.id);
        res.end();
    }
})

router.post("/:id/create/channel", upload.none(), async (req, res) => {
    createChannel(req.body.name, req.body.type, req.query.category);
    res.end();
})

export default router;