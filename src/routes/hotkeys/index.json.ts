export async function get() {
    return {
        body: {
            layerSensors: "S",
            layerRawData: "R",
            layerPersons: "P",
            layerMap: "M",
            toolHand: "H",
            toolZones: "Z",
            toolSensorLocations: "L",
            toolMapOrigin: "O",
            toolPause: "Space",
            toolRecording: "Enter",
            toolOutput: "E",
        }
    }
}
