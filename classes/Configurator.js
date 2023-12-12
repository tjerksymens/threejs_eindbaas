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
        "inside",
        "outside_1",
        "outside_2",
        "outside_3",
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