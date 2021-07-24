<script lang="ts">
    import { messageStore } from "$lib/../store";
    import { fly } from "svelte/transition";
    import { onDestroy } from "svelte";


    let persons: number;
    let personsOld: number;
    let personsBuffer: number[100] = [];

    function round(value, precision) {
        const multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    let animate = false
    let bigger = false;
    function startAnimation(size) {
        if (!animate) {
            animate = true;
            bigger = size;
            setTimeout(() => {animate = false}, 200);
        }
    }

    const unsubMessageStore = messageStore.subscribe(message => {
            const splitMessage = message.split(";");
            const msgAddress = splitMessage[0];

            if (msgAddress == "system") {
                if (splitMessage[1] === "persons") {

                    personsOld = persons;

                    const personPositionsMessages = splitMessage[2].split("!");
                    const p = personPositionsMessages.length - 1;

                    if (personsBuffer.length >= 100) {
                        personsBuffer.shift();
                    }
                    if (!isNaN(p)) {
                        personsBuffer.push(p);
                    }

                    let total = 0;
                    personsBuffer.forEach(n => {
                        total += n
                    });
                    const avg = total / personsBuffer.length;
                    persons = round(avg, 0);

                    if (personsOld !== persons) {
                        startAnimation(persons > personsOld);
                    }

                    if (isNaN(persons)) persons = 0;
                }
            }
    });

    onDestroy(() => {
        unsubMessageStore();
    })
</script>

<style lang="sass">
    @import "src/style/theme"

    section
        display: flex
        width: 100%
        height: 100%
        justify-content: center
        align-items: center
        flex-direction: column

    span
        display: block
        height: 10rem

    h1
        font-size: 10rem
        margin: 0
        padding: 0
        height: 10rem
        font-family: "Obacht Display", sans-serif

    h2
        font-size: 3rem
        margin: 0
        padding: 0
        font-family: "Obacht! Plex Sans", sans-serif
        font-weight: $light

</style>

<section>
    <span>
        {#if !animate}
            <h1 in:fly={{duration: 200, y: bigger ? -100 : 100 }} out:fly={{duration: 200, y: bigger ? 100 : -100}}>
                {persons}
            </h1>
        {/if}
    </span>
    <h2>{persons !== 1 ? "Personen" : "Person"} {persons !== 1 ? "sind" : "ist"} auf der Werkschau!</h2>
</section>
