<script lang="ts">
    import UIButton from "$lib/UI/UIButton/UIButton.svelte";
    import { backendAddressStore, hotkeysStore, showTooltipStore, wsConnectionStore, wsStore } from "$lib/../store";
    import { onDestroy } from "svelte";
    import Checkbox from "$lib/Primitives/Checkbox.svelte";
    import Input from "$lib/Primitives/Input.svelte";
    // import { browser } from "$app/env";

    let hotkeys = "";
    let settingsPopupOpen = false;
    let showTooltip;
    let ws;
    let wsConnectionStatus;
    let backendAddress;

    const unsubHotkeyStore = hotkeysStore.subscribe(val => hotkeys = val);
    const unsubShowTooltipStore = showTooltipStore.subscribe(val => showTooltip = val);
    const unsubWsStore = wsStore.subscribe(val => {if (val) ws = val});
    const unsubWsConnectionStore = wsConnectionStore.subscribe(val => wsConnectionStatus = val);
    const unsubBackendAddressStore = backendAddressStore.subscribe(val => backendAddress = val);

    function updateWsStore(url) {
        if (url) {
            ws.close();
            // document.cookie = `backendAddress=${url}; SameSite=Strict; Secure`;
            localStorage.setItem("backendAddress", url);
            backendAddressStore.set(url);
        }
    }

    onDestroy(() => {
        unsubHotkeyStore();
        unsubShowTooltipStore();
        unsubWsStore();
        unsubWsConnectionStore();
        unsubBackendAddressStore();
    });
</script>

<style lang="sass">
    @import "./src/style/theme"
    @import "./src/style/ui-grid"

    section
        right: 2rem
        bottom: 2rem

    .ws
        position: relative
        span
            position: absolute
            //margin-left: .5rem
            right: .5rem
            top: 1px

    .red
        color: $red
</style>

<section class="settings">
    <UIButton
        active={true}
        title="Settings"
        hotkey={hotkeys.toolSettings}
        bind:popupOpen={settingsPopupOpen}
        danger={!wsConnectionStatus}
        popupPosition="top-left"
        popupGridColumnsCount="1"
        on:click={() => {settingsPopupOpen = !settingsPopupOpen}}
    >
        <i class="fas fa-gear event-none"></i>
        <svelte:fragment slot="popup">
<!--            Here will be the global settings like configs<br/>-->
            <div class="ws">
                <Input value={backendAddress} on:change={change => {updateWsStore(change.detail)}}/>
                <span class:hidden={!wsConnectionStatus} ><i class="fas fa-check"></i></span>
                <span class:hidden={wsConnectionStatus} class="red"><i class="fas fa-triangle-exclamation fa-fade"></i></span>
            </div>
            <Checkbox label="Tooltips" value={showTooltip} on:change={(change) => {
                    showTooltip = change.detail;
                    showTooltipStore.set(showTooltip);
                }}/>
        </svelte:fragment>
    </UIButton>
</section>
