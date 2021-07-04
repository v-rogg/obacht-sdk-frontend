import { derived, readable, writable } from "svelte/store";
import {browser} from "$app/env";

export const backendAddressStore = writable("localhost:3000");

export const wsStore = derived(backendAddressStore, ($backendAddressStore, set) => {
    if (browser) {
        const socket = new WebSocket(`ws://${$backendAddressStore}/ws`);
        set(socket);
        return () => socket.close();
    }
}, <WebSocket>null)

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
    if ($wsStore) $wsStore.addEventListener("message", (event) => set(event.data));
}, "");

export const hotkeysStore = writable("");

export const mobileCheckStore = readable(false, set => {
    if (browser) {
        set(window.matchMedia("only screen and (max-width: 760px)").matches)
    }
});

export const showTooltipStore = writable(false);

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

// TODO: Remove init and replace with server messages
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
