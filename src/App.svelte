<script lang="ts">
    import Child from './lib/Child.svelte';
    import { readSocketStore, socketStore } from './store';

    let foo;
    socketStore.subscribe(value => foo = value);
    foo.onmessage = (e) => console.log(e.data);


    let message: string = " ";
    readSocketStore.subscribe(value => message = value)
</script>

<svelte:head>
    <title>Obacht! SDK Configurator</title>
</svelte:head>

<main>
    {#if message}
        <p>{message}</p>
    {:else}
        <p>
            <br/>
        </p>
    {/if}

	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

    <Child/>
</main>
