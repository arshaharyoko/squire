import { mongoURI } from "../config/env.js";
import mongo from "mongodb";
import crypto from "crypto";

var db;
mongo.MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if(err) console.log(err);
    db = client.db("squire");
});

export function insertCredentials(username, password, email) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, "sha256").toString("hex");
    db.collection("users").insertOne({
        name: username,
        password: {
            hash: hash,
            salt: salt
        },
        contacts: {
            email: email
        },
        groups: []
    })
}

export function getCredentials(email) {
    return new Promise((resolve) =>{
        db.collection("users").findOne({contacts: {email: email}}).then((res) => {
            resolve(res);
        });
    })
}