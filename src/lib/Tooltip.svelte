<script lang='ts'>
    export let title;
    export let x;
    export let y;
    export let key;
</script>

<style lang='sass'>
    @import 'src/style/theme'

    div
        border: .5px solid $light-grey
        box-shadow: $shadow-lg, $shadow-2xl
        border-radius: $border-radius
        padding: .5rem .75rem
        position: absolute
        pointer-events: none
        font-size: .85rem
        overflow: hidden

        /* slightly transparent fallback */
        background: rgba($white, .9)

        /* if backdrop support: very transparent and blurred */
        @supports ((-webkit-backdrop-filter: blur(4px)) or (backdrop-filter: blur(4px)))
            background: rgba($white, .5)
            backdrop-filter: blur(4px)

    .margin-right
        margin-right: .25rem

    .hotkey
        padding: 1rem
        background: $light-grey
</style>


<div style="
        top: {(y/16) + .5}rem;
        left: {(x/16) + .25}rem;
    "><i class="far fa-info-circle margin-right"></i>
    {#if key}
        <span class='hotkey margin-right'>
            {key.toUpperCase()}
        </span>
    {/if}

    {title}
</div>
