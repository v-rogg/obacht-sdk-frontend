<script lang="ts">
    import { hotkeysStore, toolStore, recordingStore } from "$lib/../store";
    import { onDestroy } from 'svelte';
    import UIButton from "$lib/UI/UIButton/UIButton.svelte";

    let hotkeys = "";
    let tool: string = "hand";
    let recording: boolean = false;

    let zonesTool: string = "zonesMove";

    const unsubHotkeyStore = hotkeysStore.subscribe(val => {
        hotkeys = val;
    });
    const unsubToolStore = toolStore.subscribe(val => {
        tool = val
    });
    const unsubRecordingStore = recordingStore.subscribe(val => {
        recording = val
        if (recording) toolStore.set("hand");
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
        active={tool === "zonesMove"  ||
                tool === "zonesPlus"  ||
                tool === "zonesMinus" ||
                tool === "zonesRemove"}
        title="Zones"
        hotkey={hotkeys.toolZones}
        disabled={recording}
        popupPosition="left-center"
        popupType="group"
        popupOpen={tool === "zonesMove"  ||
                   tool === "zonesPlus"  ||
                   tool === "zonesMinus" ||
                   tool === "zonesRemove"}
        on:click={() => selectTool(zonesTool)}
    >
        <i class="fas fa-draw-polygon event-none"></i>
        <svelte:fragment slot="popup">
            <UIButton
                active={tool === "zonesMove"}
                title="Move Zones"
                on:click={() => {
                    selectTool("zonesMove");
                    zonesTool = "zonesMove";
                }}
            >
                <i class="fas fa-draw-polygon event-none"></i>
                <svelte:fragment slot="addon">
                    <i class="fas fa-arrows-up-down-left-right event-none"></i>
                </svelte:fragment>
            </UIButton>
            <UIButton
                active={tool === "zonesPlus"}
                title="Plus Zones"
                on:click={() => {
                    selectTool("zonesPlus");
                    zonesTool = "zonesPlus";
                }}
            >
                <i class="fas fa-draw-polygon event-none"></i>
                <svelte:fragment slot="addon">
                    <i class="fas fa-plus event-none"></i>
                </svelte:fragment>
            </UIButton>
            <UIButton
                active={tool === "zonesMinus"}
                title="Minus Zones"
                on:click={() => {
                    selectTool("zonesMinus");
                    zonesTool = "zonesMinus";
                }}
            >
                <i class="fas fa-draw-polygon event-none"></i>
                <svelte:fragment slot="addon">
                    <i class="fas fa-minus event-none"></i>
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
                    <i class="fas fa-eraser event-none"></i>
                </svelte:fragment>
            </UIButton>
        </svelte:fragment>
    </UIButton>
    <UIButton
        active={tool === "sensors"}
        title="Sensor Locations"
        hotkey={hotkeys.toolSensorLocations}
        disabled={recording}
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
