import * as THREE from "three";

export function setupLighting(scene){

    const ambient = new THREE.AmbientLight("#ffffff",1);

    const directional = new THREE.DirectionalLight("#ffffff",1.5);
    directional.position.set(15,20,15);

    scene.add(ambient,directional);

    return {
        ambient,
        directional
    };

}