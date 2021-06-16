import App from './App.svelte';

import wasm from './wasm/Cargo.toml';
import {wasmStore} from "./store";

// WebAssembly files must be loaded async.
const init = async () => {
    const mod = await wasm();
    wasmStore.set(mod);

    new App({
        target: document.body,
        props: {
        }
    });
};

init();
