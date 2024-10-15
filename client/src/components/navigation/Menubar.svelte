<script>
    import { createEventDispatcher } from "svelte";
    import { groupList } from "../stores.js";
    import groupPanel from "../panels/groupPanel.svelte";
    export var panelInstance = undefined;
    var dispatch = createEventDispatcher();

    function dispatchInitCall(init_id) {
        dispatch("id", init_id);
    }
</script>

<div class="menubar">
    <div class="header">
        <span>-</span>
    </div>
    <!--MAKE SERVER TABLE SHRINKABLE (NOTES IN /home/arsha/documents/notes.txt)-->
    <div class="menu">
        {#each $groupList as group}
            <div class="block" on:click={dispatchInitCall(group._id)}>
                <img src="{group.icon}" alt="server_icon">
                <button class="hidden" link="{group._id}">{group.name}</button>
            </div>
        {/each}
    </div>
    <div class="footer">
        <button on:click={()=>panelInstance=groupPanel}>+</button>
    </div>
</div>