<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let value: string = "";
    export let disabled: boolean = false;

    const dispatch = createEventDispatcher();
</script>

<style lang="sass">
    @import "./src/style/theme"

    input[type=text]
        border-radius: $border-radius
        border: none
        background: $white
        width: 250px
        padding: 0 .5rem
        font-family: "Obacht! Plex Sans", sans-serif
        font-size: .85rem
        color: $black

        &:disabled
            background: $light-grey
            background: $normal-grey

        &:focus
            outline: none
</style>

<input
    type="text"
    bind:value={value}
    disabled={disabled}
    on:change={() => dispatch('change', value)}
/>
