import * as TWEEN from '@tweenjs/tween.js';

export class Configurator {
    constructor(scene) {
        this.scene = scene;
        this.colorContainer = document.getElementById('colorContainer');
        this.partSelector = document.getElementById('part');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');

        this.colors = {
        'White': '#ffffff',
        'Black': '#222222',
        'Purple': '#a16d9a',
        'Pink': '#edc1c2',
        'Orange': '#f7704b',
        'Green': "#30db85",
        };

        this.parts = [
        "outside_1",
        "outside_2",
        "outside_3",
        "inside",
        "laces",
        "sole_bottom",
        "sole_top"
        ];

        this.partIndex = 0;

        this.colorContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-circle')) {
            e.preventDefault();
            const selectedPart = this.parts[this.partIndex];
            const selectedColor = e.target.getAttribute('data-color');
            this.updatePartColor(selectedPart, selectedColor);
        }
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
        this.createColorCircles();
    }

    updatePartName() {
        const selectedPart = this.parts[this.partIndex];
        this.partSelector.innerHTML = selectedPart;

        // Set camera position based on selected part
        this.setCameraView(selectedPart);
    }

    setCameraView(part) {
        const camera = this.scene.camera;
    
        const currentPosition = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };
    
        const targetPosition = {
            x: 0,
            y: 0.7,
            z: -0.5
        };
    
        switch (part) {
            case "outside_1":
                targetPosition.x = 0;
                targetPosition.y = 0.7;
                targetPosition.z = 1.5;
                break;
            case "outside_2":
                targetPosition.x = -1.5;
                targetPosition.y = 0.7;
                targetPosition.z = 0.5;
                break;
            case "outside_3":
                targetPosition.x = -1;
                targetPosition.y = 0.7;
                targetPosition.z = 1;
                break;
            case "inside":
                targetPosition.x = -0.5;
                targetPosition.y = 1.5;
                targetPosition.z = 1;
                break;
            case "laces":
                targetPosition.x = 0.4;
                targetPosition.y = 1;
                targetPosition.z = 1;
                break;
            case "sole_bottom":
                targetPosition.x = -1.7;
                targetPosition.y = 0.3;
                targetPosition.z = -0.5;
                break;
            case "sole_top":
                targetPosition.x = -1;
                targetPosition.y = 0.5;
                targetPosition.z = 1.2;
                break;
        } 
    
        const tween = new TWEEN.Tween(currentPosition)
            .to(targetPosition, 500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                camera.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
                camera.lookAt(0, 0.7, -0.5);
            })
            .start();
    }
    

    updatePartColor(part, color) {
        this.scene.traverse((child) => {
        if (child.isMesh && child.name === part) {
            child.material.color.set(color);
        }
        });
    }

    createColorCircles() {
        Object.entries(this.colors).forEach(([name, color]) => {
            const circle = document.createElement('div');
            circle.className = 'color-circle';
            circle.style.backgroundColor = color;
            circle.setAttribute('data-color', color);
            this.colorContainer.appendChild(circle);
    
            circle.addEventListener('click', (e) => {
                e.preventDefault();
    
                document.querySelectorAll('.color-circle').forEach((otherCircle) => {
                    otherCircle.classList.remove('selected');
                });
    
                circle.classList.add('selected');
    
                const selectedPart = this.parts[this.partIndex];
                const selectedColor = circle.getAttribute('data-color');
                this.updatePartColor(selectedPart, selectedColor);
            });
        });
    }    
}