import * as THREE from "three";
import { RoomEnvironment } from
'three/examples/jsm/environments/RoomEnvironment.js';

export function addEnvironment(scene,renderer){

    const pmrem = new THREE.PMREMGenerator(renderer);

    scene.environment =
        pmrem.fromScene(
            new RoomEnvironment(),
            0.06
        ).texture;
}