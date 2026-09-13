import * as THREE from 'three';
import gsap from 'gsap';

export default class QubitCavity {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(-4.75, -1.85, 0.5);
        this.group.scale.set(0.8, 0.8, 0.8);

        this.buildQubitcavity();
        this.buildSMAConnectors();
    }

    createCavityHalf(material) {
        const halfGroup = new THREE.Group();

        const width = 1.5;
        const length = 3.0;
        const baseThickness = 0.4;
        const faceThickness = 0.6;

        const getBoundary = () => {
            const shape = new THREE.Shape();
            shape.moveTo(-width / 2, -length / 2);
            shape.lineTo(width / 2, -length / 2);
            shape.lineTo(width / 2, length / 2);
            shape.lineTo(-width / 2, length / 2);
            shape.lineTo(-width / 2, -length / 2);
            return shape;
        };

        const baseShape = getBoundary();
        const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
            depth: baseThickness,
            bevelEnabled: false
        });
        const baseMesh = new THREE.Mesh(baseGeo, material);

        const faceShape = getBoundary();
        const slotWidth = 0.35;
        const slotLength = 1.8;
        const slotRadius = slotWidth / 2;
        const slotY = (slotLength - slotWidth) / 2;

        const slotPath = new THREE.Path();
        slotPath.absarc(0, slotY, slotRadius, 0, Math.PI, false);
        slotPath.lineTo(-slotRadius, -slotY);
        slotPath.absarc(0, -slotY, slotRadius, Math.PI, Math.PI * 2, false);
        slotPath.lineTo(slotRadius, slotY);
        faceShape.holes.push(slotPath);

        const holeRadius = 0.08;
        const holeXOffset = 0.55;
        const holeYSpacing = 0.48;

        for (let i = 0; i < 6; i++) {
            const yPos = -1.2 + i * holeYSpacing;

            const leftHole = new THREE.Path();
            leftHole.absarc(-holeXOffset, yPos, holeRadius, 0, Math.PI * 2, false);
            faceShape.holes.push(leftHole);

            const rightHole = new THREE.Path();
            rightHole.absarc(holeXOffset, yPos, holeRadius, 0, Math.PI * 2, false);
            faceShape.holes.push(rightHole);
        }

        const faceGeo = new THREE.ExtrudeGeometry(faceShape, {
            depth: faceThickness,
            bevelEnabled: false
        });
        const faceMesh = new THREE.Mesh(faceGeo, material);
        faceMesh.position.z = baseThickness;

        halfGroup.add(baseMesh, faceMesh);

        const totalThickness = baseThickness + faceThickness;
        halfGroup.children.forEach(child => {
            child.position.z -= totalThickness / 2;
        });

        return halfGroup;
    }

buildTransmonChip() {
        const chipWidth = 0.5;
        const chipHeight = 0.25;
        const chipThickness = 0.02;

        const chipGeo = new THREE.BoxGeometry(chipWidth, chipHeight, chipThickness);
        const chipMat = new THREE.MeshStandardMaterial({
            color: 0x111122, // Dark glossy silicon substrate
            metalness: 0.4,
            roughness: 0.2
        });
        const qubitChip = new THREE.Mesh(chipGeo, chipMat);

        const superconductorMat = new THREE.MeshStandardMaterial({
            color: 0xecf0f1,
            metalness: 1.0,
            roughness: 0.1
        });
        
        // Highlighted Josephson Junction material
        const jjMat = new THREE.MeshStandardMaterial({
            color: 0xff4444, 
            metalness: 0.8,
            emissive: 0x440000
        }); 

        const qubitgrp = new THREE.Group();

        const layerZ = (chipThickness / 2) + 0.001; 

        // 3. Transmon Qubit Capacitor Pads (Two large horizontal rectangles)
        const padWidth = 0.11;
        const padHeight = 0.07;
        const padX = 0;
        
        const padGeo = new THREE.BoxGeometry(padWidth, padHeight, 0.002);
        
        const topPad = new THREE.Mesh(padGeo, superconductorMat);
        topPad.position.set(padX, 0.035, layerZ);
        
        const bottomPad = new THREE.Mesh(padGeo, superconductorMat);
        bottomPad.position.set(padX, -0.045, layerZ);

        // 4. Josephson Junction (Non-linear inductor bridge connecting pads)
        const jjGeo = new THREE.BoxGeometry(0.004, 0.015, 0.003);
        const jj = new THREE.Mesh(jjGeo, jjMat);
        jj.position.set(padX, -0.005, layerZ);

        qubitgrp.add(topPad, bottomPad, jj);
        qubitgrp.rotation.z = Math.PI / 2; 

        qubitChip.add(qubitgrp);

        return qubitChip;
    }
    buildQubitcavity() {
        const copperMaterial = new THREE.MeshStandardMaterial({
            color: 0xb87333,
            metalness: 0.7,
            roughness: 0.2
        });
        const supportGeo = new THREE.BoxGeometry(0.2, 3.5, 0.05);
        const footGeo = new THREE.BoxGeometry(0.45, 0.05, 0.2);

        const leftSupport = new THREE.Mesh(supportGeo, copperMaterial);
        leftSupport.position.set(-0.6, -2, 0.5);
        leftSupport.rotation.y = Math.PI / 2;

        const leftFoot = new THREE.Mesh(footGeo, copperMaterial);
        leftFoot.position.set(-0.4, -3.75, 0.5);

        const rightSupport = new THREE.Mesh(supportGeo, copperMaterial);
        rightSupport.position.set(0.55, -2, 0.5);
        rightSupport.rotation.y = Math.PI / 2;

        const rightFoot = new THREE.Mesh(footGeo, copperMaterial);
        rightFoot.position.set(0.35, -3.75, 0.5);

        const centerSupportGeo = new THREE.BoxGeometry(0.2, 2.5, 0.05);
        const centerSupport = new THREE.Mesh(centerSupportGeo, copperMaterial);
        centerSupport.position.set(0, -1.45, -0.2);
        const centerSupportGeo2 = new THREE.BoxGeometry(0.2, 0.8, 0.05);
        this.centerSupport2 = new THREE.Mesh(centerSupportGeo2, copperMaterial);
        this.centerSupport2.position.set(0, -2, 0.2);

        this.group.add(leftSupport, leftFoot, rightSupport, rightFoot, centerSupport);

        const silverMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.8,
            roughness: 0.3
        });

        this.leftHalf = this.createCavityHalf(silverMaterial);
        this.leftHalf.position.set(0, -2, 0.1);
        this.leftHalf.rotation.y = Math.PI;
        this.leftHalf.rotation.z = Math.PI / 2;
        this.leftHalf.scale.set(0.3, 0.3, 0.2);

        const rightHalf = this.createCavityHalf(silverMaterial);
        rightHalf.position.set(0, -2, -0.1);
        rightHalf.rotation.z = Math.PI / 2;
        rightHalf.scale.set(0.3, 0.3, 0.2);

        // Integrate the detailed transmon circuit here
        const qubitChip = this.buildTransmonChip();

        // The face of the cavity half in local space is at z = 0.5. 
        // We set the chip slightly above it to prevent z-fighting.
        qubitChip.position.set(0, 0, 0.51); 
        
        // Add the chip directly to the stationary right half
        rightHalf.add(qubitChip);
        
        this.group.add(rightHalf);
    }

    buildSMAConnectors() {
        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.85,
            roughness: 0.25
        });
        const silverMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            metalness: 0.8,
            roughness: 0.3
        });

        const dummy = new THREE.Object3D();

        // --- 1. Straight SMA Connectors (Top-Mounted) ---
        const flangeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16); 
        const sBarrelGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.12, 16); 
        const sHexGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.06, 6); 
        const ScrewGeo = new THREE.CylinderGeometry(0.021, 0.021, 0.53, 16);

        const sCount = 2;
        const flangeInstanced = new THREE.InstancedMesh(flangeGeo, goldMaterial, sCount);
        const sBarrelInstanced = new THREE.InstancedMesh(sBarrelGeo, goldMaterial, sCount * 3);
        const sHexInstanced = new THREE.InstancedMesh(sHexGeo, goldMaterial, sCount);
        const ScrewInstanced = new THREE.InstancedMesh(ScrewGeo, silverMaterial, sCount);

        const sPositions = [
            [-0.21, -1.775, 0],
            [0.21, -1.775, 0]
        ];

        let sBarrelIdx = 0;

        for (let i = 0; i < sCount; i++) {
            const [px, py, pz] = sPositions[i];

            dummy.rotation.set(Math.PI / 2, 0, 0);
            dummy.position.set(py + 1.775, px * 1.6 - 2, pz + 0.03);
            dummy.updateMatrix();
            ScrewInstanced.setMatrixAt(i, dummy.matrix);

            dummy.position.set(px, py + 0.01, pz);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            flangeInstanced.setMatrixAt(i, dummy.matrix);

            dummy.position.set(px, py + 0.06, pz);
            dummy.updateMatrix();
            sBarrelInstanced.setMatrixAt(sBarrelIdx++, dummy.matrix);
            
            dummy.position.set(px, py + 0.13, pz);
            dummy.updateMatrix();
            sHexInstanced.setMatrixAt(i, dummy.matrix);

            dummy.rotation.set(Math.PI / 2, 0, 0);
            dummy.position.set(py + 1.775, px * 1.6 - 2, pz + 0.23);
            dummy.updateMatrix();
            sHexInstanced.setMatrixAt(i, dummy.matrix);

            dummy.position.set(px, py + 0.15, pz);
            dummy.updateMatrix();
            sBarrelInstanced.setMatrixAt(sBarrelIdx++, dummy.matrix);

            dummy.position.set(px, py + 0.13, pz + 0.1);
            dummy.rotation.set(Math.PI / 2, 0, 0);
            dummy.updateMatrix();
            sBarrelInstanced.setMatrixAt(sBarrelIdx++, dummy.matrix);
        }

        // --- 2. 90-Degree SMA Connectors (Face-Mounted) ---
        const raHexGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.04, 6);
        const raBarrelGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.22, 16);
        const elbowGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
        const raTubeGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.15, 16);

        const raCount = 4; 
        const raHexInstanced = new THREE.InstancedMesh(raHexGeo, goldMaterial, raCount * 2);
        const raBarrelInstanced = new THREE.InstancedMesh(raBarrelGeo, goldMaterial, raCount * 2);
        const elbowInstanced = new THREE.InstancedMesh(elbowGeo, goldMaterial, raCount);
        const raTubeInstanced = new THREE.InstancedMesh(raTubeGeo, goldMaterial, raCount/2);

        const raPositions = [
            [-0.2, -1.65, 0.2],
            [0.2, -1.65, 0.2],
            [-0.2, -2, 0.2],
            [0.2, -2, 0.2]
        ];

        let raHexIdx = 0;
        let raBarrelIdx = 0;

        for (let i = 0; i < raCount; i++) {
            const [px, py, pz] = raPositions[i];

            dummy.position.set(px, py, pz);
            dummy.rotation.set(Math.PI / 2, 0, 0); 
            dummy.updateMatrix();
            raHexInstanced.setMatrixAt(raHexIdx++, dummy.matrix);

            dummy.position.set(px, py, pz + 0.06);
            dummy.rotation.set(Math.PI / 2, 0, 0);
            dummy.updateMatrix();
            raBarrelInstanced.setMatrixAt(raBarrelIdx++, dummy.matrix);

            if (i >= 2) {
                dummy.position.set(px, py + 0.23, pz + 0.12);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                raTubeInstanced.setMatrixAt(i - 2, dummy.matrix);
            };

            dummy.position.set(px, py, pz + 0.12);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            elbowInstanced.setMatrixAt(i, dummy.matrix);

            dummy.position.set(px, py + 0.06, pz + 0.12);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            raBarrelInstanced.setMatrixAt(raBarrelIdx++, dummy.matrix);

            dummy.position.set(px, py + 0.12, pz + 0.12);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            raHexInstanced.setMatrixAt(raHexIdx++, dummy.matrix);        
        }

        this.smaGroup = new THREE.Group();
        this.smaGroup.add(
            flangeInstanced, sBarrelInstanced, sHexInstanced, ScrewInstanced,
            raHexInstanced, raBarrelInstanced, elbowInstanced, raTubeInstanced
        );
        
        // 3. CREATE THE HINGE PIVOT
        this.chestHinge = new THREE.Group();
        // Position the hinge at the top edge of the front cavity (y = -1.55)
        this.chestHinge.position.set(0, -1.55, 0.1); 

        // Add leftHalf to the hinge and offset it so its global position remains (0, -2, 0.1)
        this.leftHalf.position.set(0, -0.45, 0); 
        this.chestHinge.add(this.leftHalf);

        this.centerSupport2.position.set(0, -0.45, 0.1);
        this.chestHinge.add(this.centerSupport2);

        // Add smaGroup to the hinge and offset it so its global position remains (0, 0, 0)
        this.smaGroup.position.set(0, 1.55, -0.1);
        this.chestHinge.add(this.smaGroup);

        // Finally, add the hinge assembly to the main group
        this.group.add(this.chestHinge);
    }

    // 4. Animate the hinge rotation
    openCavity() {
        if (!this.chestHinge) return;
        
        // Rotate -90 degrees on the X-axis (swings upwards like a chest)
        gsap.to(this.chestHinge.rotation, {
            x: -Math.PI / 2, 
            duration: 1.5,
            ease: "power2.inOut"
        });
    }

    closeCavity() {
        if (!this.chestHinge) return;
        
        gsap.to(this.chestHinge.rotation, {
            x: 0,
            duration: 1.5,
            ease: "power2.inOut"
        });        
    }

    getGroup() {
        return this.group;
    }
}