<script>
    import req from "axios";
    import { refreshAuth, getProps } from "./components/stores.js";

    var form = 0;
    var email, username, password;
    var field = {
        email:"", username:"", password:""
    }

    function toggleForm() {
        if(form!=0) {
            form = 0;
        } else {
            form = 1;
        }
    }

    function cycleErrors(err_array) {
        for(var i=0;i<err_array.length;i++) {
            switch(err_array[i].field) {
                case "email":
                    field.email = err_array[i].err
                    break;

                case "username":
                    field.username = err_array[i].err
                    break;

                case "password":
                    field.password = err_array[i].err
                    break;
            }
        }
    }

    async function postUserForm() {
        var formData = new FormData();
        if(email!="") formData.append("email", email);
        if(username!="") formData.append("username", username);
        if(password!="") formData.append("password", password);

        var res;
        if(form>0) {
            res = (await req.post("/form/register", formData, {headers:{"Content-Type":"multipart/form-data"}})).data;
            if(res.length==0) {
                form = 0;
            } else {
                cycleErrors(res);
            }
        } else {
            res = (await req.post("/form/login", formData, {headers:{"Content-Type":"multipart/form-data"}})).data;
            if(res.length==0) {
                await refreshAuth();
                await getProps();
            } else {
                cycleErrors(res)
            }
        }
    }

    // NOTE TO SELF: GET RID OF FORM NAMES, AS IT WILL BE ASSIGNED VIA FORMDATA()
</script>

<div class="container">
    <div class="land-form">
        <div class="logo">
            <h1>Squire</h1>
        </div>
        <div class="form-wrapper">
            {#if form>0}
                <form on:submit|preventDefault={postUserForm}>
                    <input type="text" placeholder="Enter your e-mail..." name="email" bind:value={email}>
                    <small>{field.email}</small>
                    <input type="text" placeholder="Enter your desired username..." name="username" bind:value={username}>
                    <small>{field.username}</small>
                    <input type="password" placeholder="Enter your desired password..." name="password" bind:value={password}>
                    <small>{field.password}</small>
                    <small>Hi!, already have an account? <span class="link" on:click={toggleForm}>click here..</span></small>
                    <input type="submit" class="form-submit">
                </form>
            {/if}

            {#if form<=0}
                <form on:submit|preventDefault={postUserForm}>
                    <input type="text" placeholder="Enter your e-mail..." name="email" bind:value={email}>
                    <small>{field.email}</small>
                    <input type="password" placeholder="Enter your password..." name="password" bind:value={password}>
                    <small>{field.password}</small>
                    <small>Hi!, don't have an account? <span class="link" on:click={toggleForm}>click here..</span></small>
                    <input type="submit" class="form-submit">
                </form>
            {/if}
        </div>
    </div>
    <div class="land-spacer"></div>
    <div class="land-banner"></div>
</div>