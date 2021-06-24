<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let value;
    export let label;

    const dispatch = createEventDispatcher();
</script>

<style lang="sass">
    @import "./src/style/theme"

    label
        display: flex
        position: relative
        cursor: pointer
        user-select: none
        justify-content: flex-start
        align-items: center

    input
        position: relative
        cursor: pointer
        height: 0
        width: 0
        display: none

    .checkbox
        position: relative
        height: 1.125rem
        width: 1.125rem
        background: $white
        border-radius: $border-radius
        margin-right: .5rem
        display: flex
        justify-content: center
        align-items: center
        font-size: .85rem

    .checkmark
        position: relative

    .hidden
        display: none
</style>

<label>
    <input type="checkbox" bind:checked={value} on:change={() => dispatch('change', value)}>
    <span class=checkbox>
        <span class:hidden={!value}>
            <i class="fas fa-check checkmark"></i>
        </span>
    </span>
    {label}
</label>
