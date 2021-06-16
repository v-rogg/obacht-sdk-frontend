<script lang="ts">
    import { wasmStore } from '../store';
    import type { wasmInterface } from '../types';

    let wasm: wasmInterface;

    wasmStore.subscribe(value => {
        wasm = value;
    })
</script>

<style>
    #child {
        position: relative;
        z-index: 10;
    }
</style>

<section id='child'>
    <button on:click="{() => {wasm.greetings('Tom')}}">Greetings</button>
    <button on:click="{() => {console.log(wasm.add(2, 8))}}">Add 2+8</button>
    <button on:click="{() => {wasm.loc(220.03, 102)}}">Loc</button>
</section>
