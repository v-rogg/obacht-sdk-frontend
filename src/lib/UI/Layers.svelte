<script lang="ts">
    import { tooltip } from "$lib/actions/tooltip";
    import { hotkey } from "$lib/actions/hotkeys";
    import { hotkeysStore } from "$lib/../store";

    let hotkeysProxy = "";
    let actives: string[] = [];

    hotkeysStore.subscribe(val => {
        hotkeysProxy = val;
    })

    function switchLayer(layer: string) {
        if (actives.indexOf(layer) !== -1) {
            actives.splice(actives.indexOf(layer), 1)
            actives = actives
        } else {
            actives = [...actives, layer];
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
        left: 2rem
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
                color: $black

        .active
            background: $light-grey
            color: $black
</style>

<section class="layers">
    <div
            class:active={actives.indexOf("layerSensors") !== -1}
            title="Sensor Positions"
            hotkey={hotkeysProxy.layerSensors}
            use:hotkey
            use:tooltip
            on:click={() => switchLayer("layerSensors")}
    >
        <i class="fas fa-sensor-on event-none"></i>
    </div>
    <div
            class:active={actives.indexOf("layerRawData") !== -1}
            title="Sensor Raw Data"
            hotkey={hotkeysProxy.layerRawData}
            use:hotkey
            use:tooltip
            on:click={() => switchLayer("layerRawData")}
    >
        <i class="fak fa-sensor-points-regular event-none"></i>
    </div>
    <div
            class:active={actives.indexOf("layerPersons") !== -1}
            title="Person Positions"
            hotkey={hotkeysProxy.layerPersons}
            use:hotkey
            use:tooltip
            on:click={() => switchLayer("layerPersons")}
    >
        <i class="fas fa-person event-none"></i>
    </div>
    <div
            class:active={actives.indexOf("layerMap") !== -1}
            title="Map"
            hotkey={hotkeysProxy.layerMap}
            use:hotkey
            use:tooltip
            on:click={() => switchLayer("layerMap")}
    >
        <i class="fas fa-map event-none"></i>
    </div>
</section>
