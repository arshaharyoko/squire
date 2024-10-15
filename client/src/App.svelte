<script>
    import {
        displayStatus,
        panelInstance,
        initGroup
    } from "./components/stores.js";
    import Menubar from "./components/navigation/Menubar.svelte";
    import Display from "./components/display.svelte";

    function loadToDisplay(event) {
        initGroup(event.detail);
        displayStatus.set(true);
    }
</script>
<div class="container">
    <!--MAKE THIS TOGGLEABLE AND MOVEABLE-->
    <Menubar on:id={loadToDisplay} bind:panelInstance={$panelInstance}/>
    
    <!--SHOULD BE ABLE TO DISPLAY ALL CHAT CONTENTS (E.G DM, SERVERS)-->
    <Display bind:panelInstance={$panelInstance}/>

    <!--Utility Panel-->
    <svelte:component this={$panelInstance} bind:panelInstance={$panelInstance}/>
</div>