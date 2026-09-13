// Handles OrbitControls or camera movement by the user.
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { TrackballControls } from "three/examples/jsm/Addons.js";
import { Vector3 } from "three";

export default class Controls {
    constructor(experience) {

        this.controls = new OrbitControls(
            experience.camera.camera,
            experience.renderer.renderer.domElement
        );
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.075;
        this.controls.enablePan = true;
        this.controls.enableZoom = false;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = (Math.PI/2 - Math.PI/60);
        
        

        this.controls2 = new TrackballControls(
            experience.camera.camera,
            experience.renderer.renderer.domElement
        )
        this.controls2.noRotate = true;
        this.controls2.noPan = true;
        this.controls2.noZoom = false;
        this.controls2.zoomSpeed = 7.5;
        this.controls2.maxDistance = 45;
        this.controls2.minDistance = 0.5;
        
        const minPan = new Vector3(-15, -5, 0);
        const maxPan = new Vector3(15, 10, 0);

        this.controls.addEventListener('change', () => {
            this.controls.target.clamp(minPan, maxPan);
        });
    }

    update() {
        this.controls.update();
        this.controls2.update();
    }
}