<script lang="ts">
    import { fly } from "svelte/transition";

    export let position: string = "top-center";

    let flyDirection: {x, y};

    const mainDirection = position.split("-")[0];

    switch (mainDirection) {
        case "top":
            flyDirection = {x: 0, y: 20};
            break;
        case "bottom":
            flyDirection = {x: 0, y: -20};
            break;
        case "left":
            flyDirection = {x: 20, y: 0};
            break;
        case "right":
            flyDirection = {x: -20, y: 0};
            break;
        default:
            flyDirection = {x: 0, y: 0};
    }

</script>

<style lang="sass">
    @import "./src/style/theme"

    .popup
        position: absolute
        border-radius: $border-radius
        width: max-content

    .top-center
        left: 50%
        transform: translateX(-50%)
        bottom: calc(100% + 1.5rem)


    .top-left
        right: 0
        bottom: calc(100% + 1.5rem)


    .top-right
        left: 0
        bottom: calc(100% + 1.5rem)


    .right-center
        left: calc(100% + 1.5rem)
        bottom: 50%
        transform: translateY(50%)


    .right-bottom
        left: calc(100% + 1.5rem)
        top: 0


    .right-top
        left: calc(100% + 1.5rem)
        bottom: 0


    .left-center
        right: calc(100% + 1.5rem)
        bottom: 50%
        transform: translateY(50%)


    .left-bottom
        right: calc(100% + 1.5rem)
        top: 0


    .left-top
        right: calc(100% + 1.5rem)
        bottom: 0


    .inner
        position: relative
        padding: 0
        margin: 0
        display: grid
        //gap: .5rem .75rem
        align-items: center
        grid-template-columns: auto
        gap: 1.5rem

</style>

<div
    class="popup {position}"
    transition:fly={{x: flyDirection.x, y: flyDirection.y}}
    >
    <div class="inner">
        <slot/>
    </div>
</div>
