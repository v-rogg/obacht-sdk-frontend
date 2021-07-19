<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let id;
    export let value;
    export let min;
    export let max;
    export let step;
    export let unit;

    const dispatch = createEventDispatcher();
</script>

<style lang="sass">
    @import "src/style/theme"

    input[type="range"]
        //margin: auto
        -webkit-appearance: none
        position: relative
        overflow: hidden
        //height: 1.25rem
        height: 2.5rem
        padding: 0
        margin: 0
        width: calc(4rem * 3 + 1.5rem)
        cursor: pointer
        border-radius: $border-radius /* iOS */


    ::-webkit-slider-runnable-track
        background: $white

    /*
     * 1. Set to 0 width and remove border for a slider without a thumb
     */
    ::-webkit-slider-thumb
        -webkit-appearance: none
        width: 20px /* 1 */
        height: 2.5rem
        background: $white
        box-shadow: -100vw 0 0 100vw $black
        border-radius: $border-radius
        border: none
    /*     border: 2px solid #999; 1 */


    ::-moz-range-track
        height: 2.5rem
        background: $white


    ::-moz-range-thumb
        background: $black
        height: 2.5rem
        width: 4px
        border: none
        border-radius: $border-radius !important
        box-shadow: -100vw 0 0 100vw $black
        box-sizing: border-box
    /*     border: 3px solid #999; */
    /*     border-radius: 4px; */

    ::-ms-fill-lower
        background: $black
        border-radius: $border-radius

    ::-ms-thumb
        background: $black
        border: 2px solid $black
        height: 2.5rem
        width: 20px
        box-sizing: border-box

    ::-ms-ticks-after
        display: none

    ::-ms-ticks-before
        display: none

    ::-ms-track
        background: $black
        color: transparent
        height: 40px
        border: none

    ::-ms-tooltip
        display: none

    .range
        position: relative
        overflow: hidden
        height: 2.5rem

    label
        position: absolute
        top: 50%
        transform: translateY(-50%)
        left: .75rem
        width: calc(4rem * 3)
        color: $white
        font-size: $size-small
        display: flex
        justify-content: space-between
        pointer-events: none
        mix-blend-mode: difference

    .icon
        margin-right: .5rem
</style>

<span class="range">
    <input id={id} type="range" bind:value={value} min={min} max={max} step={step} on:change={() => dispatch('change', value)}>
    <label for={id}>
        <span><span class="icon"><i class="fas fa-radar"></i></span><slot/></span>
        <span>{value} {unit}</span>
    </label>
</span>
