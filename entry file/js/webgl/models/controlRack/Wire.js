import * as THREE from "three";

export default class Wire {

    constructor(cordinateList, options = {}) {
        this.cordinateList = cordinateList;
        this.color = options.color || "#0257db";
        this.thickness = options.thickness || 0.015;
        this.group = new THREE.Group();
        this.createWire();
    }

    createWire() {

        const curve = new THREE.CatmullRomCurve3([
            ...this.cordinateList
        ]);
        const geometry = new THREE.TubeGeometry(curve, 60, this.thickness, 10, false);

        const material = new THREE.MeshStandardMaterial({
            color: this.color,
            roughness: 0.4,
            metalness: 0.1
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.group.add(this.mesh);
    }
}