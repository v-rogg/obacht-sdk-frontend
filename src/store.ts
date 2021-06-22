import {readable, writable} from "svelte/store";
import {browser} from "$app/env";

export const socketStore = readable("", set => {
    if (browser) {
        const socket = new WebSocket("ws://192.168.178.48:3000/ws");

        socket.addEventListener("open", () => console.log("socket opened"));
        socket.addEventListener("message", (event) => set(event.data));
        socket.addEventListener("close", () => console.log("socket closed"));

        return () => socket.close();
    }
});

export const hotkeysStore = writable("");
