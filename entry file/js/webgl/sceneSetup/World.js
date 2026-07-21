import * as THREE from "three";
import DilutionRefrigerator from "../models/dilutionRefrigerator.js";
import Compressor from "../models/compressor.js";
import GHS from "../models/GHS.js";
import PipeAssembly from "../models/pipeAssembly.js";
import Stand from "../models/stand.js";
import ControlRack from "../models/controlRack/CRindex.js";
import Platform from "../models/Platform.js";


export default class World {
    constructor(experience) {
        this.scene = experience.scene;

        const dilutionRefrigerator = new DilutionRefrigerator();
        this.scene.add(dilutionRefrigerator.getGroup());

        const compressor = new Compressor();
        this.scene.add(compressor.getGroup());

        const ghs = new GHS();
        this.scene.add(ghs.getGroup());

        const pipeAssembly = new PipeAssembly();
        this.scene.add(pipeAssembly.getGroup());

        const stand = new Stand();
        this.scene.add(stand.getGroup());

        const controlRack = new ControlRack();
        this.scene.add(controlRack.getGroup());

        const platform = new Platform();
        this.scene.add(platform.getGroup());
    }
}