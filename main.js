import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Shoe } from './classes/Shoe.js';
import { Configurator } from './classes/Configurator';
import * as TWEEN from '@tweenjs/tween.js';

const draco = new DRACOLoader();
draco.setDecoderConfig({ type: 'js' });
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.camera = camera;

// Get the canvasContainer div
const canvasContainer = document.getElementById('canvasContainer');

const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.shadowMap.enabled = true;
canvasContainer.appendChild(renderer.domElement);



// Resize function.
resize();
window.addEventListener("resize", resize);
function resize() {
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
}

// GLTF model
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(draco);

// Shoe
const shoe = new Shoe(scene);

// Plane white as floor that receives shadows
const floorGeometry = new THREE.PlaneGeometry(8, 8);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); 
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = 0;
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Configurator
const configurator = new Configurator(scene);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 2, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 5;

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.25;; 

camera.position.y = 0.7;
camera.position.z = 1.5;
camera.lookAt(0, 0.7, -0.5);

controls.target.set(0, 0.7, -0.5);


function animate() {
	requestAnimationFrame( animate );

    TWEEN.update();

	renderer.render( scene, camera );
}

animate();