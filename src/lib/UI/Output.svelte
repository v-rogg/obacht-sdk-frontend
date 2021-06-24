<script lang="ts">
    import UIButton from "$lib/UI/UIButton.svelte";
    import { hotkeysStore, recordingStore, outputSettingsStore } from "$lib/../store";
    import { onDestroy } from "svelte";
    import Checkbox from "../Primitives/Checkbox.svelte";
    import Input from "../Primitives/Input.svelte";

    let hotkeys = {};
    let paused: boolean = false;
    let recording: boolean = false;
    let outputOptionsOpen: boolean = false;
    let outputSettings = {}

    const unsubHotkeyStore = hotkeysStore.subscribe(val => {
        hotkeys = val;
    });

    const unsubRecordingStore = recordingStore.subscribe(val => {
        recording = val;
    });

    const unsubOutputSettingsStore = outputSettingsStore.subscribe(val => {
        outputSettings = val;
    });

    onDestroy(() => {
        unsubHotkeyStore();
        unsubRecordingStore();
        unsubOutputSettingsStore()
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
                <Checkbox label="MQTT"/>
                <Input type="text" disabled value="192.168.178.48   topic: output" />
                <Checkbox label="JSON"/>
                <Input value={outputSettings.JSON.location} on:change={(change) => {
                    outputSettings.JSON.location = change.detail;
                    outputSettingsStore.set(outputSettings);
                }}/>
        </svelte:fragment>
    </UIButton>
</section>
