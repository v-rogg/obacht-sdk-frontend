<script lang="ts">
    import { hotkeysStore, toolStore, recordingStore, layersStore, pausedStore } from "$lib/../store";
    import { onDestroy } from 'svelte';
    import UIButton from "$lib/UI/UIButton/UIButton.svelte";

    let hotkeys = "";
    let tool: string = "hand";
    let recording: boolean = false;
    let paused: boolean = false;
    let sensors: boolean = true;
    let layersProxy;
    let zonesTool: string = "zonesEdit";

    const unsubHotkeyStore = hotkeysStore.subscribe(val => {
        hotkeys = val;
    });
    const unsubToolStore = toolStore.subscribe(val => {
        tool = val;
    });
    const unsubRecordingStore = recordingStore.subscribe(val => {
        recording = val;
        if (recording) toolStore.set("hand");
    });
    const unsubPausedStore = pausedStore.subscribe(val => {
        paused = val
        if (tool === "sensors") toolStore.set("hand");
    });
    const unsubLayerStore = layersStore.subscribe(val => {
        layersProxy = val;
        sensors = val.includes("layerSensors");
        if (!val.includes("layerSensors") && tool === "sensors") toolStore.set("hand");
        if (!val.includes("layerZones") && (tool === "zonesEdit" || tool === "zonesRemove")) toolStore.set("hand");
    });

    function selectTool(val: string) {
        if (tool !== val) {
            toolStore.set(val);
        }
    }

    onDestroy(() => {
        unsubHotkeyStore();
        unsubToolStore();
        unsubRecordingStore();
        unsubLayerStore();
        unsubPausedStore();
    })
</script>

<style lang="sass">
    @import "./src/style/theme"
    @import "./src/style/ui-grid"

    section
        flex-direction: column
        right: 2rem
        top: 50%
        transform: translateY(-50%)

        @media (max-height: 640px)
            display: none
</style>

<section class="tools">
    <UIButton
        active={tool === "hand"}
        title="Hand"
        hotkey={hotkeys.toolHand}
        on:click={() => selectTool("hand")}
    >
        <i class="fas fa-hand event-none"></i>
    </UIButton>
    <UIButton
        active={tool === "zonesEdit"  ||
                tool === "zonesRemove"}
        title="Zones"
        hotkey={hotkeys.toolZones}
        disabled={recording || !layersProxy.includes("layerZones")}
        popupPosition="left-center"
        popupType="group"
        popupOpen={tool === "zonesEdit"  ||
                   tool === "zonesRemove"}
        on:click={() => selectTool(zonesTool)}
    >
        <i class="fas fa-draw-polygon event-none"></i>
        <svelte:fragment slot="popup">
            <UIButton
                active={tool === "zonesEdit"}
                title="Move Zones"
                on:click={() => {
                    selectTool("zonesEdit");
                    zonesTool = "zonesEdit";
                }}
            >
                <i class="fas fa-draw-polygon event-none"></i>
                <svelte:fragment slot="addon">
                    <i class="fas fa-plus event-none"></i>
                </svelte:fragment>
            </UIButton>
            <UIButton
                active={tool === "zonesRemove"}
                title="Remove Zones"
                on:click={() => {
                    selectTool("zonesRemove");
                    zonesTool = "zonesRemove";
                }}
            >
                <i class="fas fa-draw-polygon event-none"></i>
                <svelte:fragment slot="addon">
                    <i class="fas fa-trash event-none"></i>
                </svelte:fragment>
            </UIButton>
        </svelte:fragment>
    </UIButton>
    <UIButton
        active={tool === "sensors"}
        title="Sensor Locations"
        hotkey={hotkeys.toolSensorLocations}
        disabled={recording || !layersProxy.includes("layerSensors") || paused}
        on:click={() => selectTool("sensors")}
    >
        <i class="fas fa-location-crosshairs event-none"></i>
    </UIButton>
    <UIButton
        active={tool === "origin"}
        title="Map Origin"
        hotkey={hotkeys.toolMapOrigin}
        disabled={recording}
        on:click={() => selectTool("origin")}
    >
        <i class="fas fa-crosshairs event-none"></i>
    </UIButton>
</section>
