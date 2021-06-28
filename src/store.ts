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
})
