<script>
    import { onMount } from "svelte";

    import { auth, refreshAuth, getProps } from "./components/stores.js";
    import Form from "./Form.svelte";
    import App from "./App.svelte";

    onMount(async () => {
        await refreshAuth();
        if($auth==true) await getProps();
    })
</script>
{#if $auth==true}
    <App></App>
{/if}

{#if $auth==false}
    <Form></Form>
{/if}