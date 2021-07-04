<script lang="ts">
    import { fade } from 'svelte/transition';

    type SpinnerTypes = {
        size: string | number
        color: string
        unit: string
        duration: string
    }

    export let color: SpinnerTypes["color"] = "#FF0000";
    export let unit: SpinnerTypes["unit"] = "rem";
    export let duration: SpinnerTypes["duration"] = "1.5s";
    export let size: SpinnerTypes["size"] = "2";
    export let show;

    let durationUnit = duration.match(durationUnitRegex)[0];
    let durationNum: any = duration.replace(durationUnitRegex, "");
    const durationUnitRegex = /[a-zA-Z]/;

    function range (size, startAt = 0) {
        return [...Array(size).keys()].map(i => i + startAt)
    }
</script>

<style lang="sass">
    .bg
        position: fixed
        background: white
        width: 100%
        height: 100%

    .wrapper
        position: fixed
        display: flex
        justify-content: center
        align-items: center
        width: var(--size)
        height: var(--size)
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)

    .circle
        border-radius: 100%
        animation-fill-mode: both
        position: absolute
        opacity: 0
        width: var(--size)
        height: var(--size)
        background-color: var(--color)
        animation: bounce var(--duration) linear infinite

    @keyframes bounce
        0%
            opacity: 0
            transform: scale(0)
        5%
            opacity: 1
        100%
            opacity: 0
            transform: scale(1)
</style>

{#if show}
    <div class="bg" transition:fade="{{delay: 0, duration: 500}}">
        <div
            class="wrapper"
            style="--size: {size}{unit}; --color: {color}; --duration: {duration};">
            {#each range(3, 1) as version}
                <div
                    class="circle"
                    style="animation-delay: {(durationNum / 3) * (version - 1) + durationUnit};">
                </div>
            {/each}
        </div>
    </div>
{/if}
