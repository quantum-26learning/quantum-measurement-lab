import * as THREE from 'three';

export default class Platform {
    constructor() {
        this.group = new THREE.Group();
        this.buildPlatform();
    }

    buildPlatform() {
        const floorGeometry = new THREE.PlaneGeometry(200, 200);
        const floorMaterial = new THREE.MeshPhysicalMaterial({ color: 0x1c1c1c, metalness: 1});
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.group.add(floor);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -8;
    }

    getGroup() {
        return this.group;
    }
}