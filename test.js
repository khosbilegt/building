import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

// create a scene
const scene = new THREE.Scene();

// create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

// create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create a ground plane
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// create a house
const houseGeometry = new THREE.BoxGeometry(2, 2, 2);
const houseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const house = new THREE.Mesh(houseGeometry, houseMaterial);
house.position.y = 1;
scene.add(house);

// create a roof
const roofGeometry = new THREE.ConeGeometry(2, 1, 4);
const roofMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 2.5;
roof.rotation.y = Math.PI / 4;
scene.add(roof);

// render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
