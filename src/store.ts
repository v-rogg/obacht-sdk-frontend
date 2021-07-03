import { derived, readable, writable } from "svelte/store";
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

export const wsStore = writable(<WebSocket>null, set => {
    if (browser) {
        const socket = new WebSocket("ws://localhost:3000/ws");
        set(socket);
        return () => socket.close();
    }
});

export const wsConnectionStore = derived(wsStore, ($wsStore, set) => {
    if ($wsStore) {
        $wsStore.addEventListener("open", () => {
            console.log("open")
            set(true)
        });
        $wsStore.addEventListener("close", () => {
            console.log("close")
            set(false)
        });
        $wsStore.addEventListener("error", () => set(false));
    }
}, null);

export const messageStore = derived(wsStore, ($wsStore, set) => {
    $wsStore.addEventListener("message", (event) => set(event.data));
}, "");

export const hotkeysStore = writable("");

export const mobileCheckStore = readable(false, set => {
    if (browser) {
        set(window.matchMedia("only screen and (max-width: 760px)").matches)
    }
});

export const showTooltipStore = writable(true);

export const layersStore = writable(["layerSensors", "layerRawData"]);
export const toolStore = writable("hand");

export const recordingStore = writable(false);

export const outputSettingsStore = writable({
    JSON: {
        enabled: false,
        location: "C:\\output\\export.json"
    },
    MQTT: {
        enabled: true,
    }
});

export const sensorStore = writable([], set => {
    fetch("http://localhost:3000/init")
        .then(res => res.json())
        .then(json => {
            let sensors = [];
            // console.log(json);
            Object.keys(json).forEach(key => {
                sensors.push({
                    address: key,
                    ... json[key]
                })
            })
            set(sensors)
        })
});
