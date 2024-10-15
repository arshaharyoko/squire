<script>
    import req from "axios";
    import { getProps } from "../stores.js";
    export var panelInstance;
    document.onkeydown = (event) => {
        if(event.key==="Escape") {
            panelInstance = null;
        }
    }

    var name, icon;
    var err = "";
    var hidden;
    var groupAction = 0;

    function getB64Url(event) {
        var image = event.target.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            icon = reader.result;
        }
        reader.readAsDataURL(image);
    }

    async function postGroupForm() {
        var formData = new FormData();
        if(name!="") formData.append("name", name);
        if(icon!="") formData.append("icon", icon);

        var res;
        if(groupAction>0) {
            res = (await req.post("/group/create", formData, {headers:{"Content-Type":"multipart/form-data"}})).data;
            if(res.length===0) {
                await getProps();
                panelInstance = null;
            } else {
                err = res.err;
            }
        } else {
            res = (await req.post("/group/join", formData, {headers:{"Content-Type":"multipart/form-data"}})).data;
            if(res.length===0) {
                await getProps();
                panelInstance = null;
            } else {
                err = res.err;
            }
        }
    }
</script>

<div id="panel">
    <div class="form group">
        <div class="action">
            <!--Selector-->
            <div class="selector" class:hidden={hidden}>
                <div class="create" on:click={() => {hidden = !hidden; groupAction=1}}>
                    <span>Create</span>
                </div>
                <div class="join" on:click={() => {hidden = !hidden; groupAction=0}}>
                    <span>Join</span>
                </div>
            </div>
            <!--Form-->
            {#if groupAction>0 && !!hidden}
            <div>
                <form on:submit|preventDefault={postGroupForm}>
                    <input type="text" bind:value={name} placeholder="Enter your desired servername...">
                    <small>{err}</small>
                    <div>
                        <input type="file" on:change={(event) => getB64Url(event)}>
                        <h1>Select an icon!</h1>
                        <h1>...</h1>
                    </div>
                    <input type="submit">
                </form>
            </div>
            {/if}
            {#if groupAction<=0 && !!hidden}
            <div>
                <form on:submit|preventDefault={postGroupForm}>
                    <input type="text" bind:value={name} placeholder="Enter server tag...">
                    <span></span>
                    <input type="submit">
                </form>
            </div>
            {/if}
        </div>
        <small>Press esc to exit...</small>
    </div>
    <div class="thumbnail">
        <img src="assets/images/salman.jpeg" alt="">
    </div>
</div>