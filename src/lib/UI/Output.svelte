<script lang="ts">
    import UIButton from "$lib/UI/UIButton/UIButton.svelte";
    import {
        hotkeysStore,
        recordingStore,
        outputSettingsStore,
        backendAddressStore,
        messageStore, wsStore, pausedStore,
    } from "$lib/../store";
    import { onDestroy } from "svelte";
    import Checkbox from "$lib/Primitives/Checkbox.svelte";
    import Input from "$lib/Primitives/Input.svelte";

    let hotkeys = {};
    let paused: boolean = false;
    let recording: boolean = false;
    let outputOptionsOpen: boolean = false;
    let outputSettings = {
        MQTT: {
            enabled: true,
        },
        LOG: {
            enabled: false,
            location: "D:\\output.log"
        }
    }
    let mqttLocation: string;
    let mqttPort = "1883";
    let ws;

    const unsubHotkeyStore = hotkeysStore.subscribe(val => {
        hotkeys = val;
    });

    const unsubRecordingStore = recordingStore.subscribe(val => {
        recording = val;
    });

    const unsubOutputSettingsStore = outputSettingsStore.subscribe(val => {
        outputSettings = val;
    });

    const unsubPausedStore = pausedStore.subscribe(val => paused = val)

    const unsubMessageStore = messageStore.subscribe(message => {
        const splitMessage = message.split(";");
        if (splitMessage[0] === "system" ) {
            if (splitMessage[1] === "output") {
                switch (splitMessage[2]) {
                    case "mqtt":
                        outputSettings.MQTT.enabled = (splitMessage[3]) === "true";
                        outputSettingsStore.set(outputSettings);
                        break;
                    case "log":
                        outputSettings.LOG.enabled = (splitMessage[3]) === "true";
                        outputSettingsStore.set(outputSettings);
                        break;
                    case "recording":
                        recordingStore.set(splitMessage[3] === "true");
                        break;
                    default:
                        break;
                }
            }
        }
    });

    const unsubBackendAddressStore = backendAddressStore.subscribe(val => {
        mqttLocation = val.split(":")[0]
    });

    const unsubWsStore = wsStore.subscribe(val => {
        if (val) ws = val;
    });

    onDestroy(() => {
        unsubHotkeyStore();
        unsubRecordingStore();
        unsubOutputSettingsStore();
        unsubBackendAddressStore();
        unsubMessageStore();
        unsubWsStore();
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

    .margin-right
        margin-right: 1rem

    .recoding-text
        display: flex
        align-items: center
        position: absolute
        width: max-content
        left: calc(100% + 1.5rem)
        top: 50%
        transform: translateY(-50%)

        @media (max-width: 900px)
            left: 50%
            top: -100%
            transform: translateX(-50%)
</style>

<section class="outputs">
    <UIButton
        active={true}
        title="Snapshot"
        hotkey={hotkeys.toolPause}
        on:click={() => {pausedStore.set(!paused)}}
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
        on:click={() => {
            recordingStore.set(!recording)
            ws.send("system;output;recording;" + recording)
        }}
    >
        <span class:hidden={!recording} class="red event-none">
            <i class="fas fa-circle fa-fade event-none"></i>
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
        popupPosition="top-center"
        popupGridColumnsCount="2"
        on:click={() => {outputOptionsOpen = !outputOptionsOpen}}
    >
        <i class="fas fa-right event-none"></i>
        <svelte:fragment slot="popup">
                <Checkbox label="MQTT" value={outputSettings.MQTT.enabled} on:change={(change) => {
                    ws.send("system;output;mqtt;" + change.detail)
                }}/>
                <Input disabled value="{mqttLocation}:{mqttPort}   topic: output" />
                <Checkbox label="Log" value={outputSettings.LOG.enabled} on:change={(change) => {
                    ws.send("system;output;log;" + change.detail)
                }}/>
                <Input value={outputSettings.LOG.location} on:change={(change) => {
                    outputSettings.LOG.location = change.detail;
                    outputSettingsStore.set(outputSettings);
                }}/>
        </svelte:fragment>
    </UIButton>
    {#if recording}
    <div class="recoding-text">
        <i class="fas fa-circle fa-fade event-none red margin-right"></i>
        <div>
            {#if outputSettings.MQTT.enabled}
                <div>Streaming over MQTT</div>
            {/if}
            {#if outputSettings.LOG.enabled}
                <div>Storing log file</div>
            {/if}
        </div>
    </div>
    {/if}
</section>
