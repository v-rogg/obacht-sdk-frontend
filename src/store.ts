import { derived, readable, writable } from "svelte/store";
import {browser} from "$app/env";

export const backendAddressStore = writable("", set => {
    if (browser) {
        // let backendAddressCookieValue = null;
        // if (document.cookie.split(";").some((item) => item.trim().startsWith("backendAddress="))) {
        //     backendAddressCookieValue = document.cookie
        //         .split("; ")
        //         .find(row => row.startsWith("backendAddress="))
        //         .split("=")[1];
        // }

        const backendAddressCookieValue = localStorage.getItem("backendAddress");

        backendAddressCookieValue ? set(backendAddressCookieValue) : set("localhost:3000");
    }
});

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

export const layersStore = writable(["layerSensors", "layerRawData", "layerZones", "layerGrid"]);
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

export const sensorStore = derived(messageStore, ($messageStore, set) => {
    if ($messageStore) {
        const splitMessage = $messageStore.split(";");

        if (splitMessage[0] === "system" && splitMessage[1] === "sensors") {
            let sensors = [];

            const sensorsMesssage = splitMessage[2].split("!");

            sensorsMesssage.forEach(sm => {
                const sensorValueMessage = sm.split(":");

                if (sensorValueMessage[1]) {
                    sensors.push({
                        address: sensorValueMessage[0],
                        hostname: sensorValueMessage[1],
                        model: sensorValueMessage[2],
                        color: sensorValueMessage[3],
                        x: parseFloat(sensorValueMessage[4]),
                        y: parseFloat(sensorValueMessage[5]),
                        radian: -parseFloat(sensorValueMessage[6])
                    })
                }
            })

            console.log(sensors);

            set(sensors);
        }
    }
}, []);
