<script lang="ts">
    import { hotkeysStore, layersStore } from '$lib/../store';
    import UIButton from "$lib/UI/UIButton.svelte";
    import { onDestroy } from 'svelte';

    let hotkeysProxy = '';
    let mapPopupOpen = false;
    let layers: string[] = ["layerSensors", "layerRawData"];

    const unsubHotkeys = hotkeysStore.subscribe(val => {
        hotkeysProxy = val;
    });

    const unsubLayersStore = layersStore.subscribe(val => {
        layers = val;
    })

    function switchLayer(layer: string) {
        if (layers.indexOf(layer) !== -1) {
            layers.splice(layers.indexOf(layer), 1);
            layersStore.set(layers);
        } else {
            layersStore.set([...layers, layer]);
        }
    }

    onDestroy(() => {
        unsubHotkeys()
        unsubLayersStore()
    })
</script>

<style lang="sass">
    @import "./src/style/theme"
    @import "./src/style/ui-grid"

    section
        flex-direction: column
        left: 2rem
        top: 50%
        transform: translateY(-50%)

        @media (max-height: 640px)
            display: none
</style>

<section class="layers">
    <UIButton
            active={layers.indexOf("layerSensors") !== -1}
            title="Sensors"
            hotkey={hotkeysProxy.layerSensors}
            on:click={() => switchLayer("layerSensors")}
    >
        <i class="fas fa-sensor-on event-none"></i>
    </UIButton>
    <UIButton
            active={layers.indexOf("layerRawData") !== -1}
            title="Raw Data"
            hotkey={hotkeysProxy.layerRawData}
            on:click={() => switchLayer("layerRawData")}
    >
        <i class="fak fa-sensor-points-regular event-none"></i>
    </UIButton>
    <UIButton
            active={layers.indexOf("layerPersons") !== -1}
            title="Persons"
            hotkey={hotkeysProxy.layerPersons}
            on:click={() => switchLayer("layerPersons")}
    >
        <i class="fas fa-person event-none"></i>
    </UIButton>
    <UIButton
            active={layers.indexOf("layerMap") !== -1}
            title="Map"
            hotkey={hotkeysProxy.layerMap}
            bind:popupOpen={mapPopupOpen}
            popupPosition="right mid"
            popupGridColumnsCount="1"
            on:click={() => {
                switchLayer("layerMap")
                mapPopupOpen = !mapPopupOpen
            }}
    >
        <i class="fas fa-map event-none"></i>
        <svelte:fragment slot="popup">
            Here will be the global settings like configs
        </svelte:fragment>
    </UIButton>
</section>
