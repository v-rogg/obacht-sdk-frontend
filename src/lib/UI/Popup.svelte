<script lang="ts">
    import { fly } from "svelte/transition";

    export let position: string = "mid top";
    export let gridColumnnsCount = 2;
</script>

<style lang="sass">
    @import "./src/style/theme"

    .popup
        position: absolute
        background: $normal-grey
        padding: 1rem
        border-radius: $border-radius
        width: max-content

    .mid
        left: 50%
        transform: translateX(-50%)
        .arrow
            left: 50%
            transform: translateX(-50%) rotateZ(45deg)
        &.top
            bottom: calc(100% + 1.5rem)
            .arrow
                border-radius: 0 0 $border-radius 0
                bottom: -.75rem

    .left
        right: 0
        .arrow
            right: 1.25rem
            transform: rotateZ(45deg)
        &.top
            bottom: calc(100% + 1.5rem)
            .arrow
                border-radius: 0 0 $border-radius 0
                bottom: -.75rem

    .right
        left: 0
        .arrow
            left: 1.25rem
            transform: rotateZ(45deg)
        &.top
            bottom: calc(100% + 1.5rem)
            .arrow
                border-radius: 0 0 $border-radius 0
                bottom: -.75rem


    .inner
        position: relative
        padding: 0
        margin: 0
        display: grid
        gap: .5rem .75rem
        align-items: center

    .arrow
        position: absolute
        width: 1.5rem
        height: 1.5rem
        background: $normal-grey
</style>

<div class="popup {position}" transition:fly={{y: 10}}>
    <div class="arrow"></div>
    <div class="inner" style="grid-template-columns: repeat( {gridColumnnsCount} , auto);">
        <slot/>
    </div>
</div>
