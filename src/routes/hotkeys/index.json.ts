export async function get() {
    return {
        body: {
            layerSensors: "H",
            layerRawData: "J",
            layerPersons: "K",
            layerMap: "L"
        }
    }
}
