<script context="module">
    export const prerender = true;
</script>

<script lang="ts">
    import HzDisplay from "$lib/UI/Sensors/HzDisplay.svelte";
    import PingDisplay from "$lib/UI/Sensors/PingDisplay.svelte";
    import { tooltip } from "$lib/actions/tooltip";
    import { sensorStore, socketStore } from "$lib/../store";
    import { fly } from "svelte/transition";
    import { tweened } from "svelte/motion";
    import { linear } from "svelte/easing";
    import { onDestroy } from "svelte";

    let open = true;
    let innerWidth = 0;

    let sensors: {address, Hostname, Model}[] = [{
            address: "localhost",
            Hostname: "localhost",
            Model: "97",
        }]

    let sensorModels = {
        "97": "RPLiDAR S1",
        "24": "RPLiDAR A1"
    };


    sensorStore.subscribe(val => {
        sensors = val;
        console.log(sensors);
    })

    const openWidth = 525
    const closedWidth = 212

    const width = tweened(openWidth, {
        duration: 125,
        easing: linear
    });

    const unsubSocketStore = socketStore.subscribe(value => {
        // let [type, hostname, address, model]
        switch(value[0]) {
            case "+":
                const [type, hostname, c, model] = value.split(":");
                sensors = [...sensors, {
                    address: c,
                    Hostname: hostname,
                    Model: model,
                }]
                break;
            case "-":
                const [a, b, address] = value.split(":");
                const resInd = sensors.findIndex(({address}) => sensors.address === address);
                sensors.splice(resInd, 1);
                sensors = sensors;
                break;
        }
    })

    function switchOpen() {
        if (open) {
            $width = closedWidth
        } else {
            $width = openWidth
        }
        open = !open
    }

    function getForcedClosed(innerWidth) {
        if (innerWidth < 840) {
            $width = closedWidth;
            open = false;
            return true;
        } else {
            $width = openWidth;
            open = true;
            return false;
        }
    }

    $: forceClosed = getForcedClosed(innerWidth);

    onDestroy(() => {
        unsubSocketStore();
    })
</script>

<style lang="sass">
    @import "src/style/theme"

    .box
        padding: 1rem
        border-radius: $border-radius
        position: fixed
        top: 2rem
        left: 2rem
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

<svelte:window bind:innerWidth={innerWidth}/>

<div class="box" class:open={open} style="width: {$width}px">
    <div class="header">
        <div class="header__text"><i class="fas fa-sensor-on margin-right"></i>   Connected Sensors</div>
        <div class="close" on:click={switchOpen}><span class:rotate180={open}><i class="fal fa-angle-right"></i></span></div>
    </div>
    {#each sensors as sensor}
        <div class="sensor"><span title="Sensor IP" use:tooltip>{sensor.address}</span>
            {#if open}
                <span transition:fly={{duration: 150, x: -10, delay: open? 100 : 0}} class="wrap">
                    <span class="sensor__model" title="Sensor Model: {sensor.Model}" use:tooltip>{sensorModels[sensor.Model]}</span>   <HzDisplay model={sensor.Model} address={sensor.address}/> <PingDisplay address={sensor.address}/>  <span class="battery" title="Start sensor scan" use:tooltip><i class="fas fa-play event-none"></i></span>
<!--                    <span class="sensor__model" title="Sensor Model: {sensor.model}" use:tooltip>RPLidar S1</span>   <HzDisplay model={parseInt(sensor.model)}/> <PingDisplay/>  <span class="battery" title="Battery estimate" use:tooltip><i class="far fa-battery-half margin-right event-none"></i> 69% <i class="fas fa-play"></i></span>-->
                </span>
            {/if}
        </div>
    {/each}
</div>
