<script lang="ts">
    import "../style/fonts.sass";
</script>

<style lang="sass" global>
    @import "../style/theme.sass"

    body
        margin: 0
        padding: 0
        font-family: 'Obacht! Plex Sans', sans-serif

    a
        font-family: 'Obacht! Mono', sans-serif
        color: $purple
</style>

<main>
	<slot/>
</main>


