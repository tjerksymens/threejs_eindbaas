export class Configurator {
    constructor(scene) {
      this.scene = scene;
      this.colorPicker = document.getElementById('colorPicker');
      this.partSelector = document.getElementById('part');
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');
  
      this.parts = [ 
          "inside", 
          "outside_1", 
          "outside_2", 
          "outside_3", 
          "laces", 
          "sole_bottom", 
          "sole_top"
      ];
  
      this.partIndex = 0;
  
      this.colorPicker.addEventListener('input', (e) => {
        e.preventDefault();
        const selectedPart = this.parts[this.partIndex];
        this.updatePartColor(selectedPart, e.target.value);
      });
  
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.partIndex = (this.partIndex + 1) % this.parts.length;
        this.updatePartName();
      });
  
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.partIndex = (this.partIndex - 1 + this.parts.length) % this.parts.length;
        this.updatePartName();
      });
  
      this.updatePartName();
    }
  
    updatePartName() {
      const selectedPart = this.parts[this.partIndex];
      this.partSelector.innerHTML = selectedPart;
    }
  
    updatePartColor(part, color) {
      this.scene.traverse((child) => {
        if (child.isMesh && child.name === part) {
          child.material.color.set(color);
        }
      });
    }
  }
  