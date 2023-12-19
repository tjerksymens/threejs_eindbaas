import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Shoe } from './classes/Shoe.js';
import { Configurator } from './classes/Configurator';
import * as TWEEN from '@tweenjs/tween.js';

let captureSnapshot = () => {
    const canvasContainer = document.getElementById('canvasContainer');

    // Create a new renderer and set its size
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(1000, 1000);
    renderer.shadowMap.enabled = true;

    // Create a new scene and camera
    const snapshotScene = new THREE.Scene();
    snapshotScene.background = new THREE.Color(0xffffff);
    const snapshotCamera = new THREE.PerspectiveCamera(75, 1000 / 1000, 0.1, 1000);
    snapshotScene.camera = snapshotCamera;

    snapshotCamera.position.set(0, 0.7, 1.5);
    snapshotCamera.lookAt(0, 0.7, -0.5);

    // Clone the objects from the original scene to the snapshot scene
    scene.children.forEach((child) => {
        const clone = child.clone(true);
        snapshotScene.add(clone);
    });
    
    // Set up the renderer for the snapshot scene
    const snapshotCanvas = renderer.domElement;
    canvasContainer.appendChild(snapshotCanvas);

    // Render the snapshot scene
    renderer.render(snapshotScene, snapshotCamera);

    // Get the data URL of the current canvas state
    const dataURL = snapshotCanvas.toDataURL("image/png");

    // Open the data URL in a new tab or window
    const newTab = window.open();
    newTab.document.write(`<img src="${dataURL}" alt="Snapshot" />`);

    // Download the data URL as a file
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'SwearCostomShoeSnapshot.png';
    downloadLink.click();
};

document.getElementById('captureBtn').addEventListener('click', captureSnapshot);

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

const orderBtn = document.getElementById('orderBtn');

orderBtn.addEventListener('click', () => {
    // Get the current configuration
    const currentConfiguration = getCurrentConfiguration();
    console.log(currentConfiguration);
});

function getCurrentConfiguration() {
    const configuration = {};

    // Iterate through all the parts
    configurator.parts.forEach((part) => {
        // Get the current color of the part
        const currentColor = getCurrentColor(part);
        configuration[part] = currentColor;
    });

    return configuration;
};

function getCurrentColor(part) {
    let color;
    scene.traverse((child) => {
      if (child.isMesh && child.name === part) {
        color = child.material.color.getHex();
      }
    });
  
    // Convert the color to hex
    const hexColor = '#' + color.toString(16).padStart(6, '0');
    return hexColor;
  }