<script lang='ts'>
    import Three from '$lib/Three/index.svelte';
    import { tooltip } from '$lib/actions/tooltip';
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

</style>

<svelte:head>
	<title>Obacht! Configurator</title>
</svelte:head>


<Three/>

<div class='header'>
    <h1><img src='/static/obacht-logo.svg' alt='obacht! logo' class='logo'></h1>
    <h5><span class='bold'>Configurator</span>v0.9beta</h5>
</div>

<div class='compass'>
    <img src='/static/compass.png' alt='compass' title='Compass is linked to the rotation of the map' use:tooltip>
</div>
