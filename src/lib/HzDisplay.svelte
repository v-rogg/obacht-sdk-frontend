<script lang="ts">
    import { socketStore } from '../store';
    import { tooltip } from '$lib/actions/tooltip';

    let hz: string = '0';
    let oldDate: number;
    let msDiffs: number[30] = [];

    function round(value, precision) {
        const multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    socketStore.subscribe(value => {
        if (value[0] === '@') {
            const time = value.split(';')[1];
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
            hz = round(1000 / avg, 1).toFixed(1);
        }
    })
</script>

<style lang='sass'>
    @import 'src/style/theme'

    .hzDisplay
        display: inline-flex
        width: 82px
        text-align: right
        justify-content: end

        >*
            pointer-events: none

    #description
        width: 20px
        margin: 0 0 0 .5rem
        text-align: left

    #number
        width: 40px

    #color
        display: block
        width: .8rem
        height: .8rem
        background: linear-gradient(mix(rgba(white, .42), $green), $green)
        border-radius: 50%
        align-self: center
</style>

<div class='hzDisplay' title='Average Sensor Rotations Per Second based on 30 Samples' use:tooltip>
    <span id='color'></span><span id='number'>{hz}</span> <span id='description'>Hz</span>
</div>
