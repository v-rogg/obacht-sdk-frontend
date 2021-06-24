<style lang="sass">
    @import "./src/style/theme"

    .popup
        position: absolute
        background: $normal-grey
        padding: 1rem
        border-radius: $border-radius
        bottom: calc(100% + 1.5rem)
        left: 50%
        transform: translateX(-50%)
        width: max-content

        .inner
            z-index: 1080
            position: relative

        .arrow
            position: absolute
            width: 1.5rem
            height: 1.5rem
            background: $normal-grey
            bottom: -.75rem
            left: 50%
            border-radius: 0 0 $border-radius 0
            transform: translateX(-50%) rotateZ(45deg)
</style>

<div class="popup">
    <div class="arrow"></div>
    <div class="inner">
        <slot/>
    </div>
</div>
