<script>
    import * as THREE from "three";
    import { onDestroy, onMount } from "svelte";
    import { toolStore, layersStore, wsStore, messageStore, sensorStore } from "$lib/../store";
    import { browser } from "$app/env";
    import { OrbitControls } from "$lib/Three/OrbitControls";
    import { DragControls } from "$lib/Three/DragControls";
    import { TransformControls } from "$lib/THREE/TransformControls";
    import LoadJumper from "$lib/Primitives/LoadJumper.svelte";
    import { SVGLoader } from "$lib/THREE/SVGLoader.js";


    // Helper
    let sizes = { width: 0, height: 0 };
    let mouse = new THREE.Vector2();
    let aspectRatio;
    const mapSize = 1000;
    let loading = true;
    let dragging;
    let rotating;


    // Globals
    let canvas;
    let camera;
    let renderer;
    const scene = new THREE.Scene();
    let orbitControls;
    let dragControls;
    let rotateControls;


    // Material
    const blueMaterial = new THREE.MeshBasicMaterial({color: "#18A0FB", side: THREE.DoubleSide});
    const greenMaterial = new THREE.MeshBasicMaterial({color: "#93C700", side: THREE.DoubleSide});
    const redMaterial = new THREE.MeshBasicMaterial({color: "#FF0000", side: THREE.DoubleSide});
    const yellowMaterial = new THREE.MeshBasicMaterial({color: "#FED400", side: THREE.DoubleSide});
    const purpleMaterial = new THREE.MeshBasicMaterial({color: "#CC00CC", side: THREE.DoubleSide});
    const flirtMaterial = new THREE.MeshBasicMaterial({color: "#960064", side: THREE.DoubleSide});
    const whiteMaterial = new THREE.MeshBasicMaterial({color: "#FFFFFF", side: THREE.DoubleSide});
    const blackMaterial = new THREE.MeshBasicMaterial({color: "#000000", side: THREE.DoubleSide});
    const bluePointMaterial = new THREE.PointsMaterial({color: "#18A0FB", size: 3, opacity: 1});
    const greenPointMaterial = new THREE.PointsMaterial({color: "#93C700", size: 3, opacity: 1});
    const redPointMaterial = new THREE.PointsMaterial({color: "#FF0000", size: 3, opacity: 1});
    const yellowPointMaterial = new THREE.PointsMaterial({color: "#FED400", size: 3, opacity: 1});
    const purplePointMaterial = new THREE.PointsMaterial({color: "#CC00CC", size: 3, opacity: 1});
    const flirtPointMaterial = new THREE.PointsMaterial({color: "#960064", size: 3, opacity: 1});


    // Loader
    const manager = new THREE.LoadingManager();
    const svgLoader = new SVGLoader(manager);
    function loadSVG(url) {

        let group = new THREE.Group();

        svgLoader.load(
            url,
            function ( data ) {

                const paths = data.paths;

                for ( let i = 0; i < paths.length; i++ ) {

                    const path = paths[ i ];

                    let material;

                    switch (path.color.getHexString().toUpperCase()) {
                        case "FFFFFF":
                            material = whiteMaterial;
                            break;
                        case "18A0FB":
                            material = blueMaterial;
                            break;
                        case "93C700":
                            material = greenMaterial;
                            break;
                        case "FF0000":
                            material = redMaterial;
                            break;
                        case "FED400":
                            material = yellowMaterial;
                            break;
                        case "CC00CC":
                            material = purpleMaterial;
                            break;
                        case "960064":
                            material = flirtMaterial;
                            break;
                        default:
                            material = new THREE.MeshBasicMaterial({
                                color: path.color,
                                side: THREE.DoubleSide
                            })
                            break;
                    }

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
            },
            // function ( xhr ) { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ) },
            // function ( error ) { console.log( 'An error happened', error) }
        );

        // scene.add(group);
        return group;
    }
    let svgArchive = [];


    // Objects
    let objects = [];
    let scaleObjects = [];
    // let draggableObjects = [];
    let sensorObjects = [];
    let sensorZoneObjects = [];


    // Sensors
    let sensorRawGeometry = new Map();
    let sensorRawPoints = new Map();
    let sensorPointClouds = [];

    // Raycaster
    const raycaster = new THREE.Raycaster();
    let currentIntersect = null;


    // Compass
    let compassRotation = 0;


    // Grid
    const gridSmall = new THREE.GridHelper(mapSize, mapSize, 0xF4F5F7, 0xF4F5F7);
    const gridBig = new THREE.GridHelper(mapSize, mapSize/10, 0xDFE1E4, 0xDFE1E4);
    gridSmall.position.set(0, -1, 0);
    gridBig.position.set(0, -1, 0);
    scene.add(gridSmall);
    scene.add(gridBig);


    // ClickPlane
    const clickPlane = new THREE.Mesh(new THREE.PlaneGeometry(mapSize, mapSize), new THREE.MeshBasicMaterial());
    clickPlane.visible = false;
    clickPlane.rotateX(-Math.PI/2);
    clickPlane.position.set(0, -1, 0);
    scene.add(clickPlane);


    // Stores
    let ws;
    const unsubWsStore = wsStore.subscribe(val => ws = val);
    let sensors;
    const unsubSensorStore = sensorStore.subscribe(val => {
        sensors = val

        if (!loading) {

            sensorObjects.forEach(obj => {
               scene.remove(obj);
            });
            sensorPointClouds.forEach(obj => {
                scene.remove(obj);
            });

            sensorObjects = [];
            sensorRawGeometry.clear();
            sensorRawPoints.clear();
            sensorPointClouds = [];
            if (rotateControls) rotateControls.detach();

            sensors.forEach(sensor => {
                const s = svgArchive.sensorIcon.clone();
                s.position.set(sensor.x / 1000, 1, sensor.y / 1000);
                s.rotation.set(0, sensor.radian, 0);
                s.name = sensor.address;
                changeColor(s, sensor.color);
                scene.add(s);
                sensorObjects.push(s);

                const pointGeometry = new THREE.BufferGeometry();
                const pointCloud = new THREE.Points(pointGeometry, getPointMaterial(sensor.color));
                scene.add(pointCloud);
                sensorPointClouds.push(pointCloud);
                sensorRawGeometry.set(sensor.address, pointGeometry);
            });

            addDragControls(sensorObjects);
            dragControls.enabled = toolProxy === "sensors";
        }
    });
    let layersProxy;
    const unsubLayerStore = layersStore.subscribe(val => {
        gridBig.visible = val.includes("layerGrid")
        gridSmall.visible = val.includes("layerGrid")

        if (val.includes("layerSensors")) {
            sensorObjects.forEach(obj => obj.visible = true);
            if (dragControls) addDragControls(sensorObjects);
        } else {
            sensorObjects.forEach(obj => obj.visible = false);
            rotateControls.detach();
            if (dragControls) addDragControls([]);
        }

        if (val.includes("layerRawData")) {
            sensorPointClouds.forEach(cloud => cloud.visible = true);
        } else {
            sensorPointClouds.forEach(cloud => cloud.visible = false);
        }


        layersProxy = val
    });
    let toolProxy;
    const unsubToolStore = toolStore.subscribe(val => {
        toolProxy = val
        if (!loading) {

            if (val === "sensors") {
                addDragControls(sensorObjects);
            } else {
                if (rotateControls) rotateControls.detach();
            }
            dragControls.enabled = val === "sensors";
        }
    });
    const unsubMessageStore = messageStore.subscribe(message => {
        const splitMessage = message.split(";");
        if (splitMessage[0] === "system" ) {
            if (splitMessage[1] === "move") {
                let ind = sensorObjects.findIndex(obj => obj.name === splitMessage[2]);
                sensorObjects[ind].position.set(parseFloat(splitMessage[3]), sensorObjects[ind].position.y, parseFloat(splitMessage[4]));
            } else if (splitMessage[1] === "rotate") {
                let ind = sensorObjects.findIndex(obj => obj.name === splitMessage[2]);
                sensorObjects[ind].rotation.set(0, -parseFloat(splitMessage[3]), 0);
            }
        } else {
            if (splitMessage[1] === "pos") {
                let rawMessage = splitMessage.slice(2);
                let measure = rawMessage[0].split("!");
                let points = [];
                measure.forEach(m => {
                    const [x, y] = m.split(":");
                    points.push({x: x, y: y});
                })
                sensorRawPoints.set(splitMessage[0], points);
                // sensorRawPoints[ind] = points;
            }
        }
    });


    // HelperFunctions
    function getPointMaterial(color) {
        switch (color.toUpperCase()) {
            case "18A0FB":
                return bluePointMaterial;
            case "93C700":
                return greenPointMaterial;
            case "FF0000":
                return redPointMaterial;
            case "FED400":
                return yellowPointMaterial;
            case "CC00CC":
                return purplePointMaterial;
            case "960064":
                return flirtPointMaterial;
            default:
                return new THREE.PointsMaterial({
                    color: new THREE.Color("#" + color),
                    size: 3,
                    opacity: 1
                })
        }
    }
    function changeColor(object, color) {
        object.children.forEach(child => {
            switch (child.material.color.getHexString().toUpperCase()) {
                case "FFFFFF":
                    child.material = whiteMaterial;
                    break;
                case "000000":
                    child.material = blackMaterial;
                    break;
                default:
                    switch (color) {
                        case "18A0FB":
                            child.material = blueMaterial;
                            break;
                        case "93C700":
                            child.material = greenMaterial;
                            break;
                        case "FF0000":
                            child.material = redMaterial;
                            break;
                        case "FED400":
                            child.material = yellowMaterial;
                            break;
                        case "CC00CC":
                            child.material = purpleMaterial;
                            break;
                        case "960064":
                            child.material = flirtMaterial;
                            break;
                        default:
                            child.material = new THREE.MeshBasicMaterial({
                                color: new THREE.Color("#" + color),
                                side: THREE.DoubleSide,
                                depthWrite: false
                            })
                            break;
                    }
                    break;
            }
        })
    }
    function addDragControls(objects) {
        try {
            dragControls.removeAllEventListeners();
        } catch (e) {}
        console.log(objects);
        dragControls = new DragControls([...objects], camera, renderer.domElement);
        dragControls.enabled = toolProxy === "sensors";
        dragControls.addEventListener("dragstart", (event) => {
            dragging = true;
            orbitControls.enablePan = false;
            orbitControls.enableZoom = false;
            console.log(dragging, "dragging");
            if (rotateControls) rotateControls.attach(event.object);
        })
        dragControls.addEventListener("drag", (event) => {
            if (dragging) {
                console.log(dragging, "dragging");
                const message = "system;move;" + event.object.name + ";" + event.object.position.x + ";" + event.object.position.z
                ws.send(message);
            }
        });
        dragControls.addEventListener("dragend", () => {
            dragging = false;
            orbitControls.enablePan = true;
            orbitControls.enableZoom = true;
            console.log(dragging, "dragging");
        });
    }


    if (browser) {
        onMount(async () => {
            // Globals
            sizes = {width: window.innerWidth, height: window.innerHeight};
            aspectRatio = sizes.width / sizes.height;
            canvas = document.querySelector(`canvas#three`);


            // Camera
            camera = new THREE.OrthographicCamera(-5 * aspectRatio, 5 * aspectRatio, 5, -5, 0, 10000);
            camera.position.y = 100;


            // Renderer
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
            });
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


            // OrbitControls
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            orbitControls.dampingFactor = 0.3;
            orbitControls.rotateSpeed = 0.25;
            orbitControls.screenSpacePanning = false;
            orbitControls.minZoom = 0.1;
            orbitControls.maxZoom = 3;
            orbitControls.zoomSpeed = 2;
            orbitControls.minPolarAngle = 0;
            orbitControls.maxPolarAngle = 0;
            orbitControls.maxPan = new THREE.Vector3(mapSize/3, 100, mapSize/3);
            orbitControls.mouseButtons.LEFT = THREE.MOUSE.PAN;
            orbitControls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
            orbitControls.touches.ONE = THREE.TOUCH.PAN;
            orbitControls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
            orbitControls.addEventListener("change", () => compassRotation = THREE.MathUtils.radToDeg(orbitControls.getAzimuthalAngle()));


            rotateControls = new TransformControls(camera, renderer.domElement);
            rotateControls.setMode("rotate");
            rotateControls.showX = false;
            rotateControls.showZ = false;
            rotateControls.showE = false;
            rotateControls.windowHeight = sizes.height;
            rotateControls.addEventListener("mouseDown", () => {
                rotating = true;
                orbitControls.enablePan = false;
                orbitControls.enableZoom = false;
                console.log(rotating, "rotating");
            });
            rotateControls.addEventListener("change", () => {
                if (rotating) {
                    let y = rotateControls.object.rotation.y;
                    if ((rotateControls.object.rotation.x < 0 || rotateControls.object.rotation.z < 0) || (rotateControls.object.rotation.x > Math.PI - 0.1 || rotateControls.object.rotation.z > Math.PI - 0.1)) {
                        y = Math.PI/2 + (Math.PI/2 - rotateControls.object.rotation.y);
                        if (y > Math.PI) {
                            y = - (Math.PI/2 + (Math.PI/2 + rotateControls.object.rotation.y));
                        }
                    }
                    const message = "system;rotate;" + rotateControls.object.name + ";" + (-Math.trunc(y * 1000 ) / 1000);
                    ws.send(message);
                }
            });
            rotateControls.addEventListener("mouseUp", () => {
                rotating = false;
                orbitControls.enablePan = true;
                orbitControls.enableZoom = true;
                console.log(rotating, "rotating");
            });
            scene.add(rotateControls);


            // Resize
            window.addEventListener("resize", () => {
                sizes = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                };

                camera.left = -5 * (sizes.width / sizes.height);
                camera.right = 5 * (sizes.width / sizes.height);
                camera.updateProjectionMatrix();

                rotateControls.windowHeight = sizes.height;
                renderer.setSize(sizes.width, sizes.height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                // renderer.render(scene, camera);
            });


            // Mouse
            window.addEventListener("mousemove", (event) => {
                mouse.x = event.clientX / sizes.width * 2 - 1;
                mouse.y = -(event.clientY / sizes.height) * 2 + 1;
            });
            canvas.addEventListener("mousedown", () => {
                if (currentIntersect && !dragging && !rotating) {
                    console.log(`clicked on filtered`, currentIntersect);
                    if (rotateControls) rotateControls.detach();
                    // const icon = svgArchive.plus.clone()
                    // icon.position.set(currentIntersect.point.x, 0 , currentIntersect.point.z)
                    // sensorZoneObjects.push(icon);
                    // scene.add(icon);
                }
            });


            // Render
            function render() {
                try {
                    renderer.render(scene, camera);
                } catch (e) {
                    console.log(e);
                }
            }


            // Animate
            // <!--function animate() {-->
            //
            // <!--    // stats.begin();-->
            //
            // <!--    // Cast a ray-->
            // <!--    raycaster.setFromCamera(mouse, camera);-->
            //
            // <!--    let intersects = raycaster.intersectObjects([...objects]);-->
            // <!--    // let intersects = raycaster.intersectObject(cube);-->
            //
            //
            //     if (intersects.length && !dragging) {
            //         currentIntersect = intersects[0];
            //
            //         currentIntersect.Object.position.x = mouse.x;
            //             currentIntersect.Object.position.y = mouse.y;
            //     } else {
            //         currentIntersect = null;
            //     }
            //
            //     const factor = (((camera.top - camera.bottom) / camera.zoom) / sizes.height) * 1000;
            //
            //     scaleObjects.forEach(obj => {
            //         obj.scale.set(1, 1, 1).multiplyScalar(factor/ 10);
            //     })
            //
            //     if (layersProxy.includes("layerGrid")) {
            //         // if (camera.zoom <= .5) {
            //         //     gridBig.visible = true;
            //         //     gridSmall.visible = false;
            //         // } else {
            //         //     gridBig.visible = false;
            //         //     gridSmall.visible = true;
            //         // }
            //         gridBig.visible = true;
            //         gridSmall.visible = true;
            //     } else {
            //         gridBig.visible = false;
            //         gridSmall.visible = false;
            //     }
            //
            //     let positions = [];
            //     for (let point of points) {
            //         // for (let point of sensors) {
            //             positions.push(
            //                 point.x / 1000,
            //                 0,
            //                 point.y / 1000,
            //             );
            //         // }
            //     }
            //     tgeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            //
            //     controls.update();
            //     // controls.update(clock.getDelta());
            //     render();
            //
            //     // stats.end();
            //     window.requestAnimationFrame(animate);
            // }
            // Animate
            function animate() {
                const scaleFactor = (((camera.top - camera.bottom) / camera.zoom) / sizes.height) * 100;
                const scaleObjects = [...sensorZoneObjects.flat(2), ...sensorObjects];
                scaleObjects.forEach(obj => {
                    obj.scale.set(1, 1, 1).multiplyScalar(scaleFactor)
                });

                raycaster.setFromCamera(mouse, camera);
                // const intersects = raycaster.intersectObjects([...sensorZoneObjects.flat(2), ...sensorObjects, clickPlane]);
                const intersects = raycaster.intersectObjects([clickPlane]);
                // const intersects = raycaster.intersectObjects([...sensorZoneObjects.flat(2), clickPlane]);
                // if (intersects.length && !dragging) {
                if (intersects.length) {
                    currentIntersect = intersects[0];
                } else {
                    currentIntersect = null;
                }

                for (const [key, value] of sensorRawGeometry) {
                    const points = sensorRawPoints.get(key);

                    let positions = [];
                    if (points) {
                        for (let point of points) {
                            positions.push(point.x / 1000, 0, point.y / 1000);
                        }
                    }
                    value.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
                }

                orbitControls.update();

                render();
                window.requestAnimationFrame(animate);
            }


            // Load SVGs
            svgArchive.sensorIcon = loadSVG("/icons/three/sensorIcon.svg");
            svgArchive.circle = loadSVG("/icons/three/circle.svg");
            svgArchive.plus = loadSVG("/icons/three/plus.svg");
            svgArchive.minus = loadSVG("/icons/three/minus.svg");
            svgArchive.humanStanding = loadSVG("/icons/three/humanStanding.svg");

            manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')};

            manager.onLoad = () => {
                console.log( 'Loading complete!');

                addDragControls(sensors);
                dragControls.enabled = false;

                sensors.forEach(sensor => {

                    const s = svgArchive.sensorIcon.clone();
                    s.name = sensor.address;
                    s.position.set(sensor.x / 1000, 1, sensor.y / 1000);
                    changeColor(s, sensor.color);
                    scene.add(s);
                    sensorObjects.push(s);

                })

                render();
                animate();
                loading = false;
            }
        })
    }


    onDestroy(() => {
        unsubWsStore();
        unsubMessageStore();
        unsubSensorStore();
        unsubLayerStore();
        unsubToolStore();
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
<LoadJumper show={loading}/>
{toolProxy}
{layersProxy}
