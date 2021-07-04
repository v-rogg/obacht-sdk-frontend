<script>
    import * as THREE from "three";
    import { onMount } from "svelte";
    import Stats from "stats.js";
    import { toolStore, layersStore } from "../../store";
    import { browser } from "$app/env";
    import { OrbitControls } from "$lib/Three/OrbitControls";
    import { DragControls } from "$lib/Three/DragControls";
    import { TransformControls } from "./TransformControls";
    import LoadJumper from "$lib/UI/LoadJumper.svelte";

    let points = [];
    let currentIntersect = null;
    let layersProxy = {};

    let show = true;

    layersStore.subscribe(val => {
        layersProxy = val;
    });

    if (browser) {
        onMount(async () => {

            // let stats = new Stats();
            // stats.showPanel(1);
            // document.body.appendChild(stats.dom);

            // socketStore.subscribe(message => {
            //     const splitMessage = message.split(";");
            //     if (splitMessage[1][0] !== "@") {
            //         points = [];
            //         const measure = message.split("!");
            //         // stats.begin();
            //         measure.forEach(m => {
            //             const [angle, distance] = m.split(";");
            //
            //             // const loc = wasm.loc(parseFloat(angle), parseFloat(distance));
            //             // console.log(wasm.loc(parseFloat(angle), parseFloat(distance))[0]);
            //             let x = Math.sin((angle * Math.PI / 180)) * distance;
            //             let y = Math.cos((angle * Math.PI / 180)) * distance;
            //             // points.push({x: loc[0], y: loc[1]});
            //             points.push({x: x, y: y});
            //         })
            //     }
            // })

            const canvas = document.querySelector(`canvas#three`);

            let sizes = {
                width: window.innerWidth,
                height: window.innerHeight,
            };

            const scene = new THREE.Scene();
            // scene.background = new THREE.Color("white");

            let geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            const tmaterial = new THREE.PointsMaterial({
                color: 0x18A0FB,
                size: 3,
                opacity: 1,
            });
            const tgeometry = new THREE.BufferGeometry();
            const pointCloud = new THREE.Points(tgeometry, tmaterial);
            scene.add(pointCloud);

            const aspectRatio = sizes.width / sizes.height;
            const camera = new THREE.OrthographicCamera(-5 * aspectRatio, 5 * aspectRatio, 5, -5, 0.1, 10000);
            camera.position.y = 100;

            window.addEventListener("resize", () => {
                sizes = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                };

                camera.left = -5 * (sizes.width / sizes.height);
                camera.right = 5 * (sizes.width / sizes.height);
                camera.updateProjectionMatrix();

                renderer.setSize(sizes.width, sizes.height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

                renderer.render(scene, camera);
            });


            const mouseScene = new THREE.Vector2();
            const mouseWindow = new THREE.Vector2();
            window.addEventListener("mousemove", (event) => {
                mouseScene.x = event.clientX / sizes.width * 2 - 1;
                mouseScene.y = -(event.clientY / sizes.height) * 2 + 1;
                mouseWindow.x = event.clientX;
                mouseWindow.y = event.clientY;
            });

            canvas.addEventListener("click", () => {
                if (currentIntersect) {
                    console.log(`clicked on`, currentIntersect);
                }
            });

            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
            });
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const objects = [];

            objects.push(cube);

            geometry = new THREE.BoxGeometry(1, 1, 1);

            for (let i = 0; i < 200; i++) {

                const object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x4E5256 }));

                object.position.x = Math.random() * 100 - 50;
                object.position.y = Math.random() * 30;
                object.position.z = Math.random() * 80 - 40;

                object.rotation.x = Math.random() * 2 * Math.PI;
                object.rotation.y = Math.random() * 2 * Math.PI;
                object.rotation.z = Math.random() * 2 * Math.PI;

                object.scale.x = Math.random() * 2 + 1;
                object.scale.y = Math.random() * 2 + 1;
                object.scale.z = Math.random() * 2 + 1;

                object.castShadow = true;
                object.receiveShadow = true;

                scene.add(object);

                objects.push(object);
            }

            let controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.minZoom = 0.25;
            controls.maxZoom = 2;
            controls.zoomSpeed = 2;
            controls.minPolarAngle = 0;
            controls.maxPolarAngle = 0;
            controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
            controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
            controls.touches.ONE = THREE.TOUCH.PAN;
            controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;

            let dragControls = new DragControls([...objects], camera, renderer.domElement);
            // dragControls.addEventListener("drag", render);

            let transformControls = new TransformControls(camera, renderer.domElement);
            transformControls.setMode("rotate");
            transformControls.attach(cube);
            transformControls.showX = false;
            transformControls.showY = false;
            transformControls.showZ = false;
            scene.add(transformControls);

            toolStore.subscribe(val => {
                controls.enableRotate = val === "hand";
                controls.enablePan = val === "hand";
                dragControls.enabled = val !== "hand";
            });

            // const clock = new THREE.Clock();

            let gridSmall = new THREE.GridHelper(1000, 1000, 0xF4F5F7, 0xF4F5F7);
            scene.add(gridSmall);

            let gridBig = new THREE.GridHelper(1000, 100, 0xDFE1E4, 0xDFE1E4);
            scene.add(gridBig);

            const raycaster = new THREE.Raycaster();

            function tick() {

                // stats.begin();

                // Cast a ray
                raycaster.setFromCamera(mouseScene, camera);

                let intersects = raycaster.intersectObjects([...objects]);
                // let intersects = raycaster.intersectObject(cube);


                if (intersects.length) {
                    currentIntersect = intersects[0];

                    if (currentIntersect.Object) {
                        currentIntersect.Object.position.x = mouseScene.x;
                        currentIntersect.Object.position.y = mouseScene.y;
                    }
                } else {
                    currentIntersect = null;
                }

                const factor = (camera.top - camera.bottom) / camera.zoom;
                cube.scale.set(1, 1, 1).multiplyScalar(factor / 10);

                if (layersProxy.includes("layerGrid")) {
                    // if (camera.zoom <= .5) {
                    //     gridBig.visible = true;
                    //     gridSmall.visible = false;
                    // } else {
                    //     gridBig.visible = false;
                    //     gridSmall.visible = true;
                    // }
                    gridBig.visible = true;
                    gridSmall.visible = true;
                } else {
                    gridBig.visible = false;
                    gridSmall.visible = false;
                }

                let positions = [];
                for (let point of points) {
                    positions.push(
                        point.x / 1000,
                        0,
                        point.y / 1000,
                    );
                }
                tgeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

                controls.update();
                // controls.update(clock.getDelta());
                render();

                // stats.end();
                window.requestAnimationFrame(tick);
            }

            render();
            tick();

            show = false;

            function render() {
                renderer.render(scene, camera);
            }
        });
    }
</script>

<style lang="sass">
    #three
        position: fixed
        top: 0
        left: 0
        outline: none
</style>

<canvas id="three"></canvas>
<LoadJumper show={show}/>
