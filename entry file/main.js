import "./style.css";
import * as THREE from 'three';
import { gsap } from "gsap";

import { createScene } from "./js/webgl/sceneSetup/scene.js";
import { createCamera } from "./js/webgl/sceneSetup/camera.js";
import { createRenderer } from "./js/webgl/sceneSetup/renderer.js";
import { createControls } from "./js/webgl/interactions/controls.js";
import { setupLighting } from "./js/webgl/sceneSetup/lighting.js";
import { addEnvironment } from "./js/webgl/sceneSetup/environment.js";
import { animationState, setupButtons } from "./js/webgl/interactions/buttons.js";
import { setupRaycaster } from "./js/webgl/interactions/raycaster.js";
import { setupResize } from "./js/webgl/interactions/resize.js";
import { gui } from "./js/webgl/interactions/gui.js";
console.log(gui);

import DilutionRefrigerator from "./js/webgl/models/dilutionRefrigerator.js";
import Compressor from "./js/webgl/models/compressor.js";
import GHS from "./js/webgl/models/GHS.js";
import PipeAssembly from "./js/webgl/models/pipeAssembly.js";
import Platform from "./js/webgl/models/platform.js";
import Stand from "./js/webgl/models/stand.js";

const canvas = document.getElementById("webgl-canvas");

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer(canvas);
const controls = createControls(camera, renderer);

setupLighting(scene);
addEnvironment(scene, renderer);
setupButtons(camera, controls);
setupResize(camera, renderer);


const dilutionRefrigerator = new DilutionRefrigerator();
scene.add(dilutionRefrigerator.getGroup());

const compressor = new Compressor();
scene.add(compressor.getGroup());

const ghs = new GHS();
scene.add(ghs.getGroup());

const pipeAssembly = new PipeAssembly();
scene.add(pipeAssembly.getGroup());

const platform = new Platform();
scene.add(platform.getGroup());

const stand = new Stand();
scene.add(stand.getGroup());

function animate() {
    requestAnimationFrame(animate);

    gsap.updateRoot();

    controls.update();
    renderer.render(scene, camera);
}

animate();