import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Shoe } from './classes/Shoe.js';
import { Configurator } from './classes/Configurator';

const draco = new DRACOLoader();
draco.setDecoderConfig({ type: 'js' });
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Get the canvasContainer div
const canvasContainer = document.getElementById('canvasContainer');

const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
canvasContainer.appendChild(renderer.domElement);

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// Resize function.
resize();
window.addEventListener("resize", resize);
function resize() {
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
}

//add GLTF model
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(draco);

// Shoe
const shoe = new Shoe(scene);

// Configurator
const configurator = new Configurator(scene);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);


camera.position.z = 2;
camera.position.y = 1;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();