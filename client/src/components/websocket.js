import { initChannel, groupMessages } from "./stores.js";
var MessageWebsocket, MediaWebsocket = undefined;

/*====================
Message Websocket
=====================*/
export function sendWebsocketMessage(dest, message) {
    var data = {
        dest: dest,
        msg: message
    }
    var dataBlob = new Blob([JSON.stringify(data)], {type: "application/json"})
    MessageWebsocket.send(dataBlob);
}

export function initMessageWebsocket(group_id, channel_id) {
    initChannel(group_id, channel_id);
    if(MessageWebsocket!=undefined) MessageWebsocket.close();
    window.onbeforeunload = () => {
        MessageWebsocket.close();
    }
    MessageWebsocket = new WebSocket(`wss://${window.location.host}/text?id=${group_id}`);
    MessageWebsocket.onmessage = function(event) {
        var eventMsg = JSON.parse(atob(event.data));
        groupMessages.update(arr=>[...arr, eventMsg]);
    }
}

/*====================
Voice & video Websocket
=====================*/
function recordLoop(stream) {
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        MediaWebsocket.send(event.data);
    }
    recorder.start(2000);
    setTimeout(()=>{
        recorder.stop();
        recordLoop(stream);
    }, 2000);
}

export function initMediaWebsocket(group_id) {
    if(MediaWebsocket!=undefined) MediaWebsocket.close();
    window.onbeforeunload = () => {
        MediaWebsocket.close();
    }
    MediaWebsocket = new WebSocket(`wss://${window.location.host}/media?id=${group_id}`);
    MediaWebsocket.onmessage = (event) => {
        const audioBlob = new Blob([event.data], {"type": "audio/ogg; codecs=opus"});
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();
    }
    if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then((stream)=>{
            recordLoop(stream);
        });
    }
}