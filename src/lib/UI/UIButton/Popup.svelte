<script lang="ts">
    import { fly } from "svelte/transition";

    export let position: string = "top-center";
    export let gridColumnnsCount = 2;
    export let bg = true;

    let flyDirection: {x, y};

    const mainDirection = position.split("-")[0];

    switch (mainDirection) {
        case "top":
            flyDirection = {x: 0, y: 10};
            break;
        case "bottom":
            flyDirection = {x: 0, y: -10};
            break;
        case "left":
            flyDirection = {x: 10, y: 0};
            break;
        case "right":
            flyDirection = {x: -10, y: 0};
            break;
        default:
            flyDirection = {x: 0, y: 0};
    }

</script>

<style lang="sass">
    @import "./src/style/theme"

    .popup
        position: absolute
        padding: 1rem
        border-radius: $border-radius
        width: max-content

    .top-center
        left: 50%
        transform: translateX(-50%)
        bottom: calc(100% + 1.5rem)
        .arrow
            left: 50%
            transform: translateX(-50%) rotateZ(45deg)
            border-radius: 0 0 $border-radius 0
            bottom: -.75rem

    .top-left
        right: 0
        bottom: calc(100% + 1.5rem)
        .arrow
            right: 1.25rem
            transform: rotateZ(45deg)
            border-radius: 0 0 $border-radius 0
            bottom: -.75rem

    .top-right
        left: 0
        bottom: calc(100% + 1.5rem)
        .arrow
            left: 1.25rem
            transform: rotateZ(45deg)
            border-radius: 0 0 $border-radius 0
            bottom: -.75rem

    .right-center
        left: calc(100% + 1.5rem)
        bottom: 50%
        transform: translateY(50%)
        .arrow
            top: 50%
            transform: translateY(-50%) rotateZ(45deg)
            border-radius: 0 0 0 $border-radius
            left: -.75rem

    .right-bottom
        left: calc(100% + 1.5rem)
        top: 0
        .arrow
            top: 1.25rem
            transform: rotateZ(45deg)
            border-radius: 0 0 0 $border-radius
            left: -.75rem

    .right-top
        left: calc(100% + 1.5rem)
        bottom: 0
        .arrow
            bottom: 1.25rem
            transform: rotateZ(45deg)
            border-radius: 0 0 0 $border-radius
            left: -.75rem

    .left-center
        right: calc(100% + 1.5rem)
        bottom: 50%
        transform: translateY(50%)
        .arrow
            top: 50%
            transform: translateY(-50%) rotateZ(45deg)
            border-radius: 0 0 0 $border-radius
            right: -.75rem

    .left-bottom
        right: calc(100% + 1.5rem)
        top: 0
        .arrow
            top: 1.25rem
            transform: rotateZ(45deg)
            border-radius: 0 0 0 $border-radius
            right: -.75rem

    .left-top
        right: calc(100% + 1.5rem)
        bottom: 0
        .arrow
            bottom: 1.25rem
            transform: rotateZ(45deg)
            border-radius: 0 0 0 $border-radius
            right: -.75rem

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

    .bg
        background: $normal-grey
        .arrow
            background: $normal-grey
</style>

<div
    class="popup {position}"
    transition:fly={{x: flyDirection.x, y: flyDirection.y}}
    class:bg={bg}
    >
    <div class="arrow"></div>
    <div class="inner" style="grid-template-columns: repeat( {gridColumnnsCount} , auto);">
        <slot/>
    </div>
</div>
