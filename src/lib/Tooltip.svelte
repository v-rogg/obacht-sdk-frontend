<script>
    export let title;
    export let x;
    export let y;
</script>

<div style="
        top: {y + 5}px;
        left: {x + 5}px;
    "><i class="far fa-info-circle margin-right"></i> {title}</div>

<style lang='sass'>
    @import 'src/style/theme'

    div
        border: .5px solid $light-grey
        box-shadow: $shadow-lg, $shadow-2xl
        border-radius: $border-radius
        padding: .5rem
        position: absolute
        pointer-events: none
        font-size: .85rem
        overflow: hidden

        /* slightly transparent fallback */
        background: rgba($white, .9)

        /* if backdrop support: very transparent and blurred */
        @supports ((-webkit-backdrop-filter: blur(4px)) or (backdrop-filter: blur(4px)))
            background: transparentize($white, .5)
            backdrop-filter: blur(4px)

        .margin-right
            margin-right: .25rem
</style>
