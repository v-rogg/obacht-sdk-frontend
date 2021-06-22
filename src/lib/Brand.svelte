<style lang='sass'>
    @import "../style/theme.sass"

    .brand
        position: fixed
        top: 2rem
        right: 2rem

    h1
        margin: 0 0 .5rem
        padding: 0

    .logo
        //position: fixed
        //bottom: 2.5rem
        //right: 2rem
        //width: 120px
        display: block
        height: 1.75rem
        padding: 0
        margin: 0

    h5
        font-size: $size-small
        font-weight: $regular
        margin: 0
        padding: 0
        //display: flex
        //align-items: center
        line-height: $size-small

        .bold
            font-family: "Obacht! Display", sans-serif
            font-weight: $semibold
            font-size: $size-normal
            margin-right: .5rem
            line-height: $size-small
</style>

<section class='brand'>
    <h1><img src='/static/obacht-logo.svg' alt='obacht! logo' class='logo'></h1>
    <h5><span class='bold'>Configurator</span>v0.9beta</h5>
</section>
