import { readable } from "svelte/store";

export const socketStore = readable("", set => {
    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.addEventListener('open', () => console.log('socket opened'));
    socket.addEventListener('message', (event) => set(event.data));
    socket.addEventListener('close', () => console.log('socket closed'));

    return () => socket.close();
})
