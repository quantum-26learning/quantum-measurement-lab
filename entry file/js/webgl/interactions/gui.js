import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const gui = new GUI();

export const displayCoords = {
    x: 0,
    y: 0,
    z: 0
};

const folder = gui.addFolder("Clicked Point");
folder.add(displayCoords, "x").listen().disable();
folder.add(displayCoords, "y").listen().disable();
folder.add(displayCoords, "z").listen().disable();

// You can also export the gui instance if needed elsewhere
export { gui };
