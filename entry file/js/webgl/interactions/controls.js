import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function createControls(camera, renderer) {
    const controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = false;
    controls.dampingFactor = 0.7;

    return controls;
}