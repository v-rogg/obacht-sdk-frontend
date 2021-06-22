<script lang="ts">
    export let title;
    export let x;
    export let y;
    export let key;

    let innerWidth = 0;

    $: right = (x < innerWidth/2);
</script>

<style lang="sass">
    @import "src/style/theme"

    div
        background: $normal-grey
        border-radius: $border-radius
        padding: .5rem .75rem
        position: absolute
        pointer-events: none
        font-size: .85rem
        overflow: hidden

    .margin-right
        margin-right: .5rem
    .margin-left
        margin-left: .5rem

    .hotkey
        display: inline-flex
        justify-content: center
        align-items: center
        padding: 0 .5rem
        font-size: .6875rem
        position: relative
        transform: translateY(-2px)

        &:before
            content: ""
            position: absolute
            width: 1.375rem
            height: 1.375rem
            border-radius: $border-radius
            border: .75px solid $black
            top: -4px

        &:after
            content: ""
            position: absolute
            width: 1rem
            height: 1rem
            border-radius: $border-radius
            border: .75px solid $black
</style>

<svelte:window bind:innerWidth={innerWidth}/>

{#if right}
    <div style="
            top: {(y/16) + .5}rem;
            left: {(x/16) + .25}rem;
        ">
        <i class="far fa-info-circle margin-right"></i>
        <span class="margin-right">
            {title}
        </span>
        {#if key}
            <span class="hotkey">
                {key.toUpperCase()}
            </span>
        {/if}
    </div>
{:else}
    <div style="
            top: {(y/16) + .5}rem;
            right: {(innerWidth/16) - (x/16) - .25}rem;
        ">
        {#if key}
            <span class="hotkey">
                {key.toUpperCase()}
            </span>
        {/if}
        <span class="margin-left">
            {title}
        </span>
        <i class="far fa-info-circle margin-left"></i>
    </div>
{/if}
