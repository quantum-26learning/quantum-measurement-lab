// Draws the scene onto the canvas every frame.

import {WebGLRenderer} from "three";

export default class Renderer {
    constructor(experience) {
        this.experience = experience;
        this.width = this.experience.wrapper.getBoundingClientRect().width;
        this.height = this.experience.wrapper.getBoundingClientRect().height;
        this.scene = experience.scene;
        this.camera = experience.camera.camera;
        this.renderer = new WebGLRenderer({
            canvas: experience.canvas,
            antialias: true

        });
        this.renderer.setSize(
            this.width, this.height
        );
        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );
    }

    resize(width, height) {
        this.renderer.setSize(
            width, height
        );
        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );
    }

    update() {
        this.renderer.render(
            this.scene,
            this.camera
        );
    }
}