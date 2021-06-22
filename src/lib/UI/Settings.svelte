<script lang="ts">
    import UIButton from "./UIButton.svelte";
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
        right: 2rem
        bottom: 2rem
</style>

<section class="settings">
    <UIButton
        active={true}
        title="Settings"
        hotkey={hotkeys.toolSettings}
        on:click={() => {console.log('settings')}}
    >
        <i class="fas fa-gear event-none"></i>
    </UIButton>
</section>
