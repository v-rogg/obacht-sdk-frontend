<script lang='ts'>
    import { tooltip } from '$lib/actions/tooltip';
    import { hotkey } from '$lib/actions/hotkeys';
    import { hotkeysStore } from '../store';

    let hotkeysProxy = "";
    let active: string = 'hand';

    hotkeysStore.subscribe(val => {
        hotkeysProxy = val;
    })

    function selectTool(tool: string) {
        if (active !== tool) {
            active = tool;
        }
    }

</script>

<style lang='sass'>
    @import './src/style/theme'

    section
        position: fixed
        display: flex
        flex-direction: column
        gap: 2rem
        right: 2rem
        top: 50%
        transform: translateY(-50%)

        > div
            background: $white
            width: 4rem
            height: 4rem
            font-size: 1.5rem
            display: flex
            justify-content: center
            align-items: center
            border-radius: $border-radius
            color: $normal-grey

            &:hover:not(.open)
                cursor: pointer

            &:active:not(.open)
                background: $light-grey

        .active
            background: $light-grey
            color: $black
</style>

<section class='layers'>
    <div
            class:active={active === "hand"}
            title='Hand'
            hotkey={hotkeysProxy.toolHand}
            use:hotkey
            use:tooltip
            on:click={() => selectTool('hand')}
    >
        <i class="fas fa-hand event-none"></i>
    </div>
    <div
            class:active={active === "zones"}
            title='Zones'
            hotkey={hotkeysProxy.toolZones}
            use:hotkey
            use:tooltip
            on:click={() => selectTool('zones')}
    >
        <i class="fas fa-draw-polygon event-none"></i>
    </div>
    <div
            class:active={active === "sensors"}
            title='Sensor Locations'
            hotkey={hotkeysProxy.toolSensorLocations}
            use:hotkey
            use:tooltip
            on:click={() => selectTool('sensors')}
    >
        <i class="fas fa-location-crosshairs event-none"></i>
    </div>
    <div
            class:active={active === "origin"}
            title='Map Origin'
            hotkey={hotkeysProxy.toolMapOrigin}
            use:hotkey
            use:tooltip
            on:click={() => selectTool('origin')}
    >
        <i class="fas fa-crosshairs event-none"></i>
    </div>
</section>
