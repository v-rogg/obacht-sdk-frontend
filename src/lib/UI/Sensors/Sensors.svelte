<script context="module">
    export const prerender = true;
</script>

<script lang="ts">
    import HzDisplay from "$lib/UI/Sensors/HzDisplay.svelte";
    import PingDisplay from "$lib/UI/Sensors/PingDisplay.svelte";
    import { tooltip } from "$lib/actions/tooltip";
    import { sensorStore, selectedSensorStore, toolStore } from "$lib/../store";
    import { fly } from "svelte/transition";
    import { tweened } from "svelte/motion";
    import { linear } from "svelte/easing";
    import { onDestroy } from "svelte";
    import SensorIcon from "./SensorIcon.svelte";

    let open = true;
    let innerWidth = 0;

    let sensors: { address, Hostname, Model }[] = [{
        address: "localhost",
        Hostname: "localhost",
        Model: "97",
    }];

    let sensorModels = {
        "97": "RPLiDAR S1",
        "24": "RPLiDAR A1",
    };

    let selectedSensor;
    let toolStoreProxy;

    const openWidth = 480;
    const closedWidth = 212;

    const width = tweened(openWidth, {
        duration: 125,
        easing: linear,
    });

    const unsubSensorStore = sensorStore.subscribe(val => sensors = val);
    const unsubSelectedSensorStore = selectedSensorStore.subscribe(val => selectedSensor = val);
    const unsubToolStore = toolStore.subscribe(val => toolStoreProxy = val);

    function switchOpen() {
        if (open) {
            $width = closedWidth;
        } else {
            $width = openWidth;
        }
        open = !open;
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
        unsubSensorStore();
        unsubSelectedSensorStore();
        unsubToolStore();
    });
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
        //background: $white

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

    .notSelected
        //color: $medium-grey
        //background: $light-grey
</style>

<svelte:window bind:innerWidth={innerWidth}/>

<div class="box" class:open={open} style="width: {$width}px">
    <div class="header">
        <div class="header__text"><i class="fas fa-sensor-on margin-right"></i>   Connected Sensors</div>
        <div class="close" on:click={switchOpen}><span class:rotate180={open}><i class="fal fa-angle-right"></i></span></div>
    </div>
    {#each sensors as sensor}
        <div class="sensor"
             class:notSelected={selectedSensor !== sensor.address && (toolStoreProxy.includes("zonesAdd") || toolStoreProxy.includes("zonesMove") || toolStoreProxy.includes("zonesRemove"))}
             on:click={() => {(toolStoreProxy.includes("zonesAdd") || toolStoreProxy.includes("zonesMove") || toolStoreProxy.includes("zonesRemove")) ? selectedSensorStore.set(sensor.address) : null}}>
            <span title="X: {Math.trunc(sensor.x)} Y: {Math.trunc(sensor.y)} Rotation: {sensor.radian * (180/Math.PI)}°" use:tooltip>
                <SensorIcon color={selectedSensor !== sensor.address && (toolStoreProxy.includes("zonesAdd") || toolStoreProxy.includes("zonesMove") || toolStoreProxy.includes("zonesRemove")) ? "DFE1E4" : sensor.color}/>
            </span>
            <span title="Sensor IP - Hostname: {sensor.hostname}" use:tooltip>{sensor.address}</span>
            {#if open}
                <span transition:fly={{duration: 150, x: -10, delay: open? 100 : 0}} class="wrap">
                    <span class="sensor__model" title="Sensor Model: {sensor.model}" use:tooltip>{sensorModels[sensor.model]}</span>   <HzDisplay model={sensor.model} address={sensor.address}/> <PingDisplay address={sensor.address}/>
                </span>
            {/if}
        </div>
    {/each}
</div>

{selectedSensor}
