<script lang="ts">
    import { hotkeysStore } from '$lib/../store';
    import UIButton from './UIButton.svelte';

    let hotkeysProxy = '';
    let active: string = 'hand';

    hotkeysStore.subscribe(val => {
        hotkeysProxy = val;
    });

    function selectTool(tool: string) {
        if (active !== tool) {
            active = tool;
        }
    }
</script>

<style lang="sass">
    @import "./src/style/theme"

    section
        position: fixed
        display: flex
        flex-direction: column
        gap: 2rem
        right: 2rem
        top: 50%
        transform: translateY(-50%)

</style>

<section class="layers">
    <UIButton
        active={active === "hand"}
        title="Hand"
        hotkey={hotkeysProxy.toolHand}
        on:click={() => selectTool("hand")}
    >
        <i class="fas fa-hand event-none"></i>
    </UIButton>
    <UIButton
        active={active === "zones"}
        title="Zones"
        hotkey={hotkeysProxy.toolZones}
        on:click={() => selectTool("zones")}
    >
        <i class="fas fa-draw-polygon event-none"></i>
    </UIButton>
    <UIButton
        active={active === "sensors"}
        title="Sensor Locations"
        hotkey={hotkeysProxy.toolSensorLocations}
        on:click={() => selectTool("sensors")}
    >
        <i class="fas fa-location-crosshairs event-none"></i>
    </UIButton>
    <UIButton
        active={active === "origin"}
        title="Map Origin"
        hotkey={hotkeysProxy.toolMapOrigin}
        on:click={() => selectTool("origin")}
    >
        <i class="fas fa-crosshairs event-none"></i>
    </UIButton>
</section>
