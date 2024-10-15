import WebSocket from "ws";
import { 
    registerWsSess,
    queryActiveWsSess,
    queryAllWsSess,
    destroyUsrWs 
} from "../models/appModel.js";
import { sess } from "../server.js";

export const MediaWebsocket = new WebSocket.Server({
    noServer: true,
    verifyClient: (info, done) => {
        sess(info.req, {}, () => {
            done(info.req.session);
        })
    }
})

MediaWebsocket.on("connection", async (ws, req) => {
    var user = req.session.user;
    var room_id = req.url.split("?id=")[1];
    try {
        var activeSess = await queryActiveWsSess(user.contacts.email);
        activeSess.close();
    } catch(err) {}
    registerWsSess(user.contacts.email, ws, room_id);

    ws.on("message", async (msg) => {
        var roomClients = await queryAllWsSess(room_id);
        for(var i=0;i<roomClients.ws_clients.length;i++) {
            if(roomClients.ws_clients[i].email!=user.contacts.email) {
                roomClients.ws_clients[i].ws.send(msg);
            }
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