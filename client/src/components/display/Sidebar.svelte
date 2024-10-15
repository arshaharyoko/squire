<script>
    import { createEventDispatcher } from "svelte";
    import req from "axios";
    import {
        group,
        groupChannels,
        groupCategories,
        selectedCategory, 
        initGroup
    } from "../stores.js";
    import { initMessageWebsocket, initMediaWebsocket } from "../websocket.js";
    import channelPanel from "../panels/channelPanel.svelte";
    export var panelInstance = undefined;

    const dispatch = createEventDispatcher();
    var name;
    var categoryForm = 0;

    async function postCategoryForm() {
        var formData = new FormData();
        if(name!="") formData.append("name", name);

        var res = (await req.post(`/group/${$group._id}/create/category`, formData, {headers:{"Content-Type":"multipart/form-data"}}));
        if(!res.length) {
            await initGroup($group._id);
        }
        categoryForm = 0;
    }

    async function openChannelPanel(exported_category_id) {
        selectedCategory.set(exported_category_id);
        panelInstance=channelPanel;
    }

    function dispatchChannelID(channel_id) {
        dispatch("channel", channel_id);
    }

    function initChannel(group_id, channel_id, channel_type) {
        if(channel_type==="conference") {
            initMediaWebsocket(group_id);
        } else {
            initMessageWebsocket(group_id, channel_id);
            dispatchChannelID(channel_id);
        }
    }
</script>

<div class="channel-bar">
    <div class="channel-header">
        <span>{$group.name}</span>
        <button on:click={()=>{categoryForm=1}}>+</button> <!--Make new category, via a popup-->
        <!--Display error via input-->
    </div>
    {#if categoryForm>0}
        <form on:submit|preventDefault={postCategoryForm}><input type="text" bind:value={name}></form>
    {/if}
    <div class="channel-table">
    {#if $groupCategories!=null}
    {#each $groupCategories as category}
        <div class="ch-block">
            <div class="cb-header">
                <small>{category.name}</small>
                <small id="openChannelPanel" on:click={openChannelPanel(category._id)}>+</small>
            </div>
            {#each $groupChannels as channel}
                {#if channel.categories_id===category._id}
                    <div class="cb-channel" on:click={initChannel($group._id, channel._id, channel.type)}>
                        {#if channel.type==="conference"}
                            <i class="fas fa-volume-up"></i>
                        {:else}
                            <i class="fas fa-quote-right"></i>
                        {/if}
                        <span>{channel.name}</span>
                    </div>
                {/if}
            {/each}
        </div>
    {/each}
    {/if}
    </div>
</div>