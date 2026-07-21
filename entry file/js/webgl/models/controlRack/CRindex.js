// Creates and adds all quantum lab controlRack into the scene.

import * as THREE from "three";
import OPX from "./OPX.js";
import Octave from "./Octave.js";
import Rack from "./Rack.js";
import VNA from "./VNA.js";
import ThermometricUnit from "./ThermometricUnit.js";
import Oscilloscope from "./Oscilloscope.js";
import Wire from "./Wire.js";

import { Group, Vector3 } from "three";

export default class ControlRack {

    constructor() {
        this.componentSetUp();
        this.wireUpRack();
    }

    componentSetUp(){
        this.controlRack = new Group()
        this.controlRack.scale.set(3.5,3.5,3.5);
        this.controlRack.position.set(-20,-7,0);

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
        this.vna.group.position.set(0,1.5, 0);
        this.vna.group.scale.set(0.4,0.5,0.5);
        this.controlRack.add(this.vna.group);

        this.resistanceBridge = new ThermometricUnit();
        this.resistanceBridge.group.position.set(0, 4.6,0);
        this.resistanceBridge.group.scale.set(0.055,0.055,0.055);
        this.controlRack.add(this.resistanceBridge.group);

        this.oscilloscope = new Oscilloscope();
        this.oscilloscope.group.position.set(0,4.9,0.2);
        this.oscilloscope.group.scale.set(0.45,0.4,0.45);
        this.controlRack.add(this.oscilloscope.group)
    }

    wireUpRack() {

        const OPXToOctave = [ 
            new Vector3(0.718, 3.59, 0.72),
            new Vector3(0.718, 3.61, 0.73), 
            new Vector3(0.79, 4.10, 0.75),
            new Vector3(0.79, 4.15, 0.74) 

        ];
        const OctaveToOPX = [
            new Vector3(0.718, 3.40, 0.72), 
            new Vector3(0.718, 3.42, 0.73), 
            new Vector3(0.79, 3.965, 0.75),
            new Vector3(0.79, 3.975, 0.74),  
        ];

        const OPXToOctace1 = [
            new Vector3(-0.795, 3.59, 0.72), 
            new Vector3(-0.795, 3.61, 0.73), 
            new Vector3(-0.480, 3.965, 0.75),
            new Vector3(-0.480, 3.975, 0.74),
        ]
        const OPXToOctace2 = [
            new Vector3(-0.705, 3.59, 0.72),
            new Vector3(-0.705, 3.61, 0.73), 
            new Vector3(-0.400, 3.965, 0.75),
            new  Vector3(-0.400, 3.975, 0.74)
        ]
        const OPXToOctace3 = [
            new Vector3(-0.615, 3.59, 0.72),
            new Vector3(-0.615, 3.61, 0.73), 
            new Vector3(-0.320, 3.965, 0.75),
            new Vector3(-0.320, 3.975, 0.74)
        ]
        const OPXToOctace4a = [
            new Vector3(-0.08, 3.59, 0.72),
            new Vector3(-0.08, 3.61, 0.73), 
            new Vector3(-0.14, 4.14, 0.75),
            new Vector3(-0.14, 4.15, 0.74)
        ]
        const OPXToOctace4b = [
            new Vector3(-0.08, 3.40, 0.72),
            new Vector3(-0.08, 3.42, 0.73), 
            new Vector3(-0.14, 3.965, 0.75),
            new Vector3(-0.14, 3.975, 0.74)
        ]
        const OPXToOctace5a = [
            new Vector3(0.018, 3.59, 0.72),
            new Vector3(0.018, 3.61, 0.73), 
            new Vector3(-0.06, 4.14, 0.75),
            new Vector3(-0.06, 4.15, 0.74)
        ]
        const OPXToOctace5b = [
            new Vector3(0.018, 3.40, 0.72),
            new Vector3(0.018, 3.42, 0.73), 
            new Vector3(-0.06, 3.965, 0.75),
            new Vector3(-0.06, 3.975, 0.74)
        ]
        const OPXToOctace6a = [
            new Vector3(0.108, 3.59, 0.72),
            new Vector3(0.108, 3.61, 0.73), 
            new Vector3(0.02, 4.14, 0.75),
            new Vector3(0.02, 4.15, 0.74)
        ]
        const OPXToOctace6b = [
            new Vector3(0.108, 3.40, 0.72),
            new Vector3(0.108, 3.42, 0.73), 
            new Vector3(0.02, 3.965, 0.75),
            new Vector3(0.02, 3.975, 0.74)
        ]

        const OctaveToRFSwitch1 = [
            new Vector3(-0.480, 4.15, 0.74),
            new Vector3(-0.480, 4.30, 0.75),
            new Vector3(-0.605, 4.30, -0.90),
            new Vector3(-0.605, 4.70, -0.65)   
        ]
        const OctaveToRFSwitch2 = [
            new Vector3(-0.400, 4.15, 0.74),
            new Vector3(-0.400, 4.30, 0.75),
            new Vector3(-0.605, 4.30, -0.90),
            new Vector3(-0.605, 4.60, -0.65)
        ]

        const OctaveToRFSwitch3 = [
            new Vector3(-0.320, 4.15, 0.74),
            new Vector3(-0.320, 4.30, 0.75),
            new Vector3(-0.605, 4.30, -0.90),
            new Vector3(-0.605, 4.50, -0.65)
        ]

        const VNAToRFSwitch1 = [
            new Vector3(-0.645, 1.12, 0.65),
            new Vector3(-0.645, 1.0, 0.75),
            new Vector3(-0.345, 1.08, -0.90),
            new Vector3(-0.345, 4.30, -0.90),
            new Vector3(-0.345, 4.525, -0.65),
        ]
        const VNAToRFSwitch2 = [
            new Vector3(0.245, 1.12, 0.65),
            new Vector3(0.245, 1.0, 0.75),
            new Vector3(0.230, 1.08, -0.90),
            new Vector3(0.230, 4.30, -0.90),
            new Vector3(0.200, 4.525, -0.65),
        ]

        const OscilloscopeToOPX = [
            new Vector3(0.0, 4.99, 0.535),
            new Vector3(0.0, 4.99, 0.545),
            new Vector3(-0.685, 4.98, 0.60),
            new Vector3(-0.685, 4.92, 0.90),
            new Vector3(-0.685, 4.16, 0.90),
            new Vector3(-0.685, 4.15, 0.72)
        ]

        const Connection = [OscilloscopeToOPX, OPXToOctace1, OPXToOctace2, OPXToOctace3, OPXToOctace4a, OPXToOctace4b, OPXToOctace5a, OPXToOctace5b, OPXToOctace6a, OPXToOctace6b, OctaveToOPX, OPXToOctave]

        function getColor(j){
            if (j ==  0){
                return "#02b7db"
            }
            else if(j <=3  & j >= 1 ){
                return "#00ffaa"
            }
        }
        function getThickness(j){
            if (j == 0 ){
                return 0.035
            }
            else if(j>=1){
                return 0.02
            }

        }
        for (let j = 0; j < Connection.length; j++) {
            let wire = new Wire(Connection[j], { 
                color: getColor(j), 
                thickness: getThickness(j) 
            });
            this.controlRack.add(wire.group);
        }

    }

    getGroup() {
        return this.controlRack;
    }

}