import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export class Shoe {
  constructor(scene) {
    this.scene = scene;
    this.loadModel();
  }

  loadModel() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader); // Set DRACOLoader instance
    
    gltfLoader.load("/models/shoe.glb", (gltf) => {
      gltf.scene.position.set(-0.2, 0.5, 0);
      gltf.scene.rotation.y = 1;
      gltf.scene.scale.set(6, 6, 6);

      let shoe = gltf.scene.children[0];

      shoe.traverse((child) => {
        if (child.isMesh) {
          console.log(child.name);
          this.setMeshProperties(child);
        }
      });
      this.scene.add(gltf.scene);
    });
  }

  setMeshProperties(mesh) {
    switch (mesh.name) {
      case "inside":
      case "outside_1":
      case "outside_2":
      case "outside_3":
      case "laces":
      case "sole_bottom":
      case "sole_top":
        mesh.material.color.set("#ffffff");
        break;
    }
    // Set up casting shadows for meshes
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }
  
}