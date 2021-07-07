<script lang="ts">
    import Three from "$lib/Three/Three.svelte";
    import { messageStore } from "../store";

    let msg;

    messageStore.subscribe(val => {
        if (val) {
            let message = val.split(";")
            if (message[0] == "system") {
                msg = val

            }
        }

    })

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
