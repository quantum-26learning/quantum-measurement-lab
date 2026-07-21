// Adds ambient, directional, and other lights to illuminate the models.

import * as THREE from "three";

export default class Lights {
    constructor(experience) {

        this.scene = experience.scene;
        
        const ambient = new THREE.AmbientLight(0xffffff, 1);
        const directional = new THREE.DirectionalLight(0xffffff, 3);
        directional.position.set(5,5,5);
        const point = new THREE.PointLight(0xffffff, 5);
        point.position.set(0,0,4);

        this.scene.add(
            ambient,
            directional,
            point
        );
    }
}