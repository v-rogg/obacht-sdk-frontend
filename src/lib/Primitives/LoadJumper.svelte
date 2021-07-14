<script lang="ts">
    import { fade } from 'svelte/transition';

    type SpinnerTypes = {
        size: string | number
        color: string
        unit: string
        duration: string
    }

    export let color: SpinnerTypes["color"] = "#FF0000";
    export let show;
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
        font-size: 1.5rem
        color: #ff0000
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)

        *
            position: absolute

    .semihidden
        opacity: .33
</style>

{#if show}
    <div class="bg" transition:fade="{{delay: 0, duration: 500}}">
        <div class="wrapper" style="color: {color}">
            <i class="fal fa-spinner-third fa-spin"></i>
            <i class="fal fa-circle semihidden"></i>
        </div>
    </div>
{/if}
