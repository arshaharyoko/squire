<script>
    import { sendWebsocketMessage } from "../websocket.js";
    export var channelID = undefined;
    var message = undefined;
    function sendMessage() {
        sendWebsocketMessage(channelID, message);
    }
</script>
<div class="dp-footer" status="hidden">
    <form status="active" on:submit|preventDefault={sendMessage}>
        <input type="text" bind:value={message} placeholder="Enter your message...">
    </form>
</div>