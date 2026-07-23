// Creates and adds all quantum lab controlRack into the scene.

import OPX from "./OPX.js";
import Octave from "./Octave.js";
import Rack from "./Rack.js";
import VNA from "./VNA.js";
import ThermometricUnit from "./ThermometricUnit.js";
import Wire from "./Wire.js";

import { Group, Vector3 } from "three";

export default class ControlRack {

    constructor() {
        this.componentSetUp();
        this.wireUpRack();
        this.getGroup();
    }

    componentSetUp(){
        this.controlRack = new Group()
        this.controlRack.scale.set(3.5,3.5,3.5);
        this.controlRack.position.set(-20,-8,5);

        this.opx = new OPX();
        this.opx.group.position.set(0,3.5,0);
        this.opx.group.scale.set(0.45,0.5,0.5)
        this.controlRack.add(this.opx.group);

        this.octave = new Octave();
        this.octave.group.position.set(0,4.05,0 );
        this.octave.group.scale.set(0.4,0.5,0.5);
        this.controlRack.add(this.octave.group);

        this.rack = new Rack();
        this.rack.group.position.set(0,0.1,0);
        this.rack.group.scale.set(4,2.25,2);
        this.controlRack.add(this.rack.group);

        this.vna = new VNA();
        this.vna.group.position.set(0,2.5, 0);
        this.vna.group.scale.set(0.4,0.5,0.5);
        this.controlRack.add(this.vna.group);

        this.resistanceBridge = new ThermometricUnit();
        this.resistanceBridge.group.position.set(0, 4.6,0);
        this.resistanceBridge.group.scale.set(0.055,0.055,0.055);
        this.resistanceBridge.group.rotateX(-Math.PI/180);
        this.controlRack.add(this.resistanceBridge.group);    

    }

    wireUpRack() {
        const rawConnectionPaths = [
            // OPXToOctave 1 - 3(digital)
            [[-0.610, 3.55, 0.68], [-0.520, 3.69, 0.90], [-0.520, 3.89, 0.90], [-0.400, 3.96, 0.68]],
            [[-0.515, 3.55, 0.68], [-0.450, 3.69, 0.90], [-0.450, 3.89, 0.90], [-0.320, 3.96, 0.68]],
            [[-0.425, 3.55, 0.68], [-0.350, 3.69, 0.90], [-0.350, 3.89, 0.90], [-0.240, 3.96, 0.68]],
            
            // OPXToOctave 4I & 4Q 
            [[ 0.110, 3.56, 0.68], [ 0.140, 3.69, 0.90], [ 0.140, 3.89, 0.90], [ 0.080, 4.12, 0.68]],
            [[ 0.110, 3.44, 0.68], [ 0.100, 3.59, 0.90], [ 0.100, 3.79, 0.90], [ 0.080, 3.97, 0.68]],
            
            // OPXToOctave 5I & 5Q
            [[ 0.200, 3.56, 0.68], [ 0.220, 3.69, 0.90], [ 0.220, 3.89, 0.90], [ 0.160, 4.12, 0.68]],
            [[ 0.200, 3.44, 0.68], [ 0.180, 3.59, 0.90], [ 0.180, 3.79, 0.90], [ 0.160, 3.97, 0.68]],
            
            // OPXToOctave 6I & 6Q
            [[ 0.290, 3.56, 0.68], [ 0.320, 3.69, 0.90], [ 0.320, 3.89, 0.90], [ 0.240, 4.12, 0.68]],
            [[ 0.290, 3.44, 0.68], [ 0.270, 3.59, 0.90], [ 0.270, 3.79, 0.90], [ 0.240, 3.97, 0.68]],
            
            // OctaveToOPX & OPXToOctave
            [[ 0.789, 3.44, 0.68], [ 0.750, 3.59, 0.90], [ 0.750, 3.79, 0.90], [ 0.800, 3.97, 0.68]],
            [[ 0.789, 3.56, 0.68], [ 0.850, 3.69, 0.90], [ 0.850, 3.89, 0.90], [ 0.800, 4.12, 0.68]]
        ];

        this.wires = [];

        rawConnectionPaths.forEach((pathPoints) => {
            const vectorPath = pathPoints.map(([x, y, z]) => new Vector3(x, y, z));
            
            const wire = new Wire(vectorPath);
            this.wires.push(wire);
            this.controlRack.add(wire.group);
        });
    }


    getGroup() {
        return this.controlRack;
    }

}