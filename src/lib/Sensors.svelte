<script context="module">
    export const prerender = true;
</script>

<script lang='ts'>
    import HzDisplay from '$lib/HzDisplay.svelte';
    import PingDisplay from '$lib/PingDisplay.svelte';
    import { tooltip } from '$lib/actions/tooltip';

    import { fly } from 'svelte/transition';
    import { tweened } from 'svelte/motion';
    import { linear } from 'svelte/easing';

    let open = true;

    const openWidth = 525
    const closedWidth = 212

    const width = tweened(openWidth, {
        duration: 125,
        easing: linear
    })

    function switchOpen() {
        if (open) {
            $width = closedWidth
        } else {
            $width = openWidth
        }
        open = !open
    }

</script>

<style lang='sass'>
    @import 'src/style/theme'

    .box
        //box-shadow: $shadow-md
        //width: max-content
        padding: 1rem
        border-radius: $border-radius
        position: fixed
        top: 2rem
        left: 2rem
        //border: .5px solid $light-grey
        display: grid
        gap: .8rem
        background: $white
        transition: 250ms ease width
        overflow: hidden
        background: $light-grey

        &:hover
            .close
                opacity: 1


    .margin-right
        margin-right: .25rem

    .sensor
        align-items: center
        cursor: default
        position: relative

    .header
        display: flex
        align-items: center
        justify-content: space-between

        &__text
            margin-right: 1rem

    .close
        opacity: 0
        width: 1rem
        height: 1rem
        display: flex
        justify-content: center
        align-items: center
        border-radius: $border-radius-small
        padding: .4rem
        cursor: pointer
        transition: 250ms ease all, 0ms ease box-shadow

        > span
            transition: 500ms ease transform

        &:hover
            //background: $light-grey

        &:active
            background: $white

    .rotate180
        transform: rotateY(180deg)

    .wrap
        position: absolute
        display: inline-flex
        align-items: center
        //width: 500px
        min-width: 400px

        .sensor__model
            margin: 0 2rem 0 2rem
            width: max-content

        .battery
            margin: 0 0 0 1.5rem
            width: max-content
</style>

<div class='box' class:open={open} style='width: {$width}px'>
<!--    <div class='header'><div><i class="fas fa-sensor-on margin-right"></i>   Connected Sensors</div><div class='close'><i class="far fa-angle-left"></i></div></div>-->
    <div class='header'>
        <div class='header__text'><i class="fas fa-sensor-on margin-right"></i>   Connected Sensors</div>
        <div class='close' on:click={switchOpen}><span class:rotate180={open}><i class="fal fa-angle-right"></i></span></div>
    </div>
    <div class='sensor'><span title='Sensor IP' use:tooltip>192.168.178.110</span>
        {#if open}
            <span transition:fly={{duration: 150, x: -10, delay: open? 100 : 0}} class='wrap'>
                <span class='sensor__model' title='Sensor Model' use:tooltip>RPLidar S1</span>   <HzDisplay/> <PingDisplay/>  <span class='battery'><i class="far fa-battery-half margin-right"></i> 69%</span>
            </span>
        {/if}
    </div>
</div>
