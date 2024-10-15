<script>
    import req from "axios";
    import { group, selectedCategory, initGroup } from "../stores.js";
    export var panelInstance;
    document.onkeydown = (event) => {
        if(event.key==="Escape") {
            panelInstance = null;
        }
    }
    var name, type;

    async function postChannelForm() {
        var formData = new FormData();
        if(name!="") formData.append("name", name);
        if(type!="") formData.append("type", type);

        var res = (await req.post(`/group/${$group._id}/create/channel?category=${$selectedCategory}`, formData, {headers:{"Content-Type":"multipart/form-data"}}));
        if(!res.length) {
            await initGroup($group._id); // INEFFICIENT, PLEASE REPLACE WITH "fetchChannels"
        } else {
            //Cycle errors
        }
    }
</script>

<div id="panel">
    <div class="form channel">
        <form on:submit|preventDefault={postChannelForm}>
            <input type="text" bind:value={name} placeholder="Enter channel name...">
            <span></span>
            <div class="radio-container"> <!--Bind radio value to type-->
                <input type="radio" bind:group={type} value={"text"}>
                <div class="radio-btn"></div>
                <span>Text</span>
            </div>
            <div class="radio-container">
                <input type="radio" bind:group={type} value={"conference"}>
                <div class="radio-btn"></div>
                <span>Conference</span>
            </div>
            <input type="submit">
        </form>
        <small>Press esc to exit...</small>
    </div>
</div>
