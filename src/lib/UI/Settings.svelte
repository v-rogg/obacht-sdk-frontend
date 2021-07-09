<script lang="ts">
    import UIButton from "$lib/UI/UIButton/UIButton.svelte";
    import { backendAddressStore, hotkeysStore, showTooltipStore, wsConnectionStore, wsStore } from "$lib/../store";
    import { onDestroy } from "svelte";
    import Input from "$lib/Primitives/Input.svelte";

    let hotkeys = "";
    let settingsPopupOpen = false;
    let showTooltip;
    let ws;
    let wsConnectionStatus;
    let backendAddress;

    const unsubHotkeyStore = hotkeysStore.subscribe(val => hotkeys = val);
    const unsubShowTooltipStore = showTooltipStore.subscribe(val => showTooltip = val);
    const unsubWsStore = wsStore.subscribe(val => {
        if (val) ws = val;
    });
    const unsubWsConnectionStore = wsConnectionStore.subscribe(val => wsConnectionStatus = val);
    const unsubBackendAddressStore = backendAddressStore.subscribe(val => backendAddress = val);

    function updateWsStore(url) {
        if (url) {
            ws.close();
            localStorage.setItem("backendAddress", url);
            backendAddressStore.set(url);
        }
    }

    function sendResetOrigin() {
        ws.send("system;move;origin;origin;0;0")
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

    .red
        color: $red

    .buttons
        display: flex
        gap: .5rem .75rem
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
                <Input value={backendAddress} on:change={change => {updateWsStore(change.detail)}} title="Backend address">
                    <svelte:fragment slot="addon">
                        <span class:hidden={!wsConnectionStatus} ><i class="fas fa-check"></i></span>
                        <span class:hidden={wsConnectionStatus} class="red"><i class="fas fa-triangle-exclamation fa-fade"></i></span>
                    </svelte:fragment>
                </Input>
            </div>
            <div class="buttons">
                <UIButton title="Enable tooltips" active={showTooltip} on:click={() => {
                        showTooltip = !showTooltip;
                        showTooltipStore.set(showTooltip);
                    }}>
                    <i class="far fa-circle-info event-none"></i>
                </UIButton>
                <UIButton on:click={sendResetOrigin} title="Reset Origin">
                    <i class="fas fa-crosshairs event-none"></i>
                    <svelte:fragment slot="addon">
                        <i class="fas fa-arrow-rotate-left event-none"></i>
                    </svelte:fragment>
                </UIButton>
            </div>
        </svelte:fragment>
    </UIButton>
</section>
