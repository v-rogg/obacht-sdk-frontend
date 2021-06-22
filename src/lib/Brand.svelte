<style lang='sass'>
    @import '../style/theme.sass'

    .brand
        position: fixed
        top: 2rem
        right: 2rem
        display: flex
        flex-direction: column

    h1
        margin: 0 0 .5rem
        padding: 0

    .logo
        display: block
        height: 1.75rem
        padding: 0
        margin: 0

    h5
        font-size: $size-small
        font-weight: $regular
        padding: 0
        line-height: $size-small
        margin: 0
        align-self: flex-end

        .bold
            font-family: 'Obacht! Display', sans-serif
            font-weight: $semibold
            font-size: $size-normal
            margin-right: .5rem
            line-height: $size-small
</style>

<section class='brand'>
    <h1><img src='/static/obacht-logo.svg' alt='obacht! logo' class='logo'></h1>
    <h5><span class='bold'>Configurator</span>v0.9beta</h5>
</section>
