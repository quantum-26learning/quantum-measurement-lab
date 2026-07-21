// Starts the whole Three.js app and connects scene, camera, renderer, world, controls, and interactions.

// Bloom post-processing
// FPS statistics
// Resize handling. Handles in Experience.js

import { createScene } from "./Scene.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import Lights from "./Lights.js";
import Controls from "../interactions/controls.js";
import { addEnvironment } from "./Environment.js";
import World from "./World.js";
import Scroll from "../interactions/scroll.js";
import ScrollTrigger from "gsap/ScrollTrigger";
import { gui } from "../interactions/gui.js";


export default class Experience {

    constructor(canvasWrapper, canvas) {
        
        this.canvas = canvas;
        this.wrapper = canvasWrapper;
        this.scene = createScene();
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);
        addEnvironment(this.scene, this.renderer.renderer);
        this.lights = new Lights(this);
        this.controls = new Controls(this);
        this.world = new World(this);

        window.addEventListener('resize', ()=>{
            this.resize();
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        })

        this.update();
        this.scroll = new Scroll(this);
    }

    resize() {
        const width = this.wrapper.getBoundingClientRect().width;
        const height = this.wrapper.getBoundingClientRect().height;
        this.renderer.resize(width, height);
        this.camera.resize(width, height);
    }

    update() {
        this.renderer.update();
        this.controls.update();
        requestAnimationFrame(() => this.update());
    }
}