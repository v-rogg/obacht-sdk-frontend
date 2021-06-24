<script lang="ts">
    import UIButton from "./UIButton.svelte";
    import { hotkeysStore, showTooltipStore } from "$lib/../store";
    import { onDestroy } from "svelte";
    import Checkbox from "$lib/Primitives/Checkbox.svelte";

    let hotkeys = "";
    let settingsPopupOpen = false;
    let showTooltip;

    const unsubHotkeyStore = hotkeysStore.subscribe(val => {
        hotkeys = val;
    });

    const unsubShowTooltipStore = showTooltipStore.subscribe(val => {
        showTooltip = val;
    });

    onDestroy(() => {
        unsubHotkeyStore();
        unsubShowTooltipStore();
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
            Here will be the global settings like configs<br/>
            <Checkbox label="Tooltips" value={showTooltip} on:change={(change) => {
                    showTooltip = change.detail;
                    showTooltipStore.set(showTooltip);
                }}/>
        </svelte:fragment>
    </UIButton>
</section>
