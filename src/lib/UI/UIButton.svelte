<script lang="ts">
    import { tooltip } from "$lib/actions/tooltip";
    import { hotkey as hotkeyAction } from "$lib/actions/hotkeys";
    import { createEventDispatcher } from 'svelte';

    export let active: boolean;
    export let title: string;
    export let hotkey: string;
    export let disabled: boolean;

    const dispatch = createEventDispatcher();
</script>

<style lang="sass">
    @import "./src/style/theme"

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
</style>

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
    <span class="lock event-none" class:hidden={!disabled}>
        <i class="fas fa-lock"></i>
    </span>
</button>
