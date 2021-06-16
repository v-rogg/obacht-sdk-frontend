import {readable, writable} from "svelte/store";
import type {wasmInterface} from "./types";

export const wasmStore = writable(<wasmInterface>{});
export const socketStore = readable(<WebSocket>{}, set => {
    const socket = new WebSocket('ws://localhost:3000/ws');

    set(socket);

    return () => {socket.close()};
})
export const readSocketStore = readable('', set => {
    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.addEventListener('message', (e) => {
        const data = e.data;
        set(data);
    })

    return () => {socket.close()};
})
