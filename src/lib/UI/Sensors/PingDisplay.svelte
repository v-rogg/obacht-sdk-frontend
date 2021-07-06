<script lang="ts">
    import { messageStore } from "$lib/../store";
    import { tooltip } from "$lib/actions/tooltip";
    import { onDestroy } from "svelte";

    export let address: string;

    let ms: string = "---";

    const unsubMessageStore = messageStore.subscribe(message => {
        const splitMessage = message.split(";");
        const msgAddress = splitMessage[0];

        if (msgAddress == address) {
            if (splitMessage[1] === "scan") {
                const time = splitMessage[2];
                const date = new Date(time);
                const now = new Date();
                // const offset = -700;
                ms = (now - date).toFixed(0);
                // ms = round(msDiff, 1).toFixed(1);
                // console.log(now, date);

                // console.log("now", now.getMilliseconds(), "sensor", date.getMilliseconds());
            }
        }
    });

    onDestroy(() => {
        unsubMessageStore();
    })
</script>

<style lang="sass">
    .pingDisplay
        display: inline-flex
        width: 70px
        text-align: right
        justify-content: flex-end

        >*
            pointer-events: none

    #description
        width: 20px
        margin: 0 0 0 .25rem
        text-align: left
</style>

<span class="pingDisplay" title="Time Offset between Sensor and Browser + Ping" use:tooltip>
    <span id="number">{ms}</span> <span id="description">ms</span>
</span>
