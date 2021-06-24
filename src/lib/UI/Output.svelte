<script lang="ts">
    import UIButton from "$lib/UI/UIButton.svelte";
    import { hotkeysStore, recordingStore } from "$lib/../store";
    import { onDestroy } from "svelte";
    import Checkbox from "../Primitives/Checkbox.svelte";

    let hotkeys = {};
    let paused: boolean = false;
    let recording: boolean = false;
    let outputOptionsOpen: boolean = false;

    const unsubHotkeyStore = hotkeysStore.subscribe(val => {
        hotkeys = val;
    });

    const unsubRecordingStore = recordingStore.subscribe(val => {
        recording = val;
    });

    onDestroy(() => {
        unsubHotkeyStore();
        unsubRecordingStore();
    });
</script>

<style lang="sass">
    @import "./src/style/theme"
    @import "./src/style/ui-grid"

    section
        left: 50%
        bottom: 2rem
        transform: translateX(-50%)

    .red
        color: $red

    .output-options

        &__popup
            padding: 0
            margin: 0
            display: grid
            grid-template-columns: auto auto
            gap: .5rem .75rem
            align-items: center

            input[type=checkbox]
                border-radius: $border-radius
                border: none
                background: $red

            input[type=text]
                border-radius: $border-radius
                border: none
                background: $white
                width: 250px
                padding: 0 .5rem
                font-family: "Obacht! Plex Sans", sans-serif
                font-size: .85rem
                color: $black

                &:disabled
                    background: $light-grey
                    background: $normal-grey
                    //color: $black

                &:focus
                    outline: none
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
        bind:popupOpen={outputOptionsOpen}
        popupPosition="mid bottom"
        on:click={() => {outputOptionsOpen = !outputOptionsOpen}}
    >
        <i class="fas fa-right event-none"></i>
        <svelte:fragment slot="popup">
            <div class="output-options__popup">
                <Checkbox label="MQTT"/>
                <input type="text" disabled value="192.168.178.48   topic: output">
                <Checkbox label="JSON"/>
                <input type="text">
            </div>
        </svelte:fragment>
    </UIButton>
</section>
