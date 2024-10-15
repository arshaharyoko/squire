<script>
    import { user } from "../stores.js";
    import settingsPanel from "../panels/settingsPanel.svelte";
    export var panelInstance = undefined;
</script>

<div class="dp-header">
    <div class="profile-img"></div>
    <div class="profile-data">
        <span>{$user.name}</span>
        <!--<% var date = new Date(); %>--> 
        <div class="date"><!--<%= parseInt(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear() %>--></div>
    </div>
    <div class="settings"><img src="/assets/icons/cog.svg" alt="options" on:click={()=>panelInstance=settingsPanel}></div>
</div>