// Handles OrbitControls or camera movement by the user.
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class Controls {
    constructor(experience) {

        this.controls = new OrbitControls(
            experience.camera.camera,
            experience.renderer.renderer.domElement
        );
        this.controls.enableDamping = false;
        this.controls.enablePan = true;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = (Math.PI/2 - Math.PI/60);
        this.controls.maxDistance = 100;
        this.controls.minDistance = 5;
        
    }

    update() {
        this.controls.update();
    }
}