<script>
    import * as THREE from "three";
    import { onDestroy, onMount } from "svelte";
    import { toolStore, layersStore, wsStore, messageStore, sensorStore, selectedSensorStore } from "$lib/../store";
    import { browser } from "$app/env";
    import { OrbitControls } from "$lib/Three/OrbitControls";
    import { DragControls } from "$lib/Three/DragControls";
    import { TransformControls } from "$lib/THREE/TransformControls";
    import LoadJumper from "$lib/Primitives/LoadJumper.svelte";
    import { SVGLoader } from "$lib/THREE/SVGLoader.js";
    import { centerCameraStore, pausedStore } from "../../store";


    // Helper
    let sizes = { width: 0, height: 0 };
    let mouse = new THREE.Vector2();
    let aspectRatio;
    const mapSize = 1000;
    let loading = true;
    let dragging;
    let rotating;
    let threeScale = 1000;


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
    const transparentMaterial = new THREE.MeshBasicMaterial({color: "#FFFFFF", opacity: 0, transparent: true, side: THREE.DoubleSide});
    const bluePointMaterial = new THREE.PointsMaterial({color: "#18A0FB", size: 3, opacity: 1});
    const greenPointMaterial = new THREE.PointsMaterial({color: "#93C700", size: 3, opacity: 1});
    const redPointMaterial = new THREE.PointsMaterial({color: "#FF0000", size: 3, opacity: 1});
    const yellowPointMaterial = new THREE.PointsMaterial({color: "#FED400", size: 3, opacity: 1});
    const purplePointMaterial = new THREE.PointsMaterial({color: "#CC00CC", size: 3, opacity: 1});
    const flirtPointMaterial = new THREE.PointsMaterial({color: "#960064", size: 3, opacity: 1});
    const blueLineMaterial = new THREE.LineBasicMaterial({color: "#18A0FB", linewidth: 1});
    const greenLineMaterial = new THREE.LineBasicMaterial({color: "#93C700", linewidth: 1});
    const redLineMaterial = new THREE.LineBasicMaterial({color: "#FF0000", linewidth: 1});
    const yellowLineMaterial = new THREE.LineBasicMaterial({color: "#FED400", linewidth: 1});
    const purpleLineMaterial = new THREE.LineBasicMaterial({color: "#CC00CC", linewidth: 1});
    const flirtLineMaterial = new THREE.LineBasicMaterial({color: "#960064", linewidth: 1});
    const bluePolygonMaterial = new THREE.MeshBasicMaterial({color: "#18A0FB", opacity: .1, transparent: true, side: THREE.DoubleSide});
    const greenPolygonMaterial = new THREE.MeshBasicMaterial({color: "#93C700", opacity: .1, transparent: true, side: THREE.DoubleSide});
    const redPolygonMaterial = new THREE.MeshBasicMaterial({color: "#FF0000", opacity: .1, transparent: true, side: THREE.DoubleSide});
    const yellowPolygonMaterial = new THREE.MeshBasicMaterial({color: "#FED400", opacity: .1, transparent: true, side: THREE.DoubleSide});
    const purplePolygonMaterial = new THREE.MeshBasicMaterial({color: "#CC00CC", opacity: .1, transparent: true, side: THREE.DoubleSide});
    const flirtPolygonMaterial = new THREE.MeshBasicMaterial({color: "#960064", opacity: .1, transparent: true, side: THREE.DoubleSide});


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
        return group;
    }
    let svgArchive = {};        // Archive of all loaded SVGs


    // Objects
    let scaleObjects = [];      // List of all objects that should be scaled to be always the same size
    let sensorObjects = [];     // Sensor SVGs with their position
    let origin;                 // Origin SVG with its position
    let personObjects = [];


    // Sensors
    let sensorRawPoints = new Map();     // Map of all Raw Data Points
    let sensorRawGeometry = new Map();   // Map of all Raw Data Geometries based on their points
    let sensorPointClouds = [];          // List of all Point Cloud Meshes (namely the Sensor Raw Data Geometries)
    let sensorZoneObjects = new Map();   // Map with Lists of all Zone Objects (circles)
    let sensorZoneLines = new Map();     // Map of all Line Meshes based on the Zone Objects
    let sensorZonePolygons = new Map();  // Map of all Polygon Meshes based on the Zone Objects
    let sensorZoneObjectsList = [];      // List of all Zone Objects (circles) to be used for dragControls or scaling


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
                s.position.set(sensor.x / threeScale, 1, sensor.y / threeScale);
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
    let paused;
    const unsubPausedStore = pausedStore.subscribe(val => paused = val);
    let layersProxy;
    const unsubLayerStore = layersStore.subscribe(val => {
        layersProxy = val

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

        if (val.includes("layerZones")) {
            for (const [key, value] of sensorZoneObjects) {
                value.forEach(zoneObject => {
                    zoneObject.visible = true;
                })
            }
            drawZones()
        } else {
            for (const [key, value] of sensorZoneObjects) {
                value.forEach(zoneObject => {
                    zoneObject.visible = false;
                })
            }
            drawZones()
        }

        if (val.includes("layerRawData")) {
            sensorPointClouds.forEach(cloud => cloud.visible = true);
        } else {
            sensorPointClouds.forEach(cloud => cloud.visible = false);
        }

        if (val.includes("layerPersons")) {
            personObjects.forEach(person => person.visible = true);
        } else {
            personObjects.forEach(person => person.visible = false);
        }
    });
    let toolProxy;
    const unsubToolStore = toolStore.subscribe(val => {
        toolProxy = val
        if (!loading) {

            dragControls.dispose();

            if (val === "sensors") {
                addDragControls(sensorObjects);
            } else {
                if (rotateControls) rotateControls.detach();
            }

            if (val === "zonesMove") {
                addDragControls(sensorZoneObjectsList)
            }

            // if (val === "zonesAdd" || val === "zonesRemove") {
            // }

            if (val === "origin") {
                addDragControls([origin]);
            }
        }
    });
    const unsubMessageStore = messageStore.subscribe(message => {
        if (!paused) {
            const splitMessage = message.split(";");
            if (splitMessage[0] === "system" ) {
                if (splitMessage[1] === "rotate") {
                    switch (splitMessage[2]) {
                        case "origin":
                            origin.rotation.set(0, -parseFloat(splitMessage[4]), 0);
                            break;
                        case "sensors":
                            let ind = sensorObjects.findIndex(obj => obj.name === splitMessage[3]);
                            sensorObjects[ind].rotation.set(0, -parseFloat(splitMessage[4]), 0);
                            break;
                        case "zones":
                            break;
                        default:
                            break;
                    }
                } else if (splitMessage[1] === "move") {
                    let ind = sensorObjects.findIndex(obj => obj.name === splitMessage[3]);
                    switch (splitMessage[2]) {
                        case "origin":
                            origin.position.set(parseFloat(splitMessage[4]), origin.position.y, parseFloat(splitMessage[5]));
                            break;
                        case "sensors":
                            sensorObjects[ind].position.set(parseFloat(splitMessage[4]), sensorObjects[ind].position.y, parseFloat(splitMessage[5]));
                            break;
                        case "zones":
                            let zoneObjectsGrouped = sensorZoneObjects.get(splitMessage[3]);
                            zoneObjectsGrouped[parseInt(splitMessage[4])].position.set(parseFloat(splitMessage[5]), zoneObjectsGrouped[parseInt(splitMessage[4])].position.y, parseFloat(splitMessage[6]));
                            drawZones();
                            // sensorObjects[ind].position.set(parseFloat(splitMessage[4]), sensorObjects[ind].position.y, parseFloat(splitMessage[5]));
                            break;
                        default:
                            break;
                    }
                } else if (splitMessage[1] === "add") {

                    let ind = sensors.findIndex(obj => obj.address === splitMessage[3]);

                    // Create zone object
                    const circle = svgArchive.circle.clone();
                    circle.position.set(parseFloat(splitMessage[5]), 0.5 , parseFloat(splitMessage[6]));
                    changeColor(circle, sensors[ind].color);
                    circle.visible = layersProxy.includes("layerZones");
                    scene.add(circle);


                    // Add zone object to sensorZoneObjects Map
                    let zoneObjectsGrouped = sensorZoneObjects.get(splitMessage[3])
                    if (!zoneObjectsGrouped) {
                        zoneObjectsGrouped = [];
                    }
                        // zoneObjectsGrouped.sort(orderByAngle(splitMessage[3]));
                    circle.name = `${splitMessage[3]};${zoneObjectsGrouped.length}`
                    zoneObjectsGrouped.push(circle);
                    sensorZoneObjects.set(splitMessage[3], zoneObjectsGrouped);

                    generateSensorZoneObjectList();
                    // addDragControls(sensorZoneObjectsList);

                    drawZones();
                    console.log(message);
                } else if (splitMessage[1] === "remove") {
                    const address = splitMessage[3]
                    let tempSensorZoneObjects = sensorZoneObjects.get(address);
                    if (tempSensorZoneObjects) {
                        tempSensorZoneObjects.forEach(obj => {
                            scene.remove(obj);
                        })
                    }
                    sensorZoneObjects.delete(address);
                    let sensorZoneLinesTemp = sensorZoneLines.get(address);
                    let sensorZonePolygonsTemp = sensorZonePolygons.get(address);
                    scene.remove(sensorZoneLinesTemp);
                    scene.remove(sensorZonePolygonsTemp);
                    sensorZoneLines.delete(address);
                    sensorZonePolygons.delete(address);
                } else if (splitMessage[1] === "origin") {
                    origin.position.set(parseFloat(splitMessage[2]) / threeScale, origin.position.y, parseFloat(splitMessage[3]) / threeScale);
                } else if (splitMessage[1] === "zones") {

                    // console.log(sensorZoneObjects);
                    for (const [key, tempObjects] of sensorZoneObjects) {
                        const address = key;
                        let tempSensorZoneObjects = tempObjects;
                        if (tempSensorZoneObjects) {
                            tempSensorZoneObjects.forEach(obj => {
                                scene.remove(obj);
                            })
                        }
                        sensorZoneObjects.delete(address);
                        let sensorZoneLinesTemp = sensorZoneLines.get(address);
                        let sensorZonePolygonsTemp = sensorZonePolygons.get(address);
                        scene.remove(sensorZoneLinesTemp);
                        scene.remove(sensorZonePolygonsTemp);
                        sensorZoneLines.delete(address);
                        sensorZonePolygons.delete(address);
                    }
                    // sensors.forEach(sensor => {
                    //
                    //     console.log(scene);
                    // })
                    sensorZoneObjects.clear();


                    const sensorMessageParts = splitMessage[2].split("!")
                    for (let i = 0; i < sensorMessageParts.length - 1; i++) {
                        const sensorMessage = sensorMessageParts[i].split(",")
                        const sensorAddress = sensorMessage[0]

                        console.log(sensorAddress);

                        const ind = sensors.findIndex(obj => obj.address === sensorAddress);


                        if (sensorMessage[1]) {
                            const sensorPositions = sensorMessage[1].split("?")
                            for (let j = 0; j < sensorPositions.length - 1; j++) {

                                const xy = sensorPositions[j].split(":")


                                // Create zone object
                                const circle = svgArchive.circle.clone();
                                circle.position.set(parseFloat(xy[0]), 0.5, parseFloat(xy[1]));
                                changeColor(circle, sensors[ind].color);
                                circle.visible = layersProxy.includes("layerZones");
                                scene.add(circle);

                                // Add zone object to sensorZoneObjects Map
                                let zoneObjectsGrouped = sensorZoneObjects.get(sensorAddress)
                                if (!zoneObjectsGrouped) {
                                    zoneObjectsGrouped = [];
                                }
                                circle.name = `${splitMessage[3]};${zoneObjectsGrouped.length}`
                                zoneObjectsGrouped.push(circle);
                                sensorZoneObjects.set(sensorAddress, zoneObjectsGrouped);
                            }
                        }
                       // const zoneObjectsGrouped = sensorZoneObjects.get(sensorAddress)
                       // zoneObjectsGrouped.sort(orderByAngle(sensorAddress));
                       // sensorZoneObjects.set(sensorAddress, zoneObjectsGrouped);
                    }

                    generateSensorZoneObjectList();

                    drawZones();

                } else if (splitMessage[1] === "persons") {
                    if (layersProxy.includes("layerPersons")) {
                        personObjects.forEach(obj => scene.remove(obj));

                        const personPositionsMessages = splitMessage[2].split("!")
                        personPositionsMessages.forEach(personPositionsMessage => {
                            const personPosition = personPositionsMessage.split(":")

                            const person = svgArchive.humanStanding.clone();
                            person.position.set(parseFloat(personPosition[0]), 0.2, parseFloat(personPosition[1]));
                            person.scale.set(1, 1, 1).multiplyScalar(.75);
                            changeColor(person, "000000")
                            scene.add(person);
                            personObjects.push(person);
                        })
                    }
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
                }
            }
        }
    });
    let selectedSensor;
    const unsubSelectedStore = selectedSensorStore.subscribe(val => selectedSensor = val);
    const unsubCenterCamera = centerCameraStore.subscribe(val => {
        if (val && orbitControls) {
            orbitControls.reset();
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
    function getLineMaterial(color) {
        switch (color.toUpperCase()) {
            case "18A0FB":
                return blueLineMaterial;
            case "93C700":
                return greenLineMaterial;
            case "FF0000":
                return redLineMaterial;
            case "FED400":
                return yellowLineMaterial;
            case "CC00CC":
                return purpleLineMaterial;
            case "960064":
                return flirtLineMaterial;
            default:
                return new THREE.LineBasicMaterial({
                    color: new THREE.Color("#" + color),
                    linewidth: 1,
                })
        }
    }
    function getPolygonMaterial(color) {
        switch (color.toUpperCase()) {
            case "18A0FB":
                return bluePolygonMaterial;
            case "93C700":
                return greenPolygonMaterial;
            case "FF0000":
                return redPolygonMaterial;
            case "FED400":
                return yellowPolygonMaterial;
            case "CC00CC":
                return purplePolygonMaterial;
            case "960064":
                return flirtPolygonMaterial;
            default:
                return new THREE.MeshBasicMaterial({
                    color: new THREE.Color("#" + color),
                    opacity: .1,
                    transparent: true,
                    side: THREE.DoubleSide
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
            dragControls.dispose();
            dragControls.removeAllEventListeners();
        } catch (e) {}
        // console.log(objects);
        dragControls = new DragControls([...objects], camera, renderer.domElement);
        dragControls.enabled = true;
        dragControls.addEventListener("dragstart", (event) => {
            dragging = true;
            orbitControls.enablePan = false;
            orbitControls.enableZoom = false;
            // console.log(dragging, "dragging");
            if (rotateControls && toolProxy === "sensors") rotateControls.attach(event.object);
        })
        dragControls.addEventListener("drag", (event) => {
            if (dragging) {
                // console.log(dragging, "dragging");

                let type;
                // console.log("bla", toolProxy);
                //
                // if (toolProxy === "zonesRemove") {
                //     console.log("foo");
                //     drawZones();
                // }

                switch (toolProxy) {
                    case "sensors":
                        type = "sensors";
                        break;
                    case "zonesAdd":
                        type = "zones";
                        drawZones();
                        break;
                    case "zonesMove":
                        type = "zones";
                        drawZones();
                        break;
                    case "zonesRemove":
                        type = "zones";
                        drawZones();
                        break;
                    case "origin":
                        type = "origin";
                        break;
                    default:
                        type = "none";
                        break;
                }

                if (type !== "zones") {
                    const message = "system;move;" + type + ";" + event.object.name + ";" + event.object.position.x + ";" + event.object.position.z
                    ws.send(message);
                } else if (type === "zones") {
                    ws.send(`system;move;zones;${event.object.name};${event.object.position.x};${event.object.position.z}`)
                    // sendZonesMessage();
                }
            }
        });
        dragControls.addEventListener("dragend", () => {
            dragging = false;
            orbitControls.enablePan = true;
            orbitControls.enableZoom = true;
            // console.log(dragging, "dragging");
        });
    }
    function orderByAngle(address) {
        return function(a, b) {
            let ind = sensors.findIndex(obj => obj.address === address);
            let sensorX = sensors[ind].x / threeScale;
            let sensorY = sensors[ind].y / threeScale;

            let angleA = Math.atan2((a.position.z - sensorY), (a.position.x - sensorX));
            let angleB = Math.atan2((b.position.z - sensorY), (b.position.x - sensorX));

            if (angleA > angleB) {
                return 1;
            }
            if (angleA < angleB) {
                return -1;
            }
            return 0;
        }
    }
    function drawZones() {
        for (const [key, value] of sensorZoneObjects) {
            let ind = sensors.findIndex(obj => obj.address === key);

            // console.log("draw zones", key);
            const visible = layersProxy.includes("layerZones");

            let points = [];
            let points2D = [];
            value.forEach(zoneObject => {
                points.push(new THREE.Vector3(zoneObject.position.x, 0.25, zoneObject.position.z));
                points2D.push(new THREE.Vector2(zoneObject.position.x, zoneObject.position.z));
            })
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.LineLoop(geometry, getLineMaterial(sensors[ind].color));
            line.visible = visible

            let polygonShape = new THREE.Shape();
            polygonShape.setFromPoints(points2D);
            const polygonGeometry = new THREE.ShapeGeometry(polygonShape);
            const polygon = new THREE.Mesh(polygonGeometry, getPolygonMaterial(sensors[ind].color));
            polygon.rotateX(Math.PI/2);
            polygon.position.setY(-.25);
            polygon.visible = visible;

            let sensorZoneLinesTemp = sensorZoneLines.get(key);
            let sensorZonePolygonsTemp = sensorZonePolygons.get(key);
            scene.remove(sensorZoneLinesTemp);
            scene.remove(sensorZonePolygonsTemp);
            sensorZoneLines.set(key, line);
            sensorZonePolygons.set(key, polygon);
            scene.add(line);
            scene.add(polygon);
        }
    }
    function generateSensorZoneObjectList() {
        let temp = []
        for (const [key, value] of sensorZoneObjects) {
            temp.push(...value);
        }
        sensorZoneObjectsList = temp;
    }
    function sendZonesMessage() {
        let message = "system;zones;";
        for (const [key, value] of sensorZoneObjects) {
            message += key + ",";
            for (const obj of value) {
                message += obj.position.x + ":" + obj.position.z + "?";
            }
            message += "!";
        }
        ws.send(message);
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
            orbitControls.minPan = new THREE.Vector3(-mapSize/3, 100, -mapSize/3);
            orbitControls.maxPan = new THREE.Vector3(mapSize/3, 100, mapSize/3);
            orbitControls.mouseButtons.LEFT = THREE.MOUSE.PAN;
            orbitControls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
            orbitControls.touches.ONE = THREE.TOUCH.PAN;
            orbitControls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
            orbitControls.addEventListener("change", () => {
                compassRotation = THREE.MathUtils.radToDeg(orbitControls.getAzimuthalAngle())
                if (camera.position.distanceTo(new THREE.Vector3(0, 100, 0)) > .1) {
                    centerCameraStore.set(false);
                }
            });


            // RotateControls
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
                // console.log(rotating, "rotating");
            });
            rotateControls.addEventListener("change", () => {
                if (rotating) {
                    let ry = rotateControls.object.rotation.y;
                    if ((rotateControls.object.rotation.x < 0 || rotateControls.object.rotation.z < 0) || (rotateControls.object.rotation.x > Math.PI - 0.1 || rotateControls.object.rotation.z > Math.PI - 0.1)) {
                        ry = Math.PI/2 + (Math.PI/2 - rotateControls.object.rotation.y);
                        if (ry > Math.PI) {
                            ry = - (Math.PI/2 + (Math.PI/2 + rotateControls.object.rotation.y));
                        }
                    }

                    let type;

                    switch (toolProxy) {
                        case "sensors":
                            type = "sensors";
                            break;
                        case "zoneEdit" || "zoneRemove":
                            type = "zone";
                            break;
                        case "origin":
                            type = "origin";
                            break;
                        default:
                            type = "none";
                            break;
                    }

                    const message = "system;rotate;" + toolProxy + ";" + rotateControls.object.name + ";" + (-Math.trunc(ry * 1000 ) / 1000);
                    ws.send(message);
                }
            });
            rotateControls.addEventListener("mouseUp", () => {
                rotating = false;
                orbitControls.enablePan = true;
                orbitControls.enableZoom = true;
                // console.log(rotating, "rotating");
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
            });


            // Mouse
            window.addEventListener("mousemove", (event) => {
                mouse.x = event.clientX / sizes.width * 2 - 1;
                mouse.y = -(event.clientY / sizes.height) * 2 + 1;
            });
            // canvas.addEventListener("touchmove", (event) => {
            //     const evt = (typeof event.originalEvent === "undefined") ? event : event.originalEvent;
            //     const touch = evt.touches[0] || evt.changedTouches[0]
            //     mouse.x = touch.pageX / sizes.width * 2 - 1;
            //     mouse.y = -(touch.pageY / sizes.width) * 2 - 1;
            //
            //     console.log("canvas", mouse);
            // });
            // window.addEventListener("touchmove", (event) => {
            //
            //
            //     console.log("window", mouse);
            // });
            canvas.addEventListener("mousedown", () => {
                if (currentIntersect && !dragging && !rotating) {
                    // console.log(`clicked on`, currentIntersect);
                    if (rotateControls) rotateControls.detach();
                }

                console.log(toolProxy);
                if (currentIntersect && (toolProxy === "zonesAdd") && !dragging && selectedSensor) {

                    let zoneObjectsGrouped = sensorZoneObjects.get(selectedSensor);
                    if (!zoneObjectsGrouped) {
                        zoneObjectsGrouped = [];
                    }
                    const index = zoneObjectsGrouped.length + 1;

                    // sendZonesMessage();

                    ws.send(`system;add;zones;${selectedSensor};${index};${currentIntersect.point.x};${currentIntersect.point.z}`);
                }
            });
            canvas.addEventListener("touchstart", (event) => {
                const evt = (typeof event.originalEvent === "undefined") ? event : event.originalEvent;
                const touch = evt.touches[0] || evt.changedTouches[0]
                mouse.x = touch.pageX / sizes.width * 2 - 1;
                mouse.y = -(touch.pageY / sizes.height) * 2 + 1;
            });
            canvas.addEventListener("touchend", () => {
                if (currentIntersect && !dragging && !rotating) {
                    // console.log(`clicked on`, currentIntersect);
                    if (rotateControls) rotateControls.detach();
                }

                if (currentIntersect && (toolProxy === "zonesAdd") && !dragging && selectedSensor) {
                    // let ind = sensors.findIndex(obj => obj.address === selectedSensor);
                    //
                    // // Create zone object
                    // const circle = svgArchive.circle.clone();
                    // circle.position.set(currentIntersect.point.x, 0.5 , currentIntersect.point.z);
                    // circle.scale.set(4, 4, 4);
                    // changeColor(circle, sensors[ind].color)
                    // scene.add(circle);
                    //
                    //
                    // // Add zone object to sensorZoneObjects Map
                    // let zoneObjectsGrouped = sensorZoneObjects.get(selectedSensor)
                    // if (!zoneObjectsGrouped) {
                    //     zoneObjectsGrouped = [];
                    //     zoneObjectsGrouped.push(circle);
                    // } else {
                    //     zoneObjectsGrouped.push(circle);
                    //     zoneObjectsGrouped.sort(orderByAngle);
                    // }
                    // sensorZoneObjects.set(selectedSensor, zoneObjectsGrouped);
                    //
                    // generateSensorZoneObjectList();
                    // // addDragControls(sensorZoneObjectsList);
                    //
                    // drawZones();
                    let zoneObjectsGrouped = sensorZoneObjects.get(selectedSensor);
                    if (!zoneObjectsGrouped) {
                        zoneObjectsGrouped = [];
                    }
                    const index = zoneObjectsGrouped.length + 1;

                    // sendZonesMessage();
                    ws.send(`system;add;zones;${selectedSensor};${index};${currentIntersect.point.x};${currentIntersect.point.z}`);
                }
            })



            // Render
            function render() {
                try {
                    renderer.render(scene, camera);
                } catch (e) {
                    // console.log(e);
                }
            }


            // Animate
            function animate() {
                const scaleFactor = (((camera.top - camera.bottom) / camera.zoom) / sizes.height) * 100;
                // const scaleObjects = [...sensorZoneObjects.flat(2), ...sensorObjects, origin];
                // const scaleObjects = [...sensorZoneObjectsList, ...sensorObjects, origin, ...personObjects];
                const scaleObjects = [...sensorZoneObjectsList, ...sensorObjects, origin, ...personObjects];
                // const scaleObjects = [...sensorObjects, origin];
                scaleObjects.forEach(obj => {
                    obj.scale.set(1, 1, 1).multiplyScalar(scaleFactor)
                });

                raycaster.setFromCamera(mouse, camera);
                // const intersects = raycaster.intersectObjects([...sensorZoneObjects.flat(2), ...sensorObjects, clickPlane]);
                // const intersects = raycaster.intersectObjects([...sensorZoneObjects.flat(2), clickPlane]);
                const intersects = raycaster.intersectObjects([...sensorObjects, clickPlane]);
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
                            positions.push(point.x / threeScale, 0, point.y / threeScale);
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
            svgArchive.origin = loadSVG("/icons/three/origin.svg");

            // manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')};

            manager.onLoad = () => {
                // console.log( 'Loading complete!');

                // addDragControls(sensors);
                // dragControls.enabled = false;

                sensors.forEach(sensor => {
                    const sensorObj = svgArchive.sensorIcon.clone();
                    sensorObj.name = sensor.address;
                    sensorObj.position.set(sensor.x / threeScale, 1, sensor.y / threeScale);
                    changeColor(sensorObj, sensor.color);
                    scene.add(sensorObj);
                    sensorObjects.push(sensorObj);
                })

                const originObj = svgArchive.origin.clone();
                originObj.name = "origin";
                originObj.position.set(0, .75, 0);
                scene.add(originObj);
                origin = originObj;

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
        unsubSelectedStore();
        unsubCenterCamera();
        unsubPausedStore();
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
