<script lang="ts">
    import '../style/fonts.sass';
    import Sensors from '$lib/Sensors.svelte';
    import { hotkeysStore } from '../store';

    export let hotkeys;
    hotkeysStore.set(hotkeys);
</script>

<style lang="sass" global>
    @import "../style/theme.sass"

    body
        margin: 0
        padding: 0
        font-family: 'Obacht! Plex Sans', sans-serif
        overflow: hidden

    .a
        font-family: 'Obacht! Mono', sans-serif
        color: $purple
</style>

<main>
	<slot/>
    <Sensors/>

</main>


