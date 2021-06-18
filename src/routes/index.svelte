<script lang='ts'>
    import Three from '$lib/Three/index.svelte';
    import HzDisplay from '$lib/HzDisplay.svelte';
    import PingDisplay from '$lib/PingDisplay.svelte';
    import { tooltip } from '$lib/actions/tooltip';

</script>

<style lang='sass'>
    @import './src/style/theme'

    .box
        box-shadow: $shadow-md
        width: max-content
        padding: 1rem
        border-radius: $border-radius
        position: fixed
        top: 8rem
        left: 2rem
        border: .5px solid $light-grey
        display: grid
        gap: .8rem
        background: $white

        /* slightly transparent fallback */
        background: rgba($white, .9)

        /* if backdrop support: very transparent and blurred */
        @supports ((-webkit-backdrop-filter: blur(4px)) or (backdrop-filter: blur(4px)))
            background: transparentize($white, .8)
            backdrop-filter: blur(4px)

        .margin-right
            margin-right: .25rem

        .sensor
            display: flex
            align-items: center
            cursor: default

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

    .mono
        font-family: "Obacht! Mono", sans-serif
        margin: 0 .5rem

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
            transition: 125ms ease

            &:hover:not(.open)
                cursor: pointer
                box-shadow: $shadow-algolia-black
                border: .5px solid $black
                //color: $green

        .open
            border: .5px solid $black
            box-shadow: $shadow-algolia-black


	h1
        font-family: "Obacht! Display", sans-serif
        margin: 0 0 .25rem
        padding: 0

</style>

<svelte:head>
	<title>Obacht! SDK Configurator</title>
</svelte:head>

<Three/>

<div class='header'>
    <h1>SDK Configurator</h1>
    <div>Your IP <span class='mono'>-></span> 192.168.178.48</div>
</div>

<div class='box'>
    <div><i class="fas fa-sensor-on margin-right"></i>   Connected Sensors</div>
    <div class='sensor'><span title='Sensor IP' use:tooltip>192.168.178.110</span>   <span class='mono'>-></span>   <span title='Sensor Model' use:tooltip>RPLidar S1</span>   <span class='mono'>-></span><HzDisplay/> <PingDisplay/></div>
</div>

<nav>
    <div>
<!--        <i class="fas fa-sensor-on"></i>-->
        <i class="fas fa-broadcast-tower"></i>
    </div>
    <div class='open'>
        <i class="fas fa-chart-network"></i>
    </div>
    <div>
        <i class="fas fa-street-view"></i>
    </div>
</nav>

<div class='compass'>
    <img src='/static/compass.png' alt='compass' title='Compass is linked to the rotation of the map' use:tooltip>
</div>

<div class='logo'>
    <img src='/static/obacht-logo.svg' alt='obacht! logo'>
</div>


