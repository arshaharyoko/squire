import WebSocket from "ws";
import { 
    registerWsSess,
    sendMessage,
    queryActiveWsSess,
    queryAllWsSess,
    destroyUsrWs 
} from "../models/appModel.js";
import { sess } from "../server.js";

export const MessageWebsocket = new WebSocket.Server({
    noServer: true,
    verifyClient: (info, done) => {
        sess(info.req, {}, () => {
            done(info.req.session);
        })
    }
})

MessageWebsocket.on("connection", async (ws, req) => {
    var user = req.session.user;
    var room_id = req.url.split("?id=")[1];
    try {
        var activeSess = await queryActiveWsSess(user.contacts.email);
        activeSess.close();
    } catch(err) {}
    registerWsSess(user.contacts.email, ws, room_id);

    ws.on("message", async (msg) => {
        var msgData = Buffer.from(msg, "base64");
        var msgObj = JSON.parse(msgData.toString("ascii"));

        sendMessage(msgObj.msg, user.name, msgObj.dest);
        var roomClients = await queryAllWsSess(room_id);
        var baseRes = Buffer.from(JSON.stringify({
            author: user.name,
            msg: msgObj.msg
        })).toString("base64");
        for(var i=0;i<roomClients.ws_clients.length;i++) {
            roomClients.ws_clients[i].ws.send(baseRes);
        }
    })

    ws.on("close", async () => {
        try {
            var userWebsockets = await destroyUsrWs(user.contacts.email);
            for(ws in userWebsockets) {
                userWebsockets[ws].close();
            }
        } catch(err) {}
    })
})