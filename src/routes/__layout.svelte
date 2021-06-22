<script context="module" lang="ts">
    export async function load({fetch}) {
        const url = `/hotkeys.json`;
        const res = await fetch(url);

        if (res.ok) {
            return {
                props: {
                    hotkeys: await res.json()
                }
            };
        }

        return {
            status: res.status,
            error: new Error(`Could not load ${url}`)
        };
    }
</script>

<script lang="ts">
    import '../style/fonts.sass';
    import Sensors from '$lib/Sensors.svelte';
    import { hotkeysStore } from '../store';
    import Layers from '$lib/Layers.svelte';

    export let hotkeys = "";
    hotkeysStore.set(hotkeys);
</script>

<style lang="sass" global>
    @import "../style/theme.sass"

    body
        margin: 0
        padding: 0
        font-family: 'Obacht! Plex Sans', sans-serif
        overflow: hidden
        background: $white

    .a
        font-family: 'Obacht! Mono', sans-serif
        color: $purple

    .event-none
        pointer-events: none
</style>

<main>

	<slot/>
    <Sensors/>
    <Layers/>

</main>


