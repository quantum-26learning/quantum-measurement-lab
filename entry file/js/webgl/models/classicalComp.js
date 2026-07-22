import * as THREE from 'three';

export default class classicalComputer {

    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(15, -5, 0);
        this.buildclassicalComputer();
    }

    buildclassicalComputer() {
        const geo = new THREE.BoxGeometry(8, 8, 8);
        const mat = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
        // to be replaced
        const cube = new THREE.Mesh(geo, mat);
        this.group.add(cube);
    }
    getGroup(){
        return this.group;
    }
}