import {readable, writable} from "svelte/store";
import type {wasmInterface} from "./types";

export const wasmStore = writable(<wasmInterface>{});
// export const socketStore = readable(<WebSocket>{}, set => {
//     const socket = new WebSocket('ws://localhost:3000/ws');
//
//     set(socket);
//
//     return () => {socket.close()};
// })
export const readSocketStore = readable('', set => {
    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.addEventListener('open', () => {
        console.log("socket opened")
    })

    socket.addEventListener('message', (e) => {
        const data = e.data;
        set(data);
    })

    socket.addEventListener('close', () => {
        console.log("socket closed")
    })

    return () => {socket.close()};
})
