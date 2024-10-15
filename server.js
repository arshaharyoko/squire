/*==============================
Package Imports
==============================*/

import { redisPort, port } from "./config/env.js";
import http from "http"
import https from "https";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import session from "express-session";
import redis from "redis";
import connect_redis from "connect-redis";
import bodyParser from "body-parser";
import { dirname } from "path";
import { parse, fileURLToPath } from "url";

/*==============================
Const Declarations:
- __dirname, outputs project directory
- RedisStore|RedisClient, redis connection
- session
==============================*/

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const RedisStore = connect_redis(session);
const RedisClient = redis.createClient({
    host: "localhost",
    port: redisPort
});

export const sess = session({
    store: new RedisStore({client: RedisClient}),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: true}
});

export const server = https.createServer({ //http.createServer({
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
    passphrase: "triassic"
}, app);

/*==============================
Websocket Connections
==============================*/
import { MessageWebsocket } from "./websockets/message.js";
import { MediaWebsocket } from "./websockets/media.js";
server.on("upgrade", function upgrade(req, socket, head) {
    const pathname = parse(req.url).pathname;
    if(pathname==="/text") {
        MessageWebsocket.handleUpgrade(req, socket, head, function done(ws) {
            MessageWebsocket.emit("connection", ws, req);
        });
    } else if(pathname==="/media") {
        MediaWebsocket.handleUpgrade(req, socket, head, function done(ws) {
            MediaWebsocket.emit("connection", ws, req);
        });
    } else {
        socket.destroy();
    }
})

/*==============================
App Middlewares
==============================*/

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        "img-src": ["'self'", "data:"],
        "media-src": ["'self'", "blob:"]
    }
}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sess);

/*==============================
App Middlewares: Routes
==============================*/

import apiRoutes from "./routes/api.js";
import formRoutes from "./routes/form.js";
import groupRoutes from "./routes/group.js";
import appRoutes from "./routes/app.js";

app.use(express.static(`${__dirname}/client/public`));
app.use("/api", apiRoutes);
app.use("/form", formRoutes);
app.use("/group", groupRoutes);
app.use("/", appRoutes);

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/client/public/index.html`);
});

server.listen(port, () => {console.log(`Server started on port ${port}`)});