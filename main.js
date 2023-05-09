import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

var camera, scene, renderer;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var prevMouseX = 0;
var prevMouseY = 0;
var isDragging = false;

const material = new THREE.MeshLambertMaterial({ color: 0x9B9B9B, side: THREE.DoubleSide });
const stair_material = new THREE.MeshLambertMaterial({ color: 0x9B9B9B });
const window_material = new THREE.MeshLambertMaterial({ color: 0xA4873F, opacity: 0.5, transparent: true });
const wood_material = new THREE.MeshLambertMaterial({ color: 0x999D71});
const kitchen_material = new THREE.MeshLambertMaterial({ color: 0x414141 });
const rail_color = new THREE.MeshLambertMaterial({ color: 0xffffff });
const outline_color = new THREE.MeshLambertMaterial({ color: 0x000000 });

init();

function init() {
     // Create Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 0;
    camera.position.x = 10;
    //camera.position.x = -10;
   // camera.rotation.y = 30;

     // Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x686464);

    // Handle Light
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);

    // set the position and target of the light
    dirLight.position.set(5, 10, 7);
    dirLight.target.position.set(0, 0, 0);

    // add the light and target to the scene
    scene.add(dirLight);
    scene.add(dirLight.target);

    
    // Draw
    drawFirstFloor(0, 0, 0);
    drawSecondFloor(0, 4.2, 0);
    drawRoof(0, 8.4, 0);

    // Create Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Listener Events
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('mousemove', onMouseMove, false);

    animate();
}

function drawFirstFloor(baseX, baseY, baseZ) {
    drawGarage(baseX + 15, baseY, baseZ - 4)
    drawLivingRoom(baseX, baseY, baseZ);
    drawRails(baseX + 6, baseY, baseZ);
    drawStairs(baseX, baseY + 0.4, baseZ - 10);
    drawFamilyLivingRoom(baseX + 6.5, baseY, baseZ - 1.8);
    drawCourtyard(baseX + 6.5, baseY, baseZ - 7);
    drawDiningRoom(baseX + 6.5, baseY, baseZ - 11);
    drawKitchen(baseX + 6.5, baseY, baseZ - 15);
    drawStore(baseX + 6.5, baseY, baseZ - 20);
    drawWetKitchen(baseX + 5, baseY, baseZ - 20);
    drawBedroom(baseX - 4, baseY, baseZ - 13);

    for(var i = 0; i < 40; i++) {
        drawFence(i * 0.6 - 4, 0, 1, true)
    }
    for(var i = 0; i < 40; i++) {
        drawFence(i * 0.6 - 4, 0, -24, true)
    }
    for(var i = 0; i < 42; i++) {
        drawFence(-4.4, 0, i * 0.6 - 23.8, false)
    }
    for(var i = 0; i < 21; i++) {
        drawFence(19.8, 0, i * 0.6 - 23.8, false)
    }
    for(var i = 0; i < 15; i++) {
        drawFence(19.8, 0, i * 0.6 - 7.6, false)
    }
    drawGrass(14.3, -2.2, -12.5);
}

function drawGrass(baseX, baseY, baseZ) {
    var grassTexture = new THREE.TextureLoader().load('grass.jpg');
    var grassMaterial = new THREE.MeshLambertMaterial({ map: grassTexture });
    var grassGeometry = new THREE.BoxGeometry(11, 0.1, 25.5);
    var grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.translateX(baseX);
    grass.translateY(baseY);
    grass.translateZ(baseZ);
    scene.add(grass);
}

function drawSecondFloor(baseX, baseY, baseZ) {
    drawLivingRoom(baseX, baseY, baseZ);
    drawBalcony(baseX + 6.5, baseY, baseZ - 1.8);
    drawCourtyard(baseX + 6.5, baseY, baseZ - 7);
    drawDiningRoom(baseX + 6.5, baseY, baseZ - 11);
    drawKitchen(baseX + 6.5, baseY, baseZ - 15);
    drawStore(baseX + 6.5, baseY, baseZ - 20);
    drawWetKitchen(baseX + 5, baseY, baseZ - 20);
    drawBedroom(baseX - 4, baseY, baseZ - 13);
}
function drawRoof(baseX, baseY, baseZ) {
    drawCubes(baseX, baseY, baseZ);
    drawWestRoof(baseX, baseY, baseZ);
    drawEastRoof(baseX + 5, baseY, baseZ);
}
function drawFence(baseX, baseY, baseZ, isNorth) {
    const pyramidGeometry = new THREE.BufferGeometry();
    var vertices = [];
    if(isNorth) {
        vertices = new Float32Array([
            // base
            -0.25, 0, -0.05,
            0.25, 0, -0.05,
            0.25, 0, 0.05,
            -0.25, 0, 0.05,
            // top
            0, 0.5, 0
        ]);
    } else {
        vertices = new Float32Array([
            // base
            -0.05, 0, -0.25,
            0.05, 0, -0.25,
            0.05, 0, 0.25,
            -0.05, 0, 0.25,
            // top
            0, 0.5, 0
        ]);
    }
    const pyramidIndices = new Uint16Array([
    // base
    0, 1, 2,
    0, 2, 3,
    // sides
    0, 4, 1,
    1, 4, 2,
    2, 4, 3,
    3, 4, 0
    ]);
    const pyramidMaterial = new THREE.MeshBasicMaterial({ color: 0x999D71 });
    pyramidGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    pyramidGeometry.setIndex(new THREE.BufferAttribute(pyramidIndices, 1));
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramid.translateX(baseX);
    pyramid.translateY(baseY);
    pyramid.translateZ(baseZ);
    scene.add(pyramid);

    if(isNorth) {
        var postGeometry = new THREE.BoxGeometry(0.5, 2, 0.1);
    } else {
        var postGeometry = new THREE.BoxGeometry(0.1, 2, 0.5);
    }
    var post = new THREE.Mesh(postGeometry, wood_material);
    post.translateX(baseX);
    post.translateY(baseY - 1);
    post.translateZ(baseZ);
    scene.add(post);
}
  
function drawGarage(baseX, baseY, baseZ) {
    var material = new THREE.MeshLambertMaterial({ color: 0x9B9B9B });
    var topGeometry = new THREE.BoxGeometry(0.5, 1, 4.2);
    var bottom = new THREE.Mesh(topGeometry, material);
    bottom.translateX(baseX);
    bottom.translateY(baseY - 2.5);
    bottom.translateZ(baseZ);

    var pillarGeometry = new THREE.BoxGeometry(0.5, 4.1, 0.5);
    var pillar1 = new THREE.Mesh(pillarGeometry, material);
    var pillar2 = new THREE.Mesh(pillarGeometry, material);
    var pillar3 = new THREE.Mesh(pillarGeometry, material);
    var pillar4 = new THREE.Mesh(pillarGeometry, material);
    pillar1.translateX(baseX);
    pillar1.translateY(baseY);
    pillar1.translateZ(baseZ + 2);
    pillar2.translateX(baseX);
    pillar2.translateY(baseY);
    pillar2.translateZ(baseZ);
    pillar3.translateX(baseX);
    pillar3.translateY(baseY);
    pillar3.translateZ(baseZ - 2);
    pillar4.translateX(baseX - 6);
    pillar4.translateY(baseY);
    pillar4.translateZ(baseZ + 3.5);

    var roofMaterial = new THREE.MeshLambertMaterial({ color: 0x00000 });
    var roofGeometry = new THREE.BoxGeometry(8, 0.2, 6);
    var roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.translateX(baseX - 2);
    roof.translateY(baseY + 2);
    roof.translateZ(baseZ);

    scene.add(bottom);
    scene.add(pillar1);
    scene.add(pillar2);
    scene.add(pillar3);
    scene.add(pillar4);
    scene.add(roof);

    const car = makeCar(baseX - 3.5, baseY - 1.5, baseZ, 0x003d80);
    scene.add(car);
}
function drawLivingRoom(baseX, baseY, baseZ) { 
    // Wall: South
    var wall_south = new THREE.Mesh(
        new THREE.BoxGeometry(8, 4.2, 0.2),
        material
    );
    wall_south.updateMatrix();
    const window_south_1 = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2, 0.2)
    );
    window_south_1.translateX(2);
    window_south_1.updateMatrix();
    const window_south_2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2, 0.2)
    );
    window_south_2.translateX(-2.5);
    window_south_2.updateMatrix();
    const wall_south_1 = CSG.subtract(wall_south, window_south_1);
    const wall_south_final = CSG.subtract(wall_south_1, window_south_2);
    const window_south_1_final = CSG.intersect(wall_south, window_south_1);
    window_south_1_final.material = window_material;
    const window_south_2_final = CSG.intersect(wall_south, window_south_2);
    window_south_2_final.material = window_material;

    window_south_1_final.translateX(baseX);
    window_south_1_final.translateY(baseY);
    window_south_1_final.translateZ(baseZ);
    window_south_2_final.translateX(baseX);
    window_south_2_final.translateY(baseY);
    window_south_2_final.translateZ(baseZ);
    wall_south_final.translateX(baseX);
    wall_south_final.translateY(baseY);
    wall_south_final.translateZ(baseZ - 0.1);

    // Wall: North
    var wall_north = new THREE.Mesh(
        new THREE.BoxGeometry(8, 4.2, 0.2),
        material
    );
    var door_north = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 4, 0.2)
    );
    door_north.translateX(3);
    door_north.translateY(-1);
    door_north.updateMatrix();
    const wall_north_final = CSG.subtract(wall_north, door_north);
    wall_north_final.translateX(baseX);
    wall_north_final.translateY(baseY);
    wall_north_final.translateZ(baseZ - 5.7);

    // Wall: East
    var wall_east = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 4.2, 5.8),
        material
    );
    wall_east.translateX(baseX + 4);
    wall_east.translateY(baseY);
    wall_east.translateZ(baseZ + -2.9);

    // Wall: West
    var wall_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 4.2, 5.8),
        material
    );
    wall_west.updateMatrix();
    const window_west_1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 2, 1)
    );
    window_west_1.translateZ(-2);
    window_west_1.updateMatrix();
    const window_west_2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 2, 1)
    );
    window_west_2.translateZ(2);
    window_west_2.updateMatrix();
    const wall_west1 = CSG.subtract(wall_west, window_west_1);
    const wall_west_final = CSG.subtract(wall_west1, window_west_2);
    wall_west_final.translateX(baseX - 4);
    wall_west_final.translateY(baseY);
    wall_west_final.translateZ(baseZ + -2.9);
    
    const window_west_1_final = CSG.intersect(wall_west, window_west_1);
    window_west_1_final.translateX(baseX - 4);
    window_west_1_final.translateY(baseY);
    window_west_1_final.translateZ(baseZ + -2.9);
    window_west_1_final.material = window_material;
    const window_west_2_final = CSG.intersect(wall_west, window_west_2);
    window_west_2_final.translateX(baseX - 4);
    window_west_2_final.translateY(baseY);
    window_west_2_final.translateZ(baseZ + -2.9);
    window_west_2_final.material = window_material;
        
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.1, 5.8),
        material
    );
    floor.translateX(baseX);
    floor.translateY(baseY - 2);
    floor.translateZ(baseZ - 3);
    
    scene.add(floor);
    scene.add(wall_south_final);
    scene.add(wall_north_final);
    scene.add(wall_east);
    scene.add(wall_west_final);
    scene.add(window_west_1_final);
    scene.add(window_west_2_final);
    scene.add(window_south_1_final);
    scene.add(window_south_2_final);

    const sofa = makeSofa(baseX - 3, baseY - 2, baseZ - 3.8);
    sofa.rotation.y = 30;
    scene.add(sofa);

    const TV = makeTV(baseX - 3.5, baseY - 1, baseZ + 3.25, 2, 2, 0.1, 0.8, 0.8, 0.3);
    TV.rotation.y = 30;
    scene.add(TV);
}
function drawFamilyLivingRoom(baseX, baseY, baseZ) {
    // Wall: South
    var wall_south = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 4.2, 0.2),
        material
    );
    wall_south.updateMatrix();
    const window_south = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 2, 0.2)
    );
    window_south.updateMatrix();
    const wall_south_final = CSG.subtract(wall_south, window_south);
    const window_south_final = CSG.intersect(wall_south, window_south);
    window_south_final.material = window_material;

    window_south_final.translateX(baseX);
    window_south_final.translateY(baseY);
    window_south_final.translateZ(baseZ);
    wall_south_final.translateX(baseX);
    wall_south_final.translateY(baseY);
    wall_south_final.translateZ(baseZ);

    // Wall: East
    var wall_east = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4.2, 3.8),
        material
    );
    wall_east.updateMatrix();
    const window_east = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 2, 1)
    );
    window_east.updateMatrix();
    const wall_east_final = CSG.subtract(wall_east, window_east);
    const window_east_final = CSG.intersect(wall_east, window_east);
    window_east_final.material = window_material;

    window_east_final.translateX(baseX + 2.5);
    window_east_final.translateY(baseY);
    window_east_final.translateZ(baseZ - 1.9);
    wall_east_final.translateX(baseX + 2.6);
    wall_east_final.translateY(baseY);
    wall_east_final.translateZ(baseZ - 1.9);

    // Wall: North
    var wall_north = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4.2, 0.1),
        material
    ); 
    wall_north.translateX(baseX + 1.6);
    wall_north.translateY(baseY);
    wall_north.translateZ(baseZ - 3.8);

    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(5, 0.1, 5),
        material
    );
    floor.translateX(baseX);
    floor.translateY(baseY - 2);
    floor.translateZ(baseZ - 2.5);

    scene.add(floor);
    scene.add(wall_south_final);
    scene.add(window_south_final);
    scene.add(wall_east_final);
    scene.add(window_east_final);
    scene.add(wall_north);
}
function drawCourtyard(baseX, baseY, baseZ) {
  // Wall: South
    var wall_south = new THREE.Mesh(
        new THREE.BoxGeometry(3.8, 4.2, 0.2),
        material
    );
    wall_south.updateMatrix();
    wall_south.translateX(baseX + 0.6);
    wall_south.translateY(baseY);
    wall_south.translateZ(baseZ);

    // Wall: North
    var wall_north = new THREE.Mesh(
        new THREE.BoxGeometry(3.8, 4.2, 0.2),
        material
    );
    wall_north.updateMatrix();
    wall_north.translateX(baseX + 0.6);
    wall_north.translateY(baseY);
    wall_north.translateZ(baseZ - 2.9);

    // Wall: West
    var wall_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4.2, 2.9),
        material
    );
    wall_west.updateMatrix();
    const window_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 2, 2.2)
    );
    window_west.updateMatrix();
    const wall_west_final = CSG.subtract(wall_west, window_west);
    const window_west_final = CSG.intersect(wall_west, window_west);
    window_west_final.material = window_material;
    wall_west_final.translateX(baseX - 1.25);
    wall_west_final.translateY(baseY);
    wall_west_final.translateZ(baseZ - 1.44);
    window_west_final.translateX(baseX - 1.25);
    window_west_final.translateY(baseY);
    window_west_final.translateZ(baseZ - 1.44);

    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.1, 5),
        material
    );
    floor.translateX(baseX - 3.3);
    floor.translateY(baseY - 2);
    floor.translateZ(baseZ - 0.5);

    for(var i = 0; i < 10; i++) {
        const rail = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 2.9),
            rail_color
        );
        rail.translateX(baseX + 2.4);
        rail.translateY(baseY - 2 + i * 0.4);
        rail.translateZ(baseZ - 1.5);
        scene.add(rail);
    }

    scene.add(floor);
    scene.add(wall_south);
    scene.add(wall_north);
    scene.add(wall_west_final);
    scene.add(window_west_final);
}
function drawDiningRoom(baseX, baseY, baseZ) {
    var wall_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4.2, 3.5),
        material
    );
    wall_west.updateMatrix();
    const window_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 3, 2.2)
    );
    window_west.updateMatrix();
    const wall_west_final = CSG.subtract(wall_west, window_west);
    const window_west_final = CSG.intersect(wall_west, window_west);
    window_west_final.material = window_material;
    wall_west_final.translateX(baseX + 2.5);
    wall_west_final.translateY(baseY);
    wall_west_final.translateZ(baseZ - 0.55);
    window_west_final.translateX(baseX + 2.5);
    window_west_final.translateY(baseY);
    window_west_final.translateZ(baseZ - 0.55);

    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(6.8, 0.1, 3.3),
        material
    );
    floor.translateX(baseX - 1);
    floor.translateY(baseY - 2);
    floor.translateZ(baseZ - 0.5);

    scene.add(floor);

    scene.add(window_west_final);
    scene.add(wall_west_final);
}
function drawKitchen(baseX, baseY, baseZ) {
    // Wall: East
    var wall_east = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4.2, 5),
        kitchen_material
    );
    wall_east.updateMatrix();
    const window_east_2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1.5, 1)
    );
    window_east_2.translateY(0.5);
    window_east_2.updateMatrix();
    const window_east_3 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1, 0.5)
    );
    window_east_3.translateY(1);
    window_east_3.translateZ(-2);
    window_east_3.updateMatrix();
    const wall_east_1 = CSG.subtract(wall_east, window_east_2);
    const wall_east_final = CSG.subtract(wall_east_1, window_east_3);
    const window_east_2_final = CSG.intersect(wall_east, window_east_2);
    const window_east_3_final = CSG.intersect(wall_east, window_east_3);
    window_east_2_final.material = window_material;
    window_east_3_final.material = window_material;

    wall_east_final.translateX(baseX + 2.5);
    wall_east_final.translateY(baseY);
    wall_east_final.translateZ(baseZ - 0.8);
    window_east_2_final.translateX(baseX + 2.5);
    window_east_2_final.translateY(baseY);
    window_east_2_final.translateZ(baseZ - 0.8);
    window_east_3_final.translateX(baseX + 2.5);
    window_east_3_final.translateY(baseY);
    window_east_3_final.translateZ(baseZ - 0.8);

    // Wall: South
    var wall_south = new THREE.Mesh(
        new THREE.BoxGeometry(5, 4.2, 0.1),
        material
    );
    wall_south.updateMatrix();
    const door_south = new THREE.Mesh(
        new THREE.BoxGeometry(1, 3.6, 0.1)
    );
    door_south.translateX(-1.5);
    door_south.translateY(-0.1);
    door_south.updateMatrix();
    const wall_south_final = CSG.subtract(wall_south, door_south);
    wall_south_final.translateX(baseX);
    wall_south_final.translateY(baseY);
    wall_south_final.translateZ(baseZ + 2);

    // Wall: West
    var wall_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4.2, 5.2),
        material
    );
    wall_west.translateX(baseX - 2.45);
    wall_west.translateY(baseY);
    wall_west.translateZ(baseZ - 0.7);

    // Wall: North
    var wall_north = new THREE.Mesh(
        new THREE.BoxGeometry(5, 4.2, 0.1),
        material
    );
    wall_north.updateMatrix();
    const door_north = new THREE.Mesh(
        new THREE.BoxGeometry(1, 3.6, 0.1)
    );
    door_north.translateX(-1.5);
    door_north.translateY(-0.1);
    door_north.updateMatrix();
    const wall_north_final = CSG.subtract(wall_south, door_south);
    wall_north_final.translateX(baseX);
    wall_north_final.translateY(baseY);
    wall_north_final.translateZ(baseZ - 3.4);
    
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.1, 10),
        material
    );
    floor.translateX(baseX - 1);
    floor.translateY(baseY - 2);
    floor.translateZ(baseZ - 2);

    scene.add(floor);

    scene.add(window_east_2_final);
    scene.add(window_east_3_final);
    scene.add(wall_east_final);
    scene.add(wall_south_final);
    scene.add(wall_north_final);
    scene.add(wall_west);
}
function drawStore(baseX, baseY, baseZ) {
    // Wall: East
    var wall_east = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4.2, 3.8),
        material
    );
    wall_east.updateMatrix();
    const window_east = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 3, 1.6)
    );
    window_east.updateMatrix();
    const wall_east_final = CSG.subtract(wall_east, window_east);
    const window_east_final = CSG.intersect(wall_east, window_east);
    window_east_final.material = window_material;
    wall_east_final.translateX(baseX + 2.5);
    wall_east_final.translateY(baseY);
    wall_east_final.translateZ(baseZ - 0.25);
    window_east_final.translateX(baseX + 2.5);
    window_east_final.translateY(baseY);
    window_east_final.translateZ(baseZ - 0.25);

    // Wall: North
    var wall_north = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4.2, 0.1),
        material
    );
    wall_north.translateX(baseX + 1.6);
    wall_north.translateY(baseY);
    wall_north.translateZ(baseZ - 2.17);

    // Wall: West
    var wall_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4.2, 3.8),
        material
    );
    wall_west.updateMatrix();
    const door_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4, 1.6)
    );
    door_west.translateZ(1);
    door_west.updateMatrix();
    const wall_west_final = CSG.subtract(wall_west, door_west);
    const window_west_final = CSG.intersect(wall_west, door_west);
    window_west_final.material = window_material;
    wall_west_final.translateX(baseX + 0.6);
    wall_west_final.translateY(baseY);
    wall_west_final.translateZ(baseZ - 0.3);

    scene.add(window_east_final);
    scene.add(wall_east_final);
    scene.add(wall_north);
    //scene.add(window_west_final);
    scene.add(wall_west_final);
}
function drawWetKitchen(baseX, baseY, baseZ) {
    // Wall: North
    var wall_north = new THREE.Mesh(
        new THREE.BoxGeometry(6, 4.2, 0.1),
        material
    );
    wall_north.updateMatrix();
    var window_north = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 2.5, 0.1),
        window_material
    );
    window_north.translateX(1);
    window_north.updateMatrix();
    const wall_north_final = CSG.subtract(wall_north, window_north);
    const window_north_final = CSG.intersect(wall_north, window_north);
    window_north_final.material = window_material;
    wall_north_final.translateX(baseX);
    wall_north_final.translateY(baseY);
    wall_north_final.translateZ(baseZ - 2.17);
    window_north_final.translateX(baseX);
    window_north_final.translateY(baseY);
    window_north_final.translateZ(baseZ - 2.17);

    // Wall: West
    var wall_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4.2, 3.8),
        material
    );
    wall_west.updateMatrix();
    const door_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4, 1.6)
    );
    door_west.translateZ(1);
    door_west.updateMatrix();
    const wall_west_final = CSG.subtract(wall_west, door_west);
    const window_west_final = CSG.intersect(wall_west, door_west);
    window_west_final.material = window_material;
    wall_west_final.translateX(baseX - 1);
    wall_west_final.translateY(baseY);
    wall_west_final.translateZ(baseZ - 0.3);

    scene.add(wall_north_final)
    scene.add(window_north_final)
    scene.add(wall_west_final)

    
}
function drawStairs(baseX, baseY, baseZ) {
    for(var i = 0; i < 5; i++) {
        var to_west_stairs = new THREE.Mesh(
            new THREE.BoxGeometry(4.2 - i * 0.5, 0.3, 2),
            stair_material
        );
        to_west_stairs.translateX(baseX - 1.9 - i * 0.25);
        to_west_stairs.translateY(baseY - 2.2 + i * 0.3);
        to_west_stairs.translateZ(baseZ + 3.2);
        scene.add(to_west_stairs);
    }
    for(var i = 0; i < 6; i++) {
        var to_north_stairs = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.6, 4.2 - i * 0.5),
            stair_material
        );
        to_north_stairs.translateX(baseX - 3);
        to_north_stairs.translateY(baseY - 1.4 + i * 0.3);
        to_north_stairs.translateZ(baseZ + 1.4 - i * 0.25);
        scene.add(to_north_stairs);
    }
    const north_stair_bottom = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1.4, 4.2),
        stair_material
    );
    north_stair_bottom.translateX(baseX - 3);
    north_stair_bottom.translateY(baseY - 2);
    north_stair_bottom.translateZ(baseZ + 1.4);
    scene.add(north_stair_bottom);
    for(var i = 0; i < 5; i++) {
        var to_east_stairs = new THREE.Mesh(
            new THREE.BoxGeometry(4.2 - i * 0.5, 0.3, 2.2),
            stair_material
        );
        to_east_stairs.translateX(baseX + i * 0.25);
        to_east_stairs.translateY(baseY + 0.5 + i * 0.3);
        to_east_stairs.translateZ(baseZ + 0.4);
        scene.add(to_east_stairs);
    }

    var wall_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 7, 5),
        material
    );
    var window_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 5, 3),
        window_material
    );
    var wall_west_final = CSG.subtract(wall_west, window_west);
    wall_west_final.translateX(baseX - 4);
    wall_west_final.translateY(baseY + 2.4);
    wall_west_final.translateZ(baseZ + 2);
    window_west.translateX(baseX - 4);
    window_west.translateY(baseY + 2.5);
    window_west.translateZ(baseZ + 2);
    scene.add(wall_west_final);
    scene.add(window_west);
}
function drawBedroom(baseX, baseY, baseZ) {
    // Wall: West
    var wall_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 4.2, 6.6),
        material
    );
    wall_west.updateMatrix();
    const window_west = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3, 1.6)
    );
    window_west.updateMatrix();
    const wall_west_final = CSG.subtract(wall_west, window_west);
    const window_west_final = CSG.intersect(wall_west, window_west);
    window_west_final.material = window_material;
    wall_west_final.translateX(baseX);
    wall_west_final.translateY(baseY);
    wall_west_final.translateZ(baseZ - 0.25);
    window_west_final.translateX(baseX);
    window_west_final.translateY(baseY);
    window_west_final.translateZ(baseZ - 0.25);

    // Wall: North
    var wall_north = new THREE.Mesh(
        new THREE.BoxGeometry(6, 4.2, 0.1),
        material
    );
    wall_north.translateX(baseX + 2.9);
    wall_north.translateY(baseY);
    wall_north.translateZ(baseZ - 3.6);

    // Wall: South
    var wall_south = new THREE.Mesh(
        new THREE.BoxGeometry(6, 4.2, 0.1),
        material
    );
    wall_south.translateX(baseX + 2.9);
    wall_south.translateY(baseY);
    wall_south.translateZ(baseZ + 2.3);

    // Wall: East
    var wall_east = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 4.2, 11.5),
        material
    );
    wall_east.updateMatrix();
    const door_east = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3, 1.6)
    );
    door_east.translateZ(2);
    door_east.updateMatrix();
    const wall_east_final = CSG.subtract(wall_east, door_east);
    wall_east_final.translateX(baseX + 6);
    wall_east_final.translateY(baseY);
    wall_east_final.translateZ(baseZ - 3.5);
    wall_east.updateMatrix();
    
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(6, 0.1, 5.9),
        material
    );
    floor.translateX(baseX + 3);
    floor.translateY(baseY - 2);
    floor.translateZ(baseZ - 0.6);

    scene.add(floor);
    scene.add(window_west_final);
    scene.add(wall_west_final);
    scene.add(wall_north);
    scene.add(wall_south);
    scene.add(wall_east_final);
        //width = 100, height = 30, depth = 200, legWidth = 10, legHeight = 30, legDepth = 10, headboardHeight = 50, headboardDepth = 5)
    const bed = makeBed(baseX + 1.8, baseY - 1.3, baseZ - 2, 
        3, 0.3, 2.5, 
        0.1, 0.8, 0.1, 
        1, 0.4);
    scene.add(bed);
}
function drawBalcony(baseX, baseY, baseZ) {
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(5.3, 0.1, 7),
        material
    );
    floor.translateX(baseX);
    floor.translateY(baseY - 2);
    floor.translateZ(baseZ - 1.8);
    scene.add(floor);

    const wooden_wall = new THREE.Mesh(
        new THREE.BoxGeometry(5.3, 4.2, 0.1),
        wood_material
    );
    const wooden_hole = new THREE.Mesh(
        new THREE.BoxGeometry(5, 3.4, 0.1),
    );
    wooden_hole.translateX(-0.8);
    wooden_hole.translateY(-0.5);
    wooden_hole.updateMatrix();
    const wooden_final = CSG.subtract(wooden_wall, wooden_hole);
    wooden_final.translateX(baseX);
    wooden_final.translateY(baseY);
    wooden_final.translateZ(baseZ + 1.7);
    scene.add(wooden_final);
    
    const balcony_south = new THREE.Mesh(
        new THREE.BoxGeometry(5, 1, 0.1),
        material
    );
    balcony_south.translateX(baseX);
    balcony_south.translateY(baseY - 0.7);
    balcony_south.translateZ(baseZ + 1.7);
    scene.add(balcony_south);

    const balcony_east = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1, 6.8),
        material
    );
    balcony_east.translateX(baseX + 2.45);
    balcony_east.translateY(baseY - 0.7);
    balcony_east.translateZ(baseZ - 1.8);
    scene.add(balcony_east);
}
function drawRails(baseX, baseY, baseZ) {
    for(var i = 0; i < 10; i++) {
        const rail = new THREE.Mesh(
            new THREE.BoxGeometry(4.7, 0.1, 0.1),
            rail_color
        );
        rail.translateX(baseX + 0.5);
        rail.translateY(baseY - 2 + i * 0.4);
        rail.translateZ(baseZ - 0.5);
        scene.add(rail);
    }
}
function drawCubes(baseX, baseY, baseZ) {
    var bottom_box = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1, 1),
        outline_color
    );
    bottom_box.updateMatrix();
    bottom_box.translateX(baseX - 3.5);
    bottom_box.translateY(baseY - 6);
    bottom_box.translateZ(baseZ + 0.5);
    scene.add(bottom_box);

    var top_box = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.5, 1),
        outline_color
    );
    top_box.updateMatrix();
    top_box.translateX(baseX - 3.5);
    top_box.translateY(baseY - 2);
    top_box.translateZ(baseZ + 0.5);
    scene.add(top_box);
}
function drawWestRoof(baseX, baseY, baseZ) {
    var roof = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.2, 17),
        outline_color
    );
    roof.translateX(baseX);
    roof.translateY(baseY - 2);
    roof.translateZ(baseZ - 8);
    scene.add(roof);
}
function drawEastRoof(baseX, baseY, baseZ) {
    var roof = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.2, 17),
        outline_color
    );
    roof.translateX(baseX);
    roof.translateY(baseY - 2);
    roof.translateZ(baseZ - 14);
    scene.add(roof);
}
function makeSofa(baseX, baseY, baseZ) {
    const scale = 0.3;
    const seatGeometry = new THREE.BoxGeometry(8 * scale, 2 * scale, 4 * scale);
    const backrestGeometry = new THREE.BoxGeometry(8 * scale, 4 * scale, 1 * scale);
    const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    
    const seatMesh = new THREE.Mesh(seatGeometry, material);
    seatMesh.position.set(baseX, baseY + 1 * scale, baseZ);

    const backrestMesh = new THREE.Mesh(backrestGeometry, material);
    backrestMesh.position.set(baseX, baseY + 3 * scale, baseZ - 1.5 * scale);
    
    const group = new THREE.Group();
    group.add(seatMesh);
    group.add(backrestMesh);

    return group;
}
function makeTV(baseX, baseY, baseZ, width = 40, height = 30, depth = 3, standWidth = 20, standHeight = 10, standDepth = 3) {
    const tvGeometry = new THREE.BoxGeometry(width + 0.8, height + 0.5, depth);
    const screenGeometry = new THREE.PlaneGeometry(width - 2, height - 6);
    const tvMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const screenMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

    const tvMesh = new THREE.Mesh(tvGeometry, tvMaterial);
    tvMesh.position.set(baseX, baseY + height / 2 + 0.5, baseZ);

    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.set(baseX, baseY + height / 2 - 2.5, baseZ + 0.5 * depth + 0.01);

    const standGeometry = new THREE.BoxGeometry(standWidth, standHeight, standDepth);
    const standMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    const standMesh = new THREE.Mesh(standGeometry, standMaterial);
    standMesh.position.set(baseX, baseY + standHeight / 2 - 0.5, baseZ);

    const standBelowGeometry = new THREE.BoxGeometry(standWidth * 2, standHeight, standDepth * 1.5);
    const standBelowMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    const standBelowMesh = new THREE.Mesh(standBelowGeometry, standBelowMaterial);
    standBelowMesh.position.set(baseX, baseY + standHeight / 2 - 1, baseZ);

    const group = new THREE.Group();
    group.add(tvMesh);
    group.add(screenMesh);
    group.add(standMesh);
    group.add(standBelowMesh);

    return group;
}
function makeBed(baseX, baseY, baseZ, width = 100, height = 30, depth = 200, legWidth = 10, legHeight = 30, legDepth = 10, headboardHeight = 50, headboardDepth = 5) {
    const bedGeometry = new THREE.BoxGeometry(width, height, depth);
    const legGeometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const headboardGeometry = new THREE.BoxGeometry(width, headboardHeight, headboardDepth);
    const bedMaterial = new THREE.MeshLambertMaterial({ color: 0x7c0a02 });
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0x4b371c });
    const headboardMaterial = new THREE.MeshLambertMaterial({ color: 0x4b371c });
  
    const bedMesh = new THREE.Mesh(bedGeometry, bedMaterial);
    bedMesh.position.set(baseX, baseY + height / 2, baseZ);
  
    const leg1Mesh = new THREE.Mesh(legGeometry, legMaterial);
    leg1Mesh.position.set(baseX - width / 2 + legWidth / 2, baseY + legHeight / 2 - 0.7, baseZ - depth / 2 + legDepth / 2);
  
    const leg2Mesh = new THREE.Mesh(legGeometry, legMaterial);
    leg2Mesh.position.set(baseX + width / 2 - legWidth / 2, baseY + legHeight / 2 - 0.7, baseZ - depth / 2 + legDepth / 2);
  
    const leg3Mesh = new THREE.Mesh(legGeometry, legMaterial);
    leg3Mesh.position.set(baseX - width / 2 + legWidth / 2, baseY + legHeight / 2 - 0.7, baseZ + depth / 2 - legDepth / 2);
  
    const leg4Mesh = new THREE.Mesh(legGeometry, legMaterial);
    leg4Mesh.position.set(baseX + width / 2 - legWidth / 2, baseY + legHeight / 2 - 0.7, baseZ + depth / 2 - legDepth / 2);
  
    const headboardMesh = new THREE.Mesh(headboardGeometry, headboardMaterial);
    headboardMesh.position.set(baseX, baseY + height / 2 + headboardHeight / 2, baseZ - depth / 2 + headboardDepth / 2);
  
    const group = new THREE.Group();
    group.add(bedMesh);
    group.add(leg1Mesh);
    group.add(leg2Mesh);
    group.add(leg3Mesh);
    group.add(leg4Mesh);
    group.add(headboardMesh);
  
    return group;
}
function makeCar(x, y, z, color) {
        // Car body
    const carBodyGeometry = new THREE.BoxGeometry(3, 1.5, 5);
    const carBodyMaterial = new THREE.MeshLambertMaterial({ color: color });
    const carBodyMesh = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
    carBodyMesh.position.set(x, y + 0.75, z);
    
    // Car hood
    const hoodGeometry = new THREE.BoxGeometry(2.8, 1.5, 4);
    const hoodMaterial = new THREE.MeshLambertMaterial({ color: color });
    const hoodMesh = new THREE.Mesh(hoodGeometry, material);
    hoodMesh.position.set(x, y + 2, z);
    
    // Car wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const frontLeftWheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheelMesh.position.set(x - 0.8, y - 0.5, z - 1);
    const frontRightWheelMesh = frontLeftWheelMesh.clone();
    frontRightWheelMesh.position.set(x - 0.8, y - 0.5, z + 1);
    const rearLeftWheelMesh = frontLeftWheelMesh.clone();
    rearLeftWheelMesh.position.set(x + 0.8, y - 0.5, z - 1);
    const rearRightWheelMesh = frontLeftWheelMesh.clone();
    rearRightWheelMesh.position.set(x + 0.8, y - 0.5, z + 1);
    frontLeftWheelMesh.rotation.z = 80;
    frontRightWheelMesh.rotation.z = 80;
    rearLeftWheelMesh.rotation.z = 80;
    rearRightWheelMesh.rotation.z = 80;
  
    const carMesh = new THREE.Group();
    carMesh.add(carBodyMesh);
    carMesh.add(hoodMesh);
    carMesh.add(frontLeftWheelMesh);
    carMesh.add(frontRightWheelMesh);
    carMesh.add(rearLeftWheelMesh);
    carMesh.add(rearRightWheelMesh);
    
    return carMesh;
  }

