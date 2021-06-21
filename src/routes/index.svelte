<script lang='ts'>
    import Three from '$lib/Three/index.svelte';
A    import { tooltip } from '$lib/actions/tooltip';
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

    .logo
        position: fixed
        bottom: 2.5rem
        right: 2rem
        width: 120px

    .header
        position: fixed
        top: 2rem
        left: 2rem

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

    h5
        font-size: $size-small
        font-weight: 400
        margin: 0
        padding: 0

	h1
        font-family: "Obacht! Display", sans-serif
        margin: 0 0 .25rem
        padding: 0
        font-size: 2rem

</style>

<svelte:head>
	<title>Obacht! SDK Configurator</title>
</svelte:head>


<Three/>

<div class='header'>
    <h1>SDK Configurator</h1>
    <h5>v 0.9beta</h5>
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
        <i class="far fa-chart-network event-none"></i>
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

<div class='logo'>
    <img src='/static/obacht-logo.svg' alt='obacht! logo'>
</div>


