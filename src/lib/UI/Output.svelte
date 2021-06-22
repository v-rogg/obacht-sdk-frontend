<script>
    import UIButton from "$lib/UI/UIButton.svelte";
    import { hotkeysStore } from "$lib/../store";
    import { onDestroy } from "svelte";

    let hotkeys = "";

    const unsubHotkeyStore = hotkeysStore.subscribe(val => {
        hotkeys = val;
    });

    onDestroy(() => {
        unsubHotkeyStore();
    })
</script>

<style lang="sass">
    @import "./src/style/theme"

    section
        position: fixed
        display: flex
        gap: 2rem
        left: 50%
        bottom: 2rem
        transform: translateX(-50%)

    .red
        color: $red
</style>

<section class="layers">
    <UIButton
        active={true}
        title="Hand"
        hotkey={hotkeys.toolPause}
        on:click={() => {}}
    >
        <i class="fas fa-pause event-none"></i>
    </UIButton>
    <UIButton
        active={true}
        title="Zones"
        hotkey={hotkeys.toolRecording}
        on:click={() => {}}
    >
        <i class="fas fa-circle event-none red"></i>
    </UIButton>
    <UIButton
        active={true}
        title="Sensor Locations"
        hotkey={hotkeys.toolOutput}
        on:click={() => {}}
    >
        <i class="fas fa-arrow-right event-none"></i>
    </UIButton>
</section>
