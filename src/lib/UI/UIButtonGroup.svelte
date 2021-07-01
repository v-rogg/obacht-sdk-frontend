<script lang="ts">
    import { tooltip } from "$lib/Actions/tooltip";
    import { hotkey as hotkeyAction } from "$lib/Actions/hotkeys";
    import { clickOutside } from "$lib/Actions/clickOutside";
    import { createEventDispatcher } from "svelte";
    import Popup from "$lib/UI/Popup.svelte";
    import { fade } from "svelte/transition";

    export let active: boolean;
    export let title: string;
    export let hotkey: string;
    export let disabled: boolean;
    export let popupOpen;
    export let popupPosition: string;
    export let popupGridColumnsCount;

    const dispatch = createEventDispatcher();
</script>

<style lang="sass">
    @import "./src/style/theme"

    .ui-button
        position: relative

    button
        border: none
        background: $white
        width: 4rem
        height: 4rem
        font-size: 1.5rem
        display: flex
        justify-content: center
        align-items: center
        border-radius: $border-radius
        color: $normal-grey
        position: relative

        &:hover:not(.open):not(:disabled)
            cursor: pointer

        &:active:not(.open):not(:disabled)
            background: $light-grey
            color: $black

    .active
        background: $light-grey
        color: $black

    .lock
        position: absolute
        bottom: 6px
        right: 6px
        font-size: .85rem
        color: $black

    .group
        position: absolute
        background: $normal-grey
        padding: 1rem
        border-radius: $border-radius
        width: max-content
        left: 50%
        transform: translateX(-50%)
        bottom: calc(100% + 1.5rem)

</style>

<div class="ui-button">
    <button
        class:active={active}
        title={title}
        hotkey={hotkey}
        use:hotkeyAction
        use:tooltip
        disabled={disabled}
        on:click={() => {dispatch("click")}}
    >
        <slot name="button"/>
        <span class="lock event-none" class:hidden={!disabled}>
            <i class="fas fa-lock"></i>
        </span>
    </button>

    {#if popupOpen}
        <div transition:fade="{{duration: 50 }}"
             use:clickOutside={() => {popupOpen = false}}
             class="group">
    <!--        <Popup position={popupPosition} gridColumnnsCount={popupGridColumnsCount}>-->
                <slot/>
    <!--        </Popup>-->
        </div>
    {/if}
</div>

