<script lang="ts">
    import { hotkeysStore, toolStore } from "$lib/../store";
    import { onDestroy } from 'svelte';
    import UIButton from "$lib/UI/UIButton.svelte";

    let hotkeys = "";
    let tool: string = "hand";

    const unsubHotkeyStore = hotkeysStore.subscribe(val => {
        hotkeys = val;
    });

    const unsubToolStore = toolStore.subscribe(val => {
        tool = val

    });

    function selectTool(val: string) {
        if (tool !== val) {
            toolStore.set(val);
        }
    }

    onDestroy(() => {
        unsubHotkeyStore();
        unsubToolStore();
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

</style>

<section class="layers">
    <UIButton
        active={tool === "hand"}
        title="Hand"
        hotkey={hotkeys.toolHand}
        on:click={() => selectTool("hand")}
    >
        <i class="fas fa-hand event-none"></i>
    </UIButton>
    <UIButton
        active={tool === "zones"}
        title="Zones"
        hotkey={hotkeys.toolZones}
        on:click={() => selectTool("zones")}
    >
        <i class="fas fa-draw-polygon event-none"></i>
    </UIButton>
    <UIButton
        active={tool === "sensors"}
        title="Sensor Locations"
        hotkey={hotkeys.toolSensorLocations}
        on:click={() => selectTool("sensors")}
    >
        <i class="fas fa-location-crosshairs event-none"></i>
    </UIButton>
    <UIButton
        active={tool === "origin"}
        title="Map Origin"
        hotkey={hotkeys.toolMapOrigin}
        on:click={() => selectTool("origin")}
    >
        <i class="fas fa-crosshairs event-none"></i>
    </UIButton>
</section>
