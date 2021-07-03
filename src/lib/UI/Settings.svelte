<script lang="ts">
    import UIButton from "./UIButton.svelte";
    import { hotkeysStore, showTooltipStore, wsConnectionStore, wsStore } from "$lib/../store";
    import { onDestroy, onMount } from "svelte";
    import Checkbox from "$lib/Primitives/Checkbox.svelte";
    import Input from "../Primitives/Input.svelte";
    // import { browser } from "$app/env";

    let hotkeys = "";
    let settingsPopupOpen = false;
    let showTooltip;
    let ws;
    let wsConnectionStatus;

    const unsubHotkeyStore = hotkeysStore.subscribe(val => {
        hotkeys = val;
    });

    const unsubShowTooltipStore = showTooltipStore.subscribe(val => {
        showTooltip = val;
    });

    const unsubWsStore = wsStore.subscribe(val => {
        if (val) ws = val;
    });

    const unsubWsConnectionStore = wsConnectionStore.subscribe(val => {
        console.log(val);
        wsConnectionStatus = val
    });

    function updateWsStore(url) {
        if (url) {
            ws.close();
            wsStore.set(new WebSocket(url));
        };
    }

    onDestroy(() => {
        unsubHotkeyStore();
        unsubShowTooltipStore();
        unsubWsStore();
        unsubWsConnectionStore();
    });
</script>

<style lang="sass">
    @import "./src/style/theme"
    @import "./src/style/ui-grid"

    section
        right: 2rem
        bottom: 2rem
</style>

<section class="settings">
    <UIButton
        active={true}
        title="Settings"
        hotkey={hotkeys.toolSettings}
        bind:popupOpen={settingsPopupOpen}
        popupPosition="left top"
        popupGridColumnsCount="1"
        on:click={() => {settingsPopupOpen = !settingsPopupOpen}}
    >
        <i class="fas fa-gear event-none"></i>
        <svelte:fragment slot="popup">
<!--            Here will be the global settings like configs<br/>-->
            <Input value={ws.url} on:change={change => {updateWsStore(change.detail)}}/>
            {wsConnectionStatus}
            <Checkbox label="Tooltips" value={showTooltip} on:change={(change) => {
                    showTooltip = change.detail;
                    showTooltipStore.set(showTooltip);
                }}/>
        </svelte:fragment>
    </UIButton>
</section>
