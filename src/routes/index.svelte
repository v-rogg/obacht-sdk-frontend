<script lang="ts">
    import Three from "$lib/Three/Three.svelte";
    import { messageStore, wsStore } from "../store";
    import { onMount } from "svelte";
    import { browser } from "$app/env";

    let msg;
    let ws;
    wsStore.subscribe(val => ws = val)

    function send() {
        ws.send("Hello from Svelte!");
    }

    if (browser) {
        onMount(() => {
            messageStore.subscribe(val => {
                if (val) {
                    let message = val.split(";")
                    if (message[0] == "system") {
                        msg = val

                    }
                }

            })
        })
    }
</script>

<svelte:head>
	<title>Obacht! Configurator</title>
</svelte:head>

<style>
    button {
        position: fixed;
    }
</style>

<Three/>

{msg}

<!--<button on:click={send}>-->
<!--    Send WebSocket Message-->
<!--</button>-->
