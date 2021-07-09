<script lang="ts">
    import { tooltip } from "$lib/Actions/tooltip";
    import { hotkey as hotkeyAction } from "$lib/Actions/hotkeys";
    import { clickOutside } from "$lib/Actions/clickOutside";
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import Popup from "$lib/UI/UIButton/Popup.svelte";
    import Group from "$lib/UI/UIButton/Group.svelte";

    export let active: boolean = true;
    export let title: string = "";
    export let hotkey: string = "";
    export let disabled: boolean = false;
    export let danger: boolean = false;
    export let popupOpen: boolean = false;
    export let popupPosition: string = "top-center";
    export let popupBg: boolean = true;
    export let popupGridColumnsCount: number = 2;
    export let popupType: string = "popup"
    const popupSide = popupPosition.split("-")[0];

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
        outline: none

        &:hover:not(.open):not(:disabled)
            cursor: pointer

        &:active:not(.open):not(:disabled)
            background: $light-grey
            color: $black

    .active
        background: $light-grey
        color: $black

    .lock, .danger
        position: absolute
        bottom: .25rem
        right: .25rem
        font-size: .85rem

    .lock
        color: $black

    .danger
        color: $red

    .group
        position: absolute
        font-size: .85rem
        bottom: 0

    .right, .top, .bottom
        right: .25rem
        > *
            transform: rotateZ(45deg)

    .left
        left: .25rem
        > *
            transform: rotateZ(135deg)

    .addon
        position: absolute
        font-size: .85rem
        top: .25rem
        right: .5rem
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
        <slot/>
        <span class="addon event-none">
            <slot name="addon"/>
        </span>

        <span class="lock event-none" class:hidden={!disabled}>
            <i class="fas fa-lock"></i>
        </span>

        <span class="danger event-none" class:hidden={!danger}>
            <i class="fas fa-triangle-exclamation"></i>
        </span>

        {#if $$slots.popup && popupType === "group"}
            <span class="group event-none {popupSide}">
                <i class="fa-solid fa-caret-right"></i>
            </span>
        {/if}
    </button>

    {#if $$slots.popup && popupOpen && popupType === "popup"}
        <div transition:fade="{{duration: 50 }}"
             use:clickOutside={() => {popupOpen = false}}>
            <Popup
                position={popupPosition}
                bg={popupBg}
                gridColumnnsCount={popupGridColumnsCount}>
                <slot name="popup"/>
            </Popup>
        </div>
    {/if}

    {#if $$slots.popup && popupOpen && popupType === "group"}
        <div transition:fade="{{duration: 50 }}">
            <Group position={popupPosition}>
                <slot name="popup"/>
            </Group>
        </div>
    {/if}
</div>

