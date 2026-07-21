import gsap from 'gsap';

// Export state so the main animation loop can read it
export const animationState = {
    isOpen: false,
    closedY: 0,
    openY: -15
};

export function setupButtons(camera, controls) {
    document.getElementById('btn-onetone').addEventListener('click', () => {
        animationState.isOpen = true;
        
        gsap.to(camera.position, {
            x: -5, y: 0, z: 30,
            duration: 1, ease: "power2.inOut"
        });

        gsap.to(controls.target, {
            x: -5, y: 5, z: 10,
            duration: 1, ease: "power2.inOut"
        });
    });

    document.getElementById('btn-twotone').addEventListener('click', () => {
        animationState.isOpen = false;
        
        gsap.to(camera.position, {
            x: -5, y: 20, z: 40,
            duration: 1, ease: "power2.inOut"
        });

        gsap.to(controls.target, {
            x: -5, y: 4, z: 0,
            duration: 1, ease: "power2.inOut"
        });
    });
}