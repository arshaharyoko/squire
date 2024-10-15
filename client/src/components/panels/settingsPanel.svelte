<script>
    export var panelInstance;
    document.onkeydown = (event) => {
        if(event.key==="Escape") {
            panelInstance = null;
        }
    }
</script>

<div id="panel">
    <div class="user-settings">
        <div class="settings-body">
            <input type="file"/> <!--Picture editor-->
            <div class="data-editor">
                <input type="text" name="email">
                <input type="text" name="username">
                <input type="password" name="password">
            </div>
        </div>
        <div class="settings-footer">
            <small>Press esc to exit...</small>
        </div>
    </div>
</div>