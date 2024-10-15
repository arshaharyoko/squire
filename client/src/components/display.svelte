<script>
    import { displayStatus } from "./stores.js";
    import Sidebar from "./display/Sidebar.svelte";
    import Header from "./display/Header.svelte";
    import Content from "./display/Content.svelte";
    import UInput from "./display/UInput.svelte";
    export var panelInstance = undefined;
    var channelID;
</script>

<div class="display">
    {#if $displayStatus==true}
        <Sidebar
        bind:panelInstance={panelInstance}
        on:channel={(event)=>{channelID = event.detail}}/>
    {/if}
    <div class="main">
        <Header bind:panelInstance={panelInstance}/>
        {#if $displayStatus==true}
            <Content/>
            <UInput bind:channelID={channelID}/>
        {/if}
    </div>
</div>