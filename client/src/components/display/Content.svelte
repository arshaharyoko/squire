<script>
    import { groupMessages } from "../stores.js";
</script>

<div class="dp-content">
    {#each $groupMessages as message}
        <div class="msg-block">
            <div class="msg-author-img">
                <img src="assets/images/placeholder.png" alt="To be replaced with author thumbnail"/>
            </div>
            <div class="msg">
                <span>{message.author}</span>
                <span>{message.msg}</span>
            </div>
        </div>
    {/each}
</div>