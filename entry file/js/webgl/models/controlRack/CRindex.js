// Creates and adds all quantum lab controlRack into the scene.

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

        this.oscilloscope = new Oscilloscope();
        this.oscilloscope.group.position.set(0,4.9,0.2);
        this.oscilloscope.group.scale.set(0.45,0.4,0.45);
        this.controlRack.add(this.oscilloscope.group)

    }

    wireUpRack() {

        const OPXToOctave = [ 
            new Vector3(0.789, 3.56, 0.68),
            new Vector3(0.850, 3.89, 0.90),
            new Vector3(0.800, 4.12, 0.68) 
            
        ];
        const OctaveToOPX = [
            new Vector3(0.789, 3.44, 0.68), 
            new Vector3(0.750, 3.79, 0.90),
            new Vector3(0.800, 3.97, 0.68),  
        ];

        const OPXToOctace1 = [
            new Vector3(-0.610, 3.55, 0.68),  
            new Vector3(-0.520, 3.89, 0.90),
            new Vector3(-0.400, 3.96, 0.68),
        ]
        const OPXToOctace2 = [
            new Vector3(-0.515, 3.55, 0.68), 
            new Vector3(-0.450, 3.89, 0.90),
            new  Vector3(-0.320, 3.96, 0.68)
        ]
        const OPXToOctace3 = [
            new Vector3(-0.425, 3.55, 0.68),
            new Vector3(-0.350, 3.89, 0.90),
            new Vector3(-0.240, 3.96, 0.68)
        ]
        const OPXToOctace4a = [
            new Vector3(0.110, 3.56, 0.68), 
            new Vector3(0.140, 3.89, 0.90),
            new Vector3(0.080, 4.12, 0.68)
        ]
        const OPXToOctace4b = [
            new Vector3(0.110, 3.44, 0.68), 
            new Vector3(0.100, 3.79, 0.90),
            new Vector3(0.080, 3.97, 0.68)
        ]
        const OPXToOctace5a = [
            new Vector3(0.200, 3.56, 0.68),
            new Vector3(0.220, 3.89, 0.90),
            new Vector3(0.160, 4.12, 0.68)
        ]
        const OPXToOctace5b = [
            new Vector3(0.200, 3.44, 0.68), 
            new Vector3(0.180, 3.79, 0.90),
            new Vector3(0.160, 3.97, 0.68)
        ]
        const OPXToOctace6a = [
            new Vector3(0.290, 3.56, 0.68),
            new Vector3(0.320, 3.89, 0.90), 
            new Vector3(0.240, 4.12, 0.68)
        ]
        const OPXToOctace6b = [
            new Vector3(0.290, 3.44, 0.68),
            new Vector3(0.270, 3.79, 0.90), 
            new Vector3(0.240, 3.97, 0.68)
        ]

        // const OscilloscopeToOPX = [
        //     new Vector3(0.0, 4.99, 0.535),
        //     new Vector3(0.0, 4.99, 0.545),
        //     new Vector3(-0.685, 4.98, 0.60),
        //     new Vector3(-0.685, 4.92, 0.90),
        //     new Vector3(-0.685, 4.16, 0.90),
        //     new Vector3(-0.685, 4.15, 0.72)
        // ]
        // OscilloscopeToOPX,   
        const Connection = [OPXToOctace1, OPXToOctace2, OPXToOctace3, OPXToOctace4a, OPXToOctace4b, OPXToOctace5a, OPXToOctace5b, OPXToOctace6a, OPXToOctace6b, OctaveToOPX, OPXToOctave]

        
        for (let j = 0; j < Connection.length; j++) {
            let wire = new Wire(Connection[j]);
            this.controlRack.add(wire.group);
        }   
    }

    getGroup() {
        return this.controlRack;
    }

}