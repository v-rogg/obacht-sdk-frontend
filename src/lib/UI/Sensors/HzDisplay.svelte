<script lang="ts">
    import { socketStore } from "$lib/../store";
    import { tooltip } from "$lib/actions/tooltip";

    export let model: number;

    let hz: string = "--.-";
    let oldDate: number;
    let msDiffs: number[30] = [];

    let cls = "";

    function round(value, precision) {
        const multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    socketStore.subscribe(value => {
        if (value[0] === "@") {
            const time = value.split(";")[1];
            const date = Date.parse(time);
            const msDiff = (date - oldDate);
            oldDate = date;
            if (msDiffs.length == 30) {
                msDiffs.shift();
            }
            if (!isNaN(msDiff)) {
                msDiffs.push(msDiff);
            }
            let total = 0;
            msDiffs.forEach(v => {
                total += v;
            })
            const avg = total / msDiffs.length;
            const hzNumber = round(1000 / avg, 1);
            hz = hzNumber.toFixed(1);


            // TODO: Config file
            let a = 0;

            switch (model) {
                case 97:
                    a = 10
                    break;
                case 24:
                    a = 7.7
                    break;
            }

            if (hzNumber >= a-.2 && hzNumber <= a+.2) {
                cls = ""
            } else if ((hzNumber > a-.5 && hzNumber < a) || (hzNumber < a+.5 && hzNumber > a) ) {
                cls = "yellow"
            } else {
                cls = "red"
            }
        }
    })
</script>

<style lang="sass">
    @import "src/style/theme"

    .hzDisplay
        display: inline-flex
        width: 85px
        text-align: right
        justify-content: flex-end

        >*
            pointer-events: none

    #description
        width: 20px
        margin: 0 0 0 .25rem
        text-align: left

    #number
        width: 40px

    .red
        color: $red

    .yellow
        color: $yellow

    .green
        color: $green

    .hidden
        display: none
</style>

<div class="{cls} hzDisplay" title="Average Sensor Rotations Per Second based on 30 Samples" use:tooltip>
    <span class:hidden={cls === ""}><i class="fas fa-triangle-exclamation"></i></span><span id="number">{hz}</span> <span id="description">Hz</span>
</div>
