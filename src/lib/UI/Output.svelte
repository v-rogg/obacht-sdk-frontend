<script lang="ts">
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
    @import "./src/style/ui-grid"

    section
        //position: fixed
        //display: flex
        //gap: 1.5rem
        left: 50%
        bottom: 2rem
        transform: translateX(-50%)

    .red
        color: $red
</style>

<section class="outputs">
    <UIButton
        active={true}
        title="Snapshot"
        hotkey={hotkeys.toolPause}
        on:click={() => {console.log('pause')}}
    >
        <i class="fas fa-pause event-none"></i>
    </UIButton>
    <UIButton
        active={true}
        title="Record"
        hotkey={hotkeys.toolRecording}
        on:click={() => {console.log('recording')}}
    >
        <i class="fas fa-circle event-none red"></i>
    </UIButton>
    <UIButton
        active={true}
        title="Output options"
        hotkey={hotkeys.toolOutput}
        on:click={() => {console.log('output options')}}
    >
        <i class="fas fa-arrow-right event-none"></i>
    </UIButton>
</section>
