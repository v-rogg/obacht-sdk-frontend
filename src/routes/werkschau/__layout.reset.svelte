<script context="module" lang="ts">
    export async function load({fetch}) {
        const url = "/hotkeys.json";
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
    import "../../style/fonts.sass";
    import Sensors from "$lib/UI/SEnsors/Sensors.svelte";
    import Layers from "$lib/UI/Layers.svelte";
    import Tools from "$lib/UI/Tools.svelte";
    import Brand from "$lib/Brand.svelte";
    import Output from "$lib/UI/Output.svelte";
    import Settings from "$lib/UI/Settings.svelte";
    import { hotkeysStore } from "$lib/../store";

    export let hotkeys = "";
    hotkeysStore.set(hotkeys);
</script>

<style lang="sass" global>
    @import "../../style/theme.sass"

    html, main
        width: 100%
        height: 100%

    body
        width: 100%
        height: 100%
        margin: 0
        padding: 0
        font-family: "Obacht! Plex Sans", sans-serif
        overflow: hidden
        background: $white

    .a
        font-family: "Obacht! Mono", sans-serif
        color: $purple

    .event-none
        pointer-events: none

    .hidden
        display: none
</style>

<main>
    <slot/>

    <Settings/>
    <Brand/>

</main>


