<script lang="ts">
    import UIButton from "$lib/UI/UIButton.svelte";
    import { hotkeysStore, recordingStore } from "$lib/../store";
    import { onDestroy } from "svelte";

    let hotkeys = {};
    let paused: boolean = false;
    let recording: boolean = false;

    const unsubHotkeyStore = hotkeysStore.subscribe(val => {
        hotkeys = val;
    });

    const unsubRecordingStore = recordingStore.subscribe(val => {
        recording = val;
    });

    onDestroy(() => {
        unsubHotkeyStore();
        unsubRecordingStore();
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
        on:click={() => {paused = !paused}}
    >
        <span class:hidden={!paused} class="event-none">
            <i class="fas fa-play event-none"></i>
        </span>
        <span class:hidden={paused} class="event-none">
            <i class="fas fa-pause event-none"></i>
        </span>
    </UIButton>
    <UIButton
        active={true}
        title="Record"
        hotkey={hotkeys.toolRecording}
        on:click={() => {recordingStore.set(!recording)}}
    >
        <span class:hidden={!recording} class="red event-none">
            <i class="fas fa-circle event-none"></i>
        </span>
        <span class:hidden={recording} class="red event-none">
            <i class="far fa-circle event-none"></i>
        </span>
    </UIButton>
    <UIButton
        active={true}
        title="Output options"
        hotkey={hotkeys.toolOutput}
        disabled={recording}
        on:click={() => {console.log('output options')}}
    >
        <i class="fas fa-right event-none"></i>
    </UIButton>
</section>
