// Creates and manages the main camera.

import * as THREE from "three";

export default class Camera {
    constructor(experience) {       
        this.experience = experience;
        this.width = this.experience.wrapper.getBoundingClientRect().width;
        this.height = this.experience.wrapper.getBoundingClientRect().height;
        this.scene = experience.scene;
        this.camera = new THREE.PerspectiveCamera(45, this.width/this.height, 0.1, 100 );
        this.camera.position.set(-2.5, 7.5, 15);
        this.scene.add(this.camera);
    }

    resize(width, height) {
        this.camera.aspect = width/height;
        this.camera.updateProjectionMatrix();
    }

}