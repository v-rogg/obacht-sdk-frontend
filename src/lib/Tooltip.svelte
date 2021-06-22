<script lang='ts'>
    export let title;
    export let x;
    export let y;
    export let key;
</script>

<style lang='sass'>
    @import 'src/style/theme'

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

    .hotkey
        display: inline-flex
        justify-content: center
        align-items: center
        padding: 0 .5rem
        font-size: .6875rem
        //background: $light-grey
        position: relative
        transform: translateY(-2px)

        &:after
            content: ''
            position: absolute
            width: 1.375rem
            height: 1.375rem
            border-radius: $border-radius
            border: .75px solid $black
            top: -4px

        &:before
            content: ''
            position: absolute
            width: 1rem
            height: 1rem
            border-radius: $border-radius
            border: .75px solid $black
            //top: -3px
</style>


<div style="
        top: {(y/16) + .5}rem;
        left: {(x/16) + .25}rem;
    "><i class="far fa-info-circle margin-right"></i>
    <span class='margin-right'>
    {title}
    </span>
    {#if key}
        <span class='hotkey'>
            {key.toUpperCase()}
        </span>
    {/if}
</div>
