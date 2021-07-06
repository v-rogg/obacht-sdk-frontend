<script>
    import * as THREE from "three";
    import { onDestroy, onMount } from "svelte";
    import Stats from "stats.js";
    import { toolStore, layersStore, wsStore, messageStore } from "../../store";
    import { browser } from "$app/env";
    import { OrbitControls } from "$lib/Three/OrbitControls";
    import { DragControls } from "$lib/Three/DragControls";
    import { TransformControls } from "./TransformControls";
    import LoadJumper from "$lib/Primitives/LoadJumper.svelte";
    import { SVGLoader } from "$lib/THREE/SVGLoader.js";

    let points = [];
    let currentIntersect = null;
    let layersProxy = {};
    let toolStoreProxy = "";
    let unsubMessageStore;

    let ws;
    wsStore.subscribe(val => ws = val)

    let show = true;

    let compassRotation = 0;
    let camera;

    layersStore.subscribe(val => {
        layersProxy = val;
    });

    let mapSize = 1000;

    let dragging;

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

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

            const svgLoader = new SVGLoader();

            const objects = [];
            const scaleObjects = [];
            const draggableObjects = [];

            unsubMessageStore = messageStore.subscribe(message => {
                const splitMessage = message.split(";");
                if (splitMessage[0] === "move") {
                    let ind = objects.findIndex(obj => obj.name === splitMessage[1]);
                    objects[ind].position.set(parseFloat(splitMessage[2]), objects[ind].position.y, parseFloat(splitMessage[3]));
                } else if (splitMessage[0] === "rotate") {
                    let ind = objects.findIndex(obj => obj.name === splitMessage[1]);
                    // objects[ind].rotation.set(parseFloat(splitMessage[2]), parseFloat(splitMessage[3]), parseFloat(splitMessage[4]));
                    objects[ind].rotation.set(0, parseFloat(splitMessage[2]), 0);
                }
            });

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
            cube.name = "Cube";
            cube.position.set(0, .5, 2);
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
            camera = new THREE.OrthographicCamera(-5 * aspectRatio, 5 * aspectRatio, 5, -5, 0, 2000);
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
                if (currentIntersect && !dragging) {
                    console.log(`clicked on`, currentIntersect);
                }
            });

            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
            });
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            objects.push(cube);
            scaleObjects.push(cube);
            draggableObjects.push(cube);

            // geometry = new THREE.BoxGeometry(1, 1, 1);

            // for (let i = 0; i < 200; i++) {
            //
            //     const object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x4E5256 }));
            //
            //     object.position.x = Math.random() * 100 - 50;
            //     object.position.y = Math.random() * 30;
            //     object.position.z = Math.random() * 80 - 40;
            //
            //     object.rotation.x = Math.random() * 2 * Math.PI;
            //     object.rotation.y = Math.random() * 2 * Math.PI;
            //     object.rotation.z = Math.random() * 2 * Math.PI;
            //
            //     object.scale.x = Math.random() * 2 + 1;
            //     object.scale.y = Math.random() * 2 + 1;
            //     object.scale.z = Math.random() * 2 + 1;
            //
            //     object.castShadow = true;
            //     object.receiveShadow = true;
            //     object.name = `test${i}`
            //
            //     scene.add(object);
            //
            //     objects.push(object);
            // }


            let transformControls = new TransformControls(camera, renderer.domElement);
            transformControls.setMode("rotate");
            transformControls.showX = false;
            // transformControls.showY = false;
            transformControls.showZ = false;
            transformControls.showE = false;
            transformControls.addEventListener("mouseDown", (event) => {
                dragging = true;
                console.log(dragging, "rotating");
            })
            transformControls.addEventListener("mouseUp", (event) => {
                dragging = false;
                console.log(dragging, "rotating");
                console.log(transformControls.object.rotation.x, transformControls.object.rotation.y, transformControls.object.rotation.z);
                let y = transformControls.object.rotation.y;
                if ((transformControls.object.rotation.x < 0 || transformControls.object.rotation.z < 0) || (transformControls.object.rotation.x > Math.PI - 0.1 || transformControls.object.rotation.z > Math.PI - 0.1)) {
                    y = Math.PI/2 + (Math.PI/2 - transformControls.object.rotation.y);
                    if (y > Math.PI) {
                        y = - (Math.PI/2 + (Math.PI/2 + transformControls.object.rotation.y));
                    }
                    console.log(y);
                }
                // const message = "rotate;" + transformControls.object.name + ";" + (Math.trunc(transformControls.object.rotation.x * 1000 ) / 1000) + ";" + (Math.trunc(transformControls.object.rotation.y * 1000 ) / 1000) + ";" + (Math.trunc(transformControls.object.rotation.z * 1000 ) / 1000)
                const message = "rotate;" + transformControls.object.name + ";" + (Math.trunc(y * 1000 ) / 1000);
                ws.send(message);
            });
            transformControls.addEventListener("change", (event) => {
            })
            scene.add(transformControls);

            let dragControls;

            svgLoader.load(
                // resource URL
                'icons/three/sensorIcon.svg',
                // called when the resource is loaded
                function ( data ) {

                    const paths = data.paths;
                    const group = new THREE.Group();

                    for ( let i = 0; i < paths.length; i++ ) {

                        const path = paths[ i ];

                        const material = new THREE.MeshBasicMaterial( {
                            color: path.color,
                            side: THREE.DoubleSide,
                            depthWrite: false
                        } );

                        const shapes = SVGLoader.createShapes( path );

                        for ( let j = 0; j < shapes.length; j ++ ) {

                            const shape = shapes[ j ];
                            const geometry = new THREE.ShapeGeometry( shape );
                            const mesh = new THREE.Mesh( geometry, material );
                            mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI/2);
                            mesh.scale.set(0.01, 0.01, 0.01);

                            group.add( mesh );

                        }
                    }
                    group.name = "sensor";
                    group.position.set(0, 1, 0);
                    objects.push(group);
                    scaleObjects.push(group);
                    draggableObjects.push(group);
                    scene.add( group );
                    transformControls.attach(group);
                    dragControls.dispose();
                    dragControls = new DragControls([...draggableObjects], camera, renderer.domElement);
                    dragControls.enabled = toolStoreProxy !== "hand";
                    dragControls.addEventListener("dragstart", (event) => {
                        dragging = true;
                        console.log(dragging, "dragging");
                    })
                    dragControls.addEventListener("dragend", (event) => {
                        dragging = false;
                        console.log(event.object);
                        console.log(dragging, "dragging");
                        const message = "move;" + event.object.name + ";" + (Math.trunc(event.object.position.x * 1000 ) / 1000) + ";" + (Math.trunc(event.object.position.z * 1000 ) / 1000)
                        ws.send(message);
                    });
                },
                // called when loading is in progresses
                function ( xhr ) {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },
                // called when loading has errors
                function ( error ) {
                    console.log( 'An error happened', error);
                }
            );

            let controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.3;
            controls.rotateSpeed = 0.25;
            controls.screenSpacePanning = false;
            controls.minZoom = 0.5;
            controls.maxZoom = 2;
            controls.zoomSpeed = 2;
            // controls.minPolarAngle = 0;
            // controls.maxPolarAngle = 0;
            controls.minPan = new THREE.Vector3(-mapSize/2, -100, -mapSize/2);
            controls.maxPan = new THREE.Vector3(mapSize/2, 100, mapSize/2);
            controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
            controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
            controls.touches.ONE = THREE.TOUCH.PAN;
            controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
            controls.addEventListener("change", () => {
                compassRotation = THREE.MathUtils.radToDeg(controls.getAzimuthalAngle());
            });

            dragControls = new DragControls([...draggableObjects], camera, renderer.domElement);
            dragControls.addEventListener("dragstart", (event) => {
                dragging = true;
                console.log(dragging, "dragging");
            })
            dragControls.addEventListener("dragend", (event) => {
                dragging = false;
                console.log(event.object);
                console.log(dragging, "dragging");
                const message = "move;" + event.object.name + ";" + event.object.position.x + ";" + event.object.position.z
                ws.send(message);
            });

            toolStore.subscribe(val => {
                toolStoreProxy = val;
                controls.enableRotate = val === "hand";
                controls.enablePan = val === "hand";
                dragControls.enabled = val !== "hand";
            });

            // const clock = new THREE.Clock();

            let gridSmall = new THREE.GridHelper(mapSize, mapSize, 0xF4F5F7, 0xF4F5F7);
            scene.add(gridSmall);

            let gridBig = new THREE.GridHelper(mapSize, mapSize/10, 0xDFE1E4, 0xDFE1E4);
            scene.add(gridBig);

            const infinityPlaneGeometry = new THREE.PlaneGeometry(mapSize, mapSize);
            const infinityPlane = new THREE.Mesh(infinityPlaneGeometry, material);
            infinityPlane.visible = false;
            infinityPlane.rotateX(-Math.PI/2);
            infinityPlane.position.set(0, 0, 0);
            scene.add(infinityPlane);
            objects.push(infinityPlane);

            const raycaster = new THREE.Raycaster();

            function tick() {

                // stats.begin();

                // Cast a ray
                raycaster.setFromCamera(mouseScene, camera);

                let intersects = raycaster.intersectObjects([...objects]);
                // let intersects = raycaster.intersectObject(cube);


                if (intersects.length && !dragging) {
                    currentIntersect = intersects[0];

                    if (currentIntersect.Object) {
                        currentIntersect.Object.position.x = mouseScene.x;
                        currentIntersect.Object.position.y = mouseScene.y;
                    }
                } else {
                    currentIntersect = null;
                }

                const factor = (((camera.top - camera.bottom) / camera.zoom) / sizes.height) * 1000;

                scaleObjects.forEach(obj => {
                    obj.scale.set(1, 1, 1).multiplyScalar(factor/ 10);
                })

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

    onDestroy(() => {
        unsubMessageStore;
    })
</script>

<style lang="sass">
    #three
        position: fixed
        top: 0
        left: 0
        outline: none

    .compass
        position: fixed
        bottom: 2rem
        left: 2rem

        &:hover
            cursor: pointer
</style>

<canvas id="three"></canvas>
<div class="compass"><img src="/icons/compass.svg" style="transform: rotateZ({compassRotation}deg)" alt="compass"
    on:click={() => {camera.position.set(0, 0, 0); camera.azimuthAngle = 0}}
/></div>
<LoadJumper show={show}/>
