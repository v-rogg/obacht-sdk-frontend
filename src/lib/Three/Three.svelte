<script lang="ts">
    import * as THREE from "three";
    import CameraControls from "camera-controls";
    import { onMount } from "svelte";
    import Stats from "stats.js";
    import { socketStore } from "../../store";
    CameraControls.install( {THREE: THREE } );

    let points = [];

    onMount(async () => {

        let stats = new Stats();
        stats.showPanel(1);
        // document.body.appendChild(stats.dom);

        socketStore.subscribe(message => {
            const splitMessage = message.split(";");
            if (splitMessage[1][0] !== "@") {
                points = [];
                const measure = message.split("!");
                // stats.begin();
                measure.forEach(m => {
                    const [angle, distance] = m.split(";");

                    // const loc = wasm.loc(parseFloat(angle), parseFloat(distance));
                    // console.log(wasm.loc(parseFloat(angle), parseFloat(distance))[0]);
                    let x = Math.sin((angle * Math.PI / 180)) * distance;
                    let y = Math.cos((angle * Math.PI / 180)) * distance;
                    // points.push({x: loc[0], y: loc[1]});
                    points.push({x: x, y: y});
                })
            }
        })

        const canvas: HTMLCanvasElement = document.querySelector(`canvas#three`);

        let sizes = {
           width: window.innerWidth,
           height: window.innerHeight,
        };

        const scene: THREE.Scene = new THREE.Scene();
        // scene.background = new THREE.Color("white");

        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        // const cube = new THREE.Mesh( geometry, material );
        // scene.add( cube );

        const tmaterial = new THREE.PointsMaterial({
            color: 0x18A0FB,
            size: 3,
            opacity: 1
        });
        const tgeometry = new THREE.BufferGeometry();
        const pointCloud = new THREE.Points(tgeometry, tmaterial);
        scene.add(pointCloud);

        const aspectRatio = sizes.width / sizes.height;
        const camera = new THREE.OrthographicCamera(-5 * aspectRatio, 5 * aspectRatio, 5, -5, 0.1, 100);
        camera.position.y = 10;

        window.addEventListener("resize", () => {
            sizes = {
                width: window.innerWidth,
                height: window.innerHeight
            };

            camera.left = -5 * (sizes.width / sizes.height);
            camera.right = 5 * (sizes.width / sizes.height);
            camera.updateProjectionMatrix();

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            renderer.render(scene, camera);
        });

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


        const controls = new CameraControls( camera, <HTMLElement>renderer.domElement);
        controls.azimuthAngle = 0;
        controls.maxAzimuthAngle = 0;
        controls.minAzimuthAngle = 0;
        controls.polarAngle = Math.PI;
        controls.maxPolarAngle = Math.PI;
        controls.minPolarAngle = Math.PI;

        const clock = new THREE.Clock();

        function tick() {

            // stats.begin();

            let positions = [];
            for (let point of points) {
                positions.push(
                        point.x / 1000,
                        0,
                        point.y / 1000,
                )
            }
            tgeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))

            controls.update(clock.getDelta());
            renderer.render(scene, camera);

            // stats.end();
            window.requestAnimationFrame(tick);
        }

        renderer.render(scene, camera);
        tick();
    });
</script>

<style lang="sass">
    #three
        position: fixed
        top: 0
        left: 0
        outline: none
        //z-index: 0
</style>

<canvas id="three"></canvas>