function animate() {
     // move the camera based on the pressed keys
     if (moveForward) {
         camera.position.z -= 0.1;
     }
     if (moveBackward) {
         camera.position.z += 0.1;
     }
     if (moveLeft) {
         camera.position.x -= 0.1;
     }
     if (moveRight) {
         camera.position.x += 0.1;
     }
     if (moveUp) {
         camera.position.y += 0.1;
     }
     if (moveDown) {
         camera.position.y -= 0.1;
     }
 
     // render the scene
     renderer.render(scene, camera);
 
     requestAnimationFrame(animate);
} 

/* 
** Keyboard Events
*/
function onKeyDown(event) {
    switch (event.keyCode) {
        case 87: // w
            moveForward = true;
            break;
        case 83: // s
            moveBackward = true;
            break;
        case 65: // a
            moveLeft = true;
            break;
        case 68: // d
            moveRight = true;
            break;
        case 81: // q
            moveUp = true;
            break;
        case 69: // e
            moveDown = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.keyCode) {
        case 87: // w
            moveForward = false;
            break;
        case 83: // s
            moveBackward = false;
            break;
        case 65: // a
            moveLeft = false;
            break;
        case 68: // d
            moveRight = false;
            break;
        case 81: // q
            moveUp = false;
            break;
        case 69: // e
            moveDown = false;
            break;
    }
}

/* 
** Mouse Events
*/
function onMouseMove(event) {
     if (isDragging) {
          var mouseX = event.clientX;
          var mouseY = event.clientY;
          var deltaX = mouseX - prevMouseX;
          var deltaY = mouseY - prevMouseY;
          prevMouseX = mouseX;
          prevMouseY = mouseY;
  
          // rotate the camera based on the mouse movement
          camera.rotation.y -= deltaX * 0.002;
          camera.rotation.x -= deltaY * 0.002;
          camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
      }
 }

 function onMouseDown(event) {
     isDragging = true;
     prevMouseX = event.clientX;
     prevMouseY = event.clientY;
 }
 
 function onMouseUp(event) {
     isDragging = false;
 }
