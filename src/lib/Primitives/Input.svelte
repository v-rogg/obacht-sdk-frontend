<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { tooltip } from "$lib/Actions/tooltip";

    export let value: string = "";
    export let title: string = "";
    export let disabled: boolean = false;

    const dispatch = createEventDispatcher();
</script>

<style lang="sass">
    @import "./src/style/theme"

    input[type=text]
        border-radius: $border-radius
        border: none
        background: $white
        width: calc(4rem * 3)
        //padding: 0 .5rem
        padding: .75rem
        font-family: "Obacht! Plex Sans", sans-serif
        font-size: .85rem
        color: $black

        &:disabled
            background: $light-grey
            background: $normal-grey

        &:focus
            outline: none

    .addon
        position: absolute
        //margin-left: .5rem
        right: .5rem
        top: 50%
        transform: translateY(calc(-50% - 1px))
</style>

<input
    type="text"
    title={title}
    use:tooltip
    bind:value={value}
    disabled={disabled}
    on:change={() => dispatch('change', value)}
/>

<span class="addon">
    <slot name="addon"/>
</span>
