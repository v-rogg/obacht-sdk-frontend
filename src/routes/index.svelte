<script lang='ts'>
    import Three from '$lib/Three/index.svelte';
    import { tooltip } from '$lib/actions/tooltip';
    import { hotkey } from '../lib/actions/hotkeys';
    import { hotkeysStore } from '../store';

    let hotkeysProxy = "";

    hotkeysStore.subscribe(val => {
        hotkeysProxy = val;
    })

    function test() {
        console.log('Hotkey test worked!')
    }
</script>

<style lang='sass'>
    @import './src/style/theme'

    .compass
        position: fixed
        bottom: 2rem
        left: 2rem

    .header
        position: fixed
        top: 2rem
        left: 2rem

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


    nav
        position: fixed
        display: flex
        flex-direction: column
        gap: 2rem
        left: 2rem
        top: 50%
        transform: translateY(-50%)

        > div
            background: $white
            box-shadow: $shadow-md
            width: 4rem
            height: 4rem
            font-size: 1.25rem
            display: flex
            justify-content: center
            align-items: center
            border-radius: $border-radius
            border: .5px solid $light-grey
            //transition: 125ms ease

            /* slightly transparent fallback */
            background: rgba($white, .9)

            /* if backdrop support: very transparent and blurred */
            @supports ((-webkit-backdrop-filter: blur(4px)) or (backdrop-filter: blur(4px)))
                background: rgba($white, .2)
                backdrop-filter: blur(4px)

            &:hover:not(.open)
                cursor: pointer
                box-shadow: $shadow-algolia-black
                //border: .5px solid $black
                //color: $green

            &:active:not(.open)
                border: .5px solid $blue

        .open
            border: .5px solid $blue
            box-shadow: $shadow-algolia-black


</style>

<svelte:head>
	<title>Obacht! Configurator</title>
</svelte:head>


<Three/>

<div class='header'>
    <h1><img src='/static/obacht-logo.svg' alt='obacht! logo' class='logo'></h1>
    <h5><span class='bold'>Configurator</span>v0.9beta</h5>
</div>

<nav>
    <div>
        <i class="far fa-broadcast-tower event-none"></i>
    </div>
    <div
        class='open'
        title='Show Sensor Raw Data'
        hotkey={hotkeysProxy.layerRawData}
        use:hotkey
        use:tooltip
        on:click={test}
    >
        <i class="fak fa-sensor-points-regular event-none"></i>
    </div>
    <div
        title='Show Person Positions'
        hotkey={hotkeysProxy.layerPersons}
        use:hotkey
        use:tooltip
        on:click={test}
    >
        <i class="far fa-street-view event-none"></i>
    </div>
</nav>

<div class='compass'>
    <img src='/static/compass.png' alt='compass' title='Compass is linked to the rotation of the map' use:tooltip>
</div>
