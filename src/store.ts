import { readable } from "svelte/store";

export const socketStore = readable("", set => {
    const socket = new WebSocket('ws://192.168.178.48:3000/ws');

    socket.addEventListener('open', () => console.log('socket opened'));
    socket.addEventListener('message', (event) => set(event.data));
    socket.addEventListener('close', () => console.log('socket closed'));

    return () => socket.close();
})
