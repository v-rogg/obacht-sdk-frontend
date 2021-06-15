<script lang='ts'>
    import * as THREE from 'three';
    import CameraControls from 'camera-controls';
    import { onDestroy, onMount } from 'svelte';
    import Stats from 'stats.js';
    CameraControls.install( {THREE: THREE } );


    // export let scans;

    let socket: WebSocket;

    let points = [];

    // for (let scan of scans.data) {
    //     let x = Math.sin((scan.angle * Math.PI / 180)) * scan.distance;
    //     let y = Math.cos((scan.angle * Math.PI / 180)) * scan.distance;
    //     points.push({time: scan.time, x, y});
    // }

    onMount(async () => {

        let stats = new Stats();
        document.body.appendChild(stats.dom);

        socket = new WebSocket('ws://192.168.178.48:3000/ws');

        socket.onopen = () => {
            console.log("socket opened")
        }

        socket.onmessage = (event) => {
            if (event.data[0] === '@') {
                // console.log(event.data);
                points = [];
            } else {
                const [angle, distance] = event.data.split(':');
                let x = Math.sin((angle * Math.PI / 180)) * distance;
                let y = Math.cos((angle * Math.PI / 180)) * distance;
                points.push({x, y});
            }
        }

        socket.onclose = () => {
            console.log("socket closed")
        }




        const canvas: HTMLCanvasElement = document.querySelector(`canvas#three`);

        let sizes = {
           width: window.innerWidth,
           height: window.innerHeight,
        };

        const scene: THREE.Scene = new THREE.Scene();
        // scene.background = new THREE.Color('white');

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

        window.addEventListener('resize', () => {
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

            stats.begin();

            let positions = [];
            for (let point of points) {
                positions.push(
                        point.x / 1000,
                        0,
                        point.y / 1000,
                )
            }
            tgeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

            controls.update(clock.getDelta());
            renderer.render(scene, camera);

            stats.end();
            window.requestAnimationFrame(tick);
        }

        renderer.render(scene, camera);
        tick();
    });

    onDestroy(() => {
        socket != undefined ? socket : null
    });
</script>

<style lang="sass">
    #three
        position: fixed
        top: 0
        left: 0
        outline: none
        //z-index: 1030
</style>

<canvas id="three"></canvas>
