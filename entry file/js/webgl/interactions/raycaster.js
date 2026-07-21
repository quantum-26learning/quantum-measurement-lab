import * as THREE from 'three';
import { displayCoords } from './gui.js'; 

export function setupRaycaster(camera, scene ) {
    // Instantiate these once outside the listener for better performance
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('click', (event) => {
        // 1. Normalize mouse coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 2. Cast the ray
        raycaster.setFromCamera(mouse, camera);

        // 3. Check intersections
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const closestHit = intersects[0];
            const hitPoint = closestHit.point;

            // 4. Update lil-gui coordinates
            displayCoords.x = Number(hitPoint.x.toFixed(2));
            displayCoords.y = Number(hitPoint.y.toFixed(2));
            displayCoords.z = Number(hitPoint.z.toFixed(2));

        }
    });
}