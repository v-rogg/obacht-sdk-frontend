<script lang="ts">
    import { socketStore } from '../store';

    let hz: string = '0';
    let oldDate: number;

    function round(value, precision) {
        const multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    socketStore.subscribe(value => {
        if (value[0] === '@') {
            const time = value.split(';')[1];
            const date = Date.parse(time);
            const msDiff = (date - oldDate);
            hz = round(1000 / msDiff, 1).toFixed(1);
            oldDate = date;
            // console.log(type, time, date, msDiff);
        }
    })
</script>

<span class='hzDisplay'>
    {hz} Hz
</span>
