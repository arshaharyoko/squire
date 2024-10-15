import { mongoURI } from "../config/env.js";
import mongo from "mongodb";
import gfsStorage from "multer-gridfs-storage";

var date = new Date();
var db;
mongo.MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if(err) console.log(err);
    db = client.db("squire");
});

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

function gfsConstructImg(file) {
    return new Promise((resolve) => {
        try {
            db.collection("gfs_chunks").find({files_id: file._id}).sort({n: 1}).toArray().then((chunks) => {
                var imgData = [];
                for(var i=0;i<chunks.length;i++) {
                    imgData.push((chunks[i].data).toString("base64"))
                }
                var imgConstruct = `data:${file.contentType};base64,${imgData.join('')}`;
                resolve(imgConstruct)
            })
        } catch(err) {
            resolve(null)
        }
    })
}

export function gfsQueryImg(group_id) {
    return new Promise((resolve) => {
        db.collection("gfs_files").findOne({filename: group_id}).then(async (file) => {
            if (null) {
                resolve(null)
            } else {
                var constructedImg = await gfsConstructImg(file);
                resolve(constructedImg);
            }
        });
    })
}

export function createGroup(name, icon_b64url, user_email) {
    db.collection("groups").insertOne({
        name: name,
        icon: icon_b64url,
        creation_date: date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate(),
        conf: {}
    }, (err, doc) => {
        if(err) console.log(err);
        db.collection("users").updateOne(
            {contacts: {email: user_email}},
            {$push: {groups: { id: doc.ops[0]._id, roles: "owner" }}}
        )
    });
}

export function joinGroup(user_id, group_id) {
    db.collection("users").updateOne(
        {contacts: {email: user_id}},
        {$push: {groups: {id: group_id, roles: "member"}}}
    )
}

export function queryGroup(group_id) {
    return new Promise((resolve) => {
        db.collection("groups").findOne({_id: mongo.ObjectId(group_id)}).then(res=>{
            resolve(res);
        })
    })
}

export function createCategory(name, group_id) {
    db.collection("group_categories").insertOne({
        groups_id: group_id,
        name: name,
        conf: {},
        channels: []
    }, (err, doc) => {
        if(err) console.log(err);
        db.collection("groups").updateOne(
            {_id: group_id},
            {$push: {categories: doc.ops[0]._id}}
        )
    });
}

export function createChannel(name, type, category_id) {
    db.collection("group_channels").insertOne({
        categories_id: category_id,
        name: name,
        type: type,
        conf: {}
    })
}

export function queryGroups(group_id_array) {
    return new Promise((resolve) => {
        db.collection("groups").find({_id: {$in: group_id_array}}).toArray().then(res=>{
            var groups = [];
            var index = 0;
            while(index<res.length) {
                var gid = res[index]._id;
                var name = res[index]._name;
                var icon = res[index].icon;
                groups.push({
                    _id: gid,
                    name: name,
                    icon: icon
                });
                index++;
            }
            resolve(groups);
        });
    })
}

export function queryCategoryChannels(category_id) {
    return new Promise((resolve) => {
        db.collection("group_channels").find({categories_id: category_id}).toArray().then((res) => {
            resolve(res);
        }).catch((err) => {});
    })
}

export function queryGroupCategories(group_id) {
    return new Promise((resolve) => {
        db.collection("groups").findOne({_id: mongo.ObjectId(group_id)}).then(res=>{
            if(res==null) return resolve(null);
            db.collection("group_categories").find({groups_id: `${res._id}`}).toArray().then(res=>{
                resolve(res);
            })
        })
    })
}

export var rooms = []
export function registerWsSess(email, ws, group_id) {
    var room = rooms.find(rid => rid.room_id === group_id);
    if(!room) {
        rooms.push({
            room_id: group_id,
            ws_clients: [{
                email: email,
                ws: ws
            }]
        })
    } else {
        var rEntryIndex = rooms.findIndex(() => {return rooms.find(rid => rid.room_id === group_id)});
        rooms[rEntryIndex].ws_clients.push({
            email: email,
            ws: ws
        })
    }
}

export function queryAllWsSess(group_id) {
    return new Promise((resolve) => {
        var room = rooms.find(rid => rid.room_id === group_id)
        resolve(room)
    })
}

export function queryActiveWsSess(email) {
    return new Promise((resolve, reject) => {
        for(var i=0;i<rooms.length;i++) {
            var roomClients = rooms[i].ws_clients;
            var client = roomClients.find(rc => rc.email === email);
            resolve(client.ws)
        }
        reject(null)
    })
}

export function destroyUsrWs(email) {
    return new Promise((resolve, reject) => {
        var usrWsSessions = [];
        for(var i=0;i<rooms.length;i++) {
            var roomClients = rooms[i].ws_clients;
            var clientIndex = roomClients.findIndex(() => {return roomClients.find(rc => rc.email === email);});
            if(clientIndex != -1 && roomClients.length === 1) {
                usrWsSessions.push(roomClients[clientIndex].ws);
                rooms.splice(i, 1)
            } else if (clientIndex != -1) {
                usrWsSessions.push(roomClients[clientIndex].ws);
                roomClients.splice(clientIndex, 1)
            }
        }
        if(usrWsSessions.length != 0) resolve(usrWsSessions);
        reject(null)
    })
}

// Content-related CRUD model
export function sendMessage(message, author, channel_id) {
    db.collection("group_messages").insertOne({
        channels_id: channel_id,
        author: author,
        msg: message,
    })
}

export function queryMessages(channel_id) {
    return new Promise((resolve) => {
        db.collection("group_messages").find({channels_id: channel_id}).toArray().then((messages) => {
            resolve(messages);
        })
    })
}