// Starts the whole Three.js app and connects scene, camera, renderer, world, controls, and interactions.

// Bloom post-processing
// FPS statistics
// Resize handling. Handles in Experience.js

import * as THREE from "three";
import { createScene } from "./Scene.js";
import Camera from "./camera.js";
import Renderer from "./renderer.js";
import Lights from "./Lights.js";
import Controls from "../interactions/controls.js";
import { addEnvironment } from "./environment.js";
import World from "./World.js";
import Scroll from "../interactions/scroll.js";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap"; // 1. Import GSAP

// 2. Import your menu setup (adjust the path as needed)
import { setupMenuEventListeners } from "../../explorationlab/menu.js";

// 3. Define your target positions (you can also move this to a separate config file)
const CAMERA_TARGETS = {
    'cryostat': { pos: { x: -5, y: 7, z: 20 }, lookAt: { x: -4, y: 2, z: 0 } },
    'plate_50k': { pos: { x: -5, y: 9, z: 7 }, lookAt: { x: -6, y: 9, z: 5 } },
    'plate_4k': { pos: { x: -5, y: 7, z: 7 }, lookAt: { x: -6, y: 7, z: 5 } },
    'still': { pos: { x: -5, y: 5, z: 6 }, lookAt: { x: -6, y: 5, z: 0 } },
    'plate_100mk': { pos: { x: -5, y: 3, z: 6 }, lookAt: { x: -5, y: 3, z: 0 } },
    'mixing_chamber': { pos: { x: -5, y: 0, z: 5 }, lookAt: { x: -5, y: 0, z: 0 } },
    'cavity': { pos: { x: -5, y: -5, z: 5 }, lookAt: { x: -5, y: -3, z: 0 } },
    'qubit': { pos: { x: -4.8, y: -4, z: 0.6 }, lookAt: { x: -4.8, y: -3.5, z: 0 } },
    'ControlRack': { pos: { x: -20, y: 5, z: 30 }, lookAt: { x: -20, y: 5, z: 20 } },
    'Thermometry': { pos: { x: -20, y: 8, z: 15 }, lookAt: { x: -20, y: 8, z: 5 } },
    'Octave': { pos: { x: -21, y: 2.5, z: 15 }, lookAt: { x: -20, y: 4, z: 5 } },
    'OPX': { pos: { x: -21, y: 3.5, z: 15 }, lookAt: { x: -20, y: 5, z: 5 } }, 
    'VNA': { pos: { x: -20, y: 1, z: 15 }, lookAt: { x: -20, y: 1, z: 0 } },
    'GHS': { pos: { x: -5, y: 5, z: -40 }, lookAt: { x: -5, y: 0, z: 0 } },
    'GHU': { pos: { x: -8, y: 2, z: -30 }, lookAt: { x: -8, y: 0, z: 0 } },    
    'Dewar': { pos: { x: -2, y: -3, z: -25 }, lookAt: { x: -2, y: -3, z: 0 } },
    'Compressor': { pos: { x: 8, y: -5, z: -30 }, lookAt: { x: 8, y: -5, z: 0 } },
    'Computer': { pos: { x: 10, y: -2, z: 20 }, lookAt: { x: 10, y: -2, z: 0 } }
};

export default class Experience {
    constructor(canvasWrapper, canvas, scrollTrigger, loadingScreen) {
        this.canvas = canvas;
        this.wrapper = canvasWrapper;
        this.loadingScreen = loadingScreen;

        this.loadingManager = new THREE.LoadingManager(
            () => {
                this.loadingScreen.hide();
            }
        );

        this.scene = createScene();
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);
        addEnvironment(this.scene, this.renderer.renderer);
        this.lights = new Lights(this);
        this.controls = new Controls(this);
        this.world = new World(this, this.loadingManager);

        window.addEventListener('resize', () => {
            this.resize();
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        });

        if (scrollTrigger){
            this.scroll = new Scroll(this);
        }

        // 4. Initialize the menu listeners and bind the zoom method to this class
        setupMenuEventListeners(this.zoomToComponent.bind(this));

        // FIX: Defer the initial update call
        requestAnimationFrame(() => {
            this.update();
        });
    }

    // 5. Add the zoom method
    zoomToComponent(targetId) {
        const targetData = CAMERA_TARGETS[targetId];
        
        if (!targetData) {
            console.warn(`No camera position defined for target: ${targetId}`);
            return;
        }

        // Note: adjust 'this.camera.instance' if your Camera class exposes the Three.js camera differently (e.g., this.camera.camera)
        const threeCamera = this.camera.instance || this.camera.camera;

        // Animate the camera's position
        gsap.to(threeCamera.position, {
            x: targetData.pos.x,
            y: targetData.pos.y,
            z: targetData.pos.z,
            duration: 1.5,
            ease: "power2.inOut"
        });

        // Animate the controls' target (look-at point) simultaneously
        gsap.to(this.controls.controls.target, {
            x: targetData.lookAt.x,
            y: targetData.lookAt.y,
            z: targetData.lookAt.z,
            duration: 1.5,
            ease: "power2.inOut"
        });

        const dilutionRefrigeratorParts = [
                'cryostat', 'plate_50k', 'plate_4k', 
                'still', 'plate_100mk', 'mixing_chamber', 'cavity', 'qubit'
            ];

        if (this.world && this.world.cryoCase) {
            if (dilutionRefrigeratorParts.includes(targetId)) {
                this.world.cryoCase.open();
            } else {
                this.world.cryoCase.close(); 
            }
        }

        if (this.world && this.world.qubitcavity) {
            if (targetId === 'qubit') {
                this.world.qubitcavity.openCavity();
            } else {
                this.world.qubitcavity.closeCavity();
            }
        }
    }

    resize() {
        const width = this.wrapper.getBoundingClientRect().width;
        const height = this.wrapper.getBoundingClientRect().height;
        this.renderer.resize(width, height);
        this.camera.resize(width, height);
    }

    update() {
        const target = this.controls.controls.target;
        this.controls.controls.update();
        
        // This is safe because GSAP is tweening the original target above, 
        // and controls2 naturally follows along in this update loop.
        this.controls.controls2.target.set(target.x, target.y, target.z);
        this.controls.controls2.update();
        
        this.renderer.update();
        requestAnimationFrame(() => this.update());
    }
    
}
