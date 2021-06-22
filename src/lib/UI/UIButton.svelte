<script lang="ts">
    import { tooltip } from "$lib/actions/tooltip";
    import { hotkey as hotkeyAction } from "$lib/actions/hotkeys";
    import { createEventDispatcher } from 'svelte';

    export let active: boolean;
    export let title: string;
    export let hotkey: string;

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

        &:hover:not(.open)
            cursor: pointer

        &:active:not(.open)
            background: $light-grey
            color: $black

    .active
        background: $light-grey
        color: $black
</style>

<button
        class:active={active}
        title={title}
        hotkey={hotkey}
        use:hotkeyAction
        use:tooltip
        on:click={() => {dispatch("click")}}
>
  <slot/>
</button>
