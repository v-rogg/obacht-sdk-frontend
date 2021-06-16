import App from './App.svelte';

import wasm from './wasm/Cargo.toml';
import {wasmStore} from "./store";

// WebAssembly files must be loaded async.
const init = async () => {
    const mod = await wasm();

    new App({
        target: document.body,
        props: {
            // https://svelte.dev/docs#Creating_a_component
            greetings: mod.greetings
        }
    });

    wasmStore.set(mod);
};

init();
