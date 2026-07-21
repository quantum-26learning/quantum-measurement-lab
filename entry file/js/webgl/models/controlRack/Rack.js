import * as THREE from 'three';
import { Group } from 'three';

export default class Rack{
    constructor(){
        this.group = new Group();
        this.createModel();
    }

    createModel(){
        // --- Materials ---
        const rackFrameMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.4, metalness: 0.2 });
        const railsMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.8 });
        const aluminumExtrusionMat = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.3, metalness: 0.8 });
        const shelfMat = new THREE.MeshStandardMaterial({ color: 0xc2a679, roughness: 0.7 }); // Wooden shelf visible inside
        const baseWheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });


        // Dimensions
        const rackWidth = 0.6;   
        const rackDepth = 0.8;
        const lowerRackHeight = 1.4;
        const upperRackHeight = 0.9;
        const postThickness = 0.04;

// ==========================================
// 1. LOWER ENCLOSED CABINET RACK
// ==========================================
        const lowerRack = new THREE.Group();


// Four Outer Corner Vertical Pillars
        const pillarGeo = new THREE.BoxGeometry(postThickness, lowerRackHeight, postThickness);
        const pillars = [
            { x: -rackWidth/2 + postThickness/2, z: -rackDepth/2 + postThickness/2 },
            { x:  rackWidth/2 - postThickness/2, z: -rackDepth/2 + postThickness/2 },
            { x: -rackWidth/2 + postThickness/2, z:  rackDepth/2 - postThickness/2 },
            { x:  rackWidth/2 - postThickness/2, z:  rackDepth/2 - postThickness/2 }
        ];

        pillars.forEach(p => {
            const pillar = new THREE.Mesh(pillarGeo, rackFrameMat);
            pillar.position.set(p.x, lowerRackHeight / 2, p.z);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            lowerRack.add(pillar);
        });

// Top and Bottom horizontal frame plates
        const topBottomGeo = new THREE.BoxGeometry(rackWidth, postThickness, rackDepth);
        const bottomPlate = new THREE.Mesh(topBottomGeo, rackFrameMat);
        bottomPlate.position.set(0, postThickness / 2, 0);
        lowerRack.add(bottomPlate);

        const topPlate = new THREE.Mesh(topBottomGeo, rackFrameMat);
        topPlate.position.set(0, lowerRackHeight - postThickness / 2, 0);
        lowerRack.add(topPlate);

// Left and Right Side Panel Enclosures
        const sidePanelGeo = new THREE.BoxGeometry(postThickness / 4, lowerRackHeight - postThickness * 2, rackDepth - postThickness * 2);
        const leftSide = new THREE.Mesh(sidePanelGeo, rackFrameMat);
        leftSide.position.set(-rackWidth / 2 + postThickness / 8, lowerRackHeight / 2, 0);
        lowerRack.add(leftSide);

        const rightSide = leftSide.clone();
        rightSide.position.x = rackWidth / 2 - postThickness / 8;
        lowerRack.add(rightSide);

// Internal Perforated Mounting Rails (Front Face Interior)
        const railGeo = new THREE.BoxGeometry(0.02, lowerRackHeight - postThickness * 2, 0.02);
        const leftRail = new THREE.Mesh(railGeo, railsMat);
        leftRail.position.set(-rackWidth / 2 + postThickness + 0.01, lowerRackHeight / 2, rackDepth / 2 - postThickness - 0.01);
        lowerRack.add(leftRail);

        const rightRail = leftRail.clone();
        rightRail.position.x = rackWidth / 2 - postThickness - 0.01;
        lowerRack.add(rightRail);

// Internal Wooden Shelf (Visible in the middle-lower region)
        const shelfGeo = new THREE.BoxGeometry(rackWidth - postThickness * 2, 0.015, rackDepth - postThickness * 2);
        const woodShelf = new THREE.Mesh(shelfGeo, shelfMat);
        woodShelf.position.set(0, 0.33, -0.04);
        const secondWoodShelf = woodShelf.clone()
        secondWoodShelf.position.set(0,0.97,-0.04)
        lowerRack.add(woodShelf);
        lowerRack.add(secondWoodShelf);

// Base Wheels / Casters
        const wheelGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.04, 16);
        const wheelPositions = [
            { x: -rackWidth/2 + 0.05, z: -rackDepth/2 + 0.05 },
            { x:  rackWidth/2 - 0.05, z: -rackDepth/2 + 0.05 },
            { x: -rackWidth/2 + 0.05, z:  rackDepth/2 - 0.05 },
            { x:  rackWidth/2 - 0.05, z:  rackDepth/2 - 0.05 }
        ];
        wheelPositions.forEach(w => {
            const wheel = new THREE.Mesh(wheelGeo, baseWheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(w.x, -0.03, w.z);
            this.group.add(wheel);
        });
        this.group.position.y = 0.05;

// ==========================================
// 2. UPPER OPEN-FRAME ALUMINUM RACK
// ==========================================
        const upperRack = new THREE.Group();
        upperRack.position.y = lowerRackHeight; // Sit directly on top of the lower cabinet
        const aluThickness = 0.03; // Standard aluminum extrusion profile profile width

// 4 Vertical Extrusion Struts
        const upperStrutGeo = new THREE.BoxGeometry(aluThickness, upperRackHeight, aluThickness);
        pillars.forEach(p => {
    // Aligned close to the lower frame profile bounds
            const strut = new THREE.Mesh(upperStrutGeo, aluminumExtrusionMat);
            strut.position.set(p.x, upperRackHeight / 2, p.z);
            upperRack.add(strut);
        });

// Horizontal Extrusion Braces (Top and Bottom boundaries)
        const crossBeamWidthGeo = new THREE.BoxGeometry(rackWidth - aluThickness * 2, aluThickness, aluThickness);
        const crossBeamDepthGeo = new THREE.BoxGeometry(aluThickness, aluThickness, rackDepth - aluThickness * 2);

// Bottom frame lines (sitting right on the cabinet top)
        const rearBottomBeam = new THREE.Mesh(crossBeamWidthGeo, aluminumExtrusionMat);
        rearBottomBeam.position.set(0, aluThickness / 2, -rackDepth / 2 + aluThickness / 2);
        upperRack.add(rearBottomBeam);

        const frontBottomBeam = rearBottomBeam.clone();
        frontBottomBeam.position.z = rackDepth / 2 - aluThickness / 2;
        upperRack.add(frontBottomBeam);

// Top frame lines
        const rearTopBeam = rearBottomBeam.clone();
        rearTopBeam.position.y = upperRackHeight - aluThickness / 2;
        upperRack.add(rearTopBeam);

        const frontTopBeam = frontBottomBeam.clone();
        frontTopBeam.position.y = upperRackHeight - aluThickness / 2;
        upperRack.add(frontTopBeam);

// Side depth connectors (Top and Bottom)
        for (let yPos of [aluThickness / 2, upperRackHeight - aluThickness / 2]) {
            const leftBeam = new THREE.Mesh(crossBeamDepthGeo, aluminumExtrusionMat);
            leftBeam.position.set(-rackWidth / 2 + aluThickness / 2, yPos, 0);
            upperRack.add(leftBeam);

            const rightBeam = leftBeam.clone();
            rightBeam.position.x = rackWidth / 2 - aluThickness / 2;
            upperRack.add(rightBeam);
        }

// Intermediate shelf shelves inside the open frame
        const upperShelfGeo = new THREE.BoxGeometry(rackWidth - aluThickness * 2, 0.01,         rackDepth - aluThickness * 2);
        const upperShelfLayers = [0.25, 0.5, 0.72];

        upperShelfLayers.forEach(heightY => {
            const layerShelf = new THREE.Mesh(upperShelfGeo, aluminumExtrusionMat);
            layerShelf.position.set(0, heightY, 0);
            upperRack.add(layerShelf);
        });

        this.group.add(lowerRack);
        this.group.add(upperRack);
    }
}