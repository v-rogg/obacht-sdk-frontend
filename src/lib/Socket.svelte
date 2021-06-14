<script lang='ts'>
    import { onDestroy, onMount } from 'svelte';

    let socket: WebSocket;

    onMount(() => {
        socket = new WebSocket("ws://192.168.178.48:3000/ws");

        socket.onopen = () => {
            console.log("socket opened")
        }

        socket.onmessage = (event) => {
            console.log(event.data);
        }

        socket.onclose = () => {
            console.log("socket closed")
        }
    })

    onDestroy(() => {
        socket != undefined ? socket.close : null
    })
</script>
