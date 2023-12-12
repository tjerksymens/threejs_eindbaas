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

        switch (part) {
        case "outside_1":
            camera.position.set(0, 0.7, 1.5);
            camera.lookAt(0, 0.7, -0.5);
            break;
        case "outside_2":
            camera.position.set(1, 1, -2);
            camera.lookAt(0, 0.7, -0.5);
            break;
        case "outside_3":
            camera.position.set(-1, 0.7, 1);
            camera.lookAt(0, 0.7, -0.5);
            break;
        case "inside":
            camera.position.set(-0.5, 1.5, 1);
            camera.lookAt(0, 0.6, -0.2);
            break;
        case "laces":
            camera.position.set(0.4, 1, 1);
            camera.lookAt(0, 0.7, -0.5);
            break;
        case "sole_bottom":
            camera.position.set(-1.7, 0.3, -0.5);
            camera.lookAt(0, 0.7, -0.5);
            break;
        case "sole_top":
            camera.position.set(-1, 0.5, 1.2);
            camera.lookAt(0, 0.7, -0.5);
            break;
        }   
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