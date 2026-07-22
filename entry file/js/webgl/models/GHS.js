import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export default class GHS {
    constructor() {
        this.group = new THREE.Group();
        this.group.scale.set(11.7,11.7,9);
        this.group.position.set(-8, 0.8, -13.5);
        this.group.rotation.y = Math.PI;
        this.buildGHS();
    }

    buildGHS() { 

        //materials
        const polishedSteelMaterial = new THREE.MeshStandardMaterial({
            color: 0x28282B,
            metalness: 1,
            roughness: 0.16
        });
        
        const subtleJointMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a3f47, // Dark slate grey for crisp indented structural lines
            metalness: 0.7,
            roughness: 0.4
        });
        
        const screenBezelMaterial = new THREE.MeshStandardMaterial({
            color: 0x9ba5b0,
            metalness: 0.8,
            roughness: 0.28
        });
        
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0xe6eef4,
            roughness: 0.5,
            metalness: 0.1
        });
        
        // --- 5. Canvas Texture Overlay Interface ---
        const statsCanvas = document.createElement('canvas');
        statsCanvas.width = 512;
        statsCanvas.height = 256;
        const ctx = statsCanvas.getContext('2d');
        
        const statsTexture = new THREE.CanvasTexture(statsCanvas);
        const screenDisplayMaterial = new THREE.MeshBasicMaterial({ map: statsTexture });
        
        function renderEmbeddedDisplay(temp, pressure, flow) {
            ctx.fillStyle = '#090e14';
            ctx.fillRect(0, 0, 512, 256);
        
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 8;
            ctx.strokeRect(12, 12, 488, 232);
        
            ctx.fillStyle = '#3498db';
            ctx.font = 'bold 24px "Segoe UI", sans-serif';
            ctx.fillText('CHAMBER TELEMETRY [ACTIVE]', 35, 55);
        
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(35, 75);
            ctx.lineTo(477, 75);
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
            ctx.stroke();
        
            ctx.font = '24px "Courier New", monospace';
           
            ctx.fillStyle = '#7f8c8d';
            ctx.fillText('GAS MATRIX   :', 35, 115);
            ctx.fillStyle = '#e67e22';
            ctx.fillText('He-3 / He-4 Mix', 225, 115);
        
            ctx.fillStyle = '#7f8c8d';
            ctx.fillText('VACUUM PRESS:', 35, 155);
            ctx.fillStyle = '#2ecc71';
            ctx.fillText(pressure + ' mbar', 225, 155);
        
            ctx.fillStyle = '#7f8c8d';
            ctx.fillText('CORE TEMP    :', 35, 195);
            ctx.fillStyle = '#2ecc71';
            ctx.fillText(temp + ' mK', 225, 195);
        
            ctx.fillStyle = '#7f8c8d';
            ctx.fillText('FLOW RATE    :', 35, 230);
            ctx.fillStyle = '#2ecc71';
            ctx.fillText(flow + ' umol/s', 225, 230);
        
            statsTexture.needsUpdate = true;
        }
        
        // --- 6. Curved Corner Box Geometry Generator ---
        function createRoundedBoxGeometry(width, height, depth, radius, bevelSegments) {
            const shape = new THREE.Shape();
            const w = width / 2;
            const d = depth / 2;
            const r = radius;
        
            shape.moveTo(-w + r, -d);
            shape.lineTo(w - r, -d);
            shape.absarc(w - r, -d + r, r, -Math.PI / 2, 0, false);
            shape.lineTo(w, d - r);
            shape.absarc(w - r, d - r, r, 0, Math.PI / 2, false);
            shape.lineTo(-w + r, d);
            shape.absarc(-w + r, d - r, r, Math.PI / 2, Math.PI, false);
            shape.lineTo(-w, -d + r);
            shape.absarc(-w + r, -d + r, r, Math.PI, Math.PI * 1.5, false);
        
            const extrudeSettings = {
                steps: 1,
                depth: height - (r * 2),
                bevelEnabled: true,
                bevelThickness: r,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: bevelSegments,
                curveSegments: 24
            };
        
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            geometry.center();
            geometry.rotateX(Math.PI / 2);
            return geometry;
        }
        
        // --- 7. Building the Hardware Stack Assembly ---
        
        
        const chamberGroup = new THREE.Group();
        this.group.add(chamberGroup);
        
        const curveRadius = 0.035;
        const segmentSmoothness = 8;
        
        // BLOCK 1: Top Cap Housing (Stainless Steel)
        const capGeo = createRoundedBoxGeometry(0.7, 0.24, 0.7, curveRadius, segmentSmoothness);
        const capMesh = new THREE.Mesh(capGeo, polishedSteelMaterial);
        capMesh.position.y = 0.53;
        chamberGroup.add(capMesh);
        
        // SEAM LINE 1: Recessed Joint Line
        const joint1Geo = createRoundedBoxGeometry(0.69, 0.01, 0.69, curveRadius, segmentSmoothness);
        const joint1 = new THREE.Mesh(joint1Geo, subtleJointMaterial);
        joint1.position.y = 0.405;
        chamberGroup.add(joint1);
        
        // BLOCK 3: Central Core Module (Stainless Steel Base)
        const centerSteelGeo = createRoundedBoxGeometry(0.7, 1.1, 0.7, curveRadius, segmentSmoothness);
        const centerSteelMesh = new THREE.Mesh(centerSteelGeo, polishedSteelMaterial);
        centerSteelMesh.position.y = -0.18;
        chamberGroup.add(centerSteelMesh);
        
        // SEAM LINE 3: Recessed Joint Line
        const joint3Geo = createRoundedBoxGeometry(0.69, 0.01, 0.69, curveRadius, segmentSmoothness);
        const joint3 = new THREE.Mesh(joint3Geo, subtleJointMaterial);
        joint3.position.y = -0.49;
        chamberGroup.add(joint3);
        
        // SEAM LINE 4: Recessed Joint Line
        const joint4Geo = createRoundedBoxGeometry(0.59, 0.01, 0.59, curveRadius, segmentSmoothness);
        const joint4 = new THREE.Mesh(joint4Geo, subtleJointMaterial);
        joint4.position.y = -0.645;
        chamberGroup.add(joint4);
        
        //lower footing
        function createQuantumFridgeStand() {
        // 1. Materials
            const plateMaterial = new THREE.MeshStandardMaterial({
                color: 0x111111,
                roughness: 0.5,
                metalness: 0.6
            });
        
            // Giving the feet a metallic steel look so they pop against the black plate
            const footMaterial = new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                roughness: 0.2,
                metalness: 0.9
            });
        
            // 2. Base Plate (The main parent Mesh)
            const plateWidth = 0.65;
            const plateDepth = 0.65;
            const plateThickness = 0.02;
        
            const plateGeo = new THREE.BoxGeometry(plateWidth, plateThickness, plateDepth);
            const basePlate = new THREE.Mesh(plateGeo, plateMaterial);
        
            // 3. Foot Component Dimensions
            const shaftRadius = 0.015;
            const shaftHeight = 0.15;
           
            // The magic numbers for the "curved outward" flare effect
            const footBaseRadiusTop = 0.015;   // Matches the shaft
            const footBaseRadiusBottom = 0.06; // Widens out significantly at the floor
            const footBaseHeight = 0.03;
        
            // Geometries
            const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftHeight, 16);
            const flaredBaseGeo = new THREE.CylinderGeometry(footBaseRadiusTop, footBaseRadiusBottom, footBaseHeight, 24);
        
            // Coordinate positions near the 4 corners
            const edgeOffset = 0.1;
            const legX = plateWidth / 2 - edgeOffset;
            const legZ = plateDepth / 2 - edgeOffset;
        
            const footPositions = [
                { x:  legX, z:  legZ },
                { x: -legX, z:  legZ },
                { x:  legX, z: -legZ },
                { x: -legX, z: -legZ }
            ];
        
            // 4. Construct and attach the feet directly to the basePlate
            footPositions.forEach(pos => {
                // The wide flared bottom pad
                const footBase = new THREE.Mesh(flaredBaseGeo, footMaterial);
                footBase.position.set(
                    pos.x,
                    -0.14,
                    pos.z
                );
                basePlate.add(footBase);
        
                // The narrow vertical stem sitting on top of the flare
                const shaft = new THREE.Mesh(shaftGeo, footMaterial);
                shaft.position.set(
                    pos.x,
                    -0.07,
                    pos.z
                );
                basePlate.add(shaft);
            });
            this.group.add(basePlate);
            basePlate.position.y = -0.6;
            return basePlate; // Returns a single THREE.Mesh
        }
        createQuantumFridgeStand.call(this);
        
        // C. Front Panel Instrumentation Display
        const screenEnclosureGeo = createRoundedBoxGeometry(0.56, 0.34, 0.02, 0.01, 3);
        const screenEnclosure = new THREE.Mesh(screenEnclosureGeo, screenBezelMaterial);
        screenEnclosure.position.set(0, -0.145, 0.36);
        chamberGroup.add(screenEnclosure);
        
        const displayScreenGeo = new THREE.PlaneGeometry(0.53, 0.31);
        const displayScreen = new THREE.Mesh(displayScreenGeo, screenDisplayMaterial);
        displayScreen.position.set(0, -0.145, 0.372);
        chamberGroup.add(displayScreen);
        
        // --- 7.5 Added Details: Handle & Data Ports ---
        
        // A. The Handle (Bluefors Style)
        const handleGroup = new THREE.Group();
        handleGroup.position.y = 0.35;
        handleGroup.position.x = 0.03;
        
        
        // The blue vertical grip
        const gripGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 16);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a5b8c, // Blue matching the reference image
            metalness: 0.4,
            roughness: 0.6
        });
        const grip = new THREE.Mesh(gripGeo, handleMaterial);
        grip.position.set(-0.32, -0.145, 0.40);
        
        // The black mounting brackets connecting grip to chassis
        const mountGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.05, 16);
        const mountMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.3
        });
        
        const topMount = new THREE.Mesh(mountGeo, mountMat);
        topMount.rotation.x = Math.PI / 2;
        topMount.position.set(-0.32, -0.045, 0.375);
        
        const bottomMount = new THREE.Mesh(mountGeo, mountMat);
        bottomMount.rotation.x = Math.PI / 2;
        bottomMount.position.set(-0.32, -0.245, 0.375);
        
        handleGroup.add(grip);
        handleGroup.add(topMount);
        handleGroup.add(bottomMount);
        chamberGroup.add(handleGroup);
        
        
        // B. Vacuum & RF Wiring Ports (Bottom Left)
        const portsGroup = new THREE.Group();
        
        // Outer dark bezel for the port
        const portBaseGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.01, 32);
        const portBaseMat = new THREE.MeshStandardMaterial({
            color: 0x1a1c1e,
            metalness: 0.9,
            roughness: 0.2
        });
        
        // Inner metallic connector for wires
        const portInnerGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.012, 32);
        const portInnerMat = new THREE.MeshStandardMaterial({
            color: 0xdcdfe5,
            metalness: 1.0,
            roughness: 0.1
        });
        
        // The glowing blue ring to match the active state in your first image
        const glowRingGeo = new THREE.TorusGeometry(0.018, 0.002, 8, 24);
        const glowRingMat = new THREE.MeshBasicMaterial({ color: 0x3498db });
        
        const numPorts = 5;
        const startY = -0.38; // Starts right below the screen
        const spacingY = 0.07;
        
        for (let i = 0; i < numPorts; i++) {
            const singlePortGroup = new THREE.Group();
        
            const base = new THREE.Mesh(portBaseGeo, portBaseMat);
            base.rotation.x = Math.PI / 2;
        
            const inner = new THREE.Mesh(portInnerGeo, portInnerMat);
            inner.rotation.x = Math.PI / 2;
            inner.position.z = 0.002; // Protrudes slightly from base
        
            singlePortGroup.add(base);
            singlePortGroup.add(inner);
        
            // Add the blue glow and a subtle light to the top two ports
            if (i < 2) {
                const glow = new THREE.Mesh(glowRingGeo, glowRingMat);
                glow.position.z = 0.005;
                singlePortGroup.add(glow);
        
                // Add a tiny point light so the glowing ports actually cast light on the chassis
                const portLight = new THREE.PointLight(0x3498db, 0.6, 0.3);
                portLight.position.z = 0.02;
                singlePortGroup.add(portLight);
            }
        
            // Position left of center, cascading downwards
            singlePortGroup.position.set(-0.3, startY - (i * spacingY), 0.352);
            portsGroup.add(singlePortGroup);
        }
        
        chamberGroup.add(portsGroup);
        
        chamberGroup.position.set(0, 0.1, 0);
        
        // --- 8. Data Automation Feedback Clock Loop ---
        function updateHardwareFeeds() {
            const currentTemp = (9.76 + Math.random() * 0.15).toFixed(2);
            const currentPressure = (1.18 + Math.random() * 0.03).toFixed(2) + 'e-6';
            const currentFlow = (41.9 + Math.random() * 0.5).toFixed(1);
        
            renderEmbeddedDisplay(currentTemp, currentPressure, currentFlow);
        }
        
        updateHardwareFeeds();
        setInterval(updateHardwareFeeds, 1000);
        
        
        //dewar
        
        function createDewar() {
            const dewar = new THREE.Group();
            const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xFAF9F6, roughness: 0.5, metalness: 0.3 });
        
            // 1. Main Body: LatheGeometry maps the exact ribs and shoulder curve
            const points = [];
           
            // Base
            points.push(new THREE.Vector2(0, 0));
            points.push(new THREE.Vector2(9, 0));
            points.push(new THREE.Vector2(10, 1));
           
            // Lower Body & Rib 1
            points.push(new THREE.Vector2(10, 4));
            points.push(new THREE.Vector2(9.6, 4.2)); // groove inward
            points.push(new THREE.Vector2(9.6, 4.8));
            points.push(new THREE.Vector2(10, 5));
        
            // Mid Body & Rib 2
            points.push(new THREE.Vector2(10, 10));
            points.push(new THREE.Vector2(9.6, 10.2));
            points.push(new THREE.Vector2(9.6, 10.8));
            points.push(new THREE.Vector2(10, 11));
        
            // Upper Body & Rib 3
            points.push(new THREE.Vector2(10, 16));
            points.push(new THREE.Vector2(9.6, 16.2));
            points.push(new THREE.Vector2(9.6, 16.8));
            points.push(new THREE.Vector2(10, 17));
        
            // Domed Shoulder curving inward to the neck
            points.push(new THREE.Vector2(10, 22));
            for (let i = 1; i <= 12; i++) {
                const t = i / 12;
                // Elliptical curve for the shoulder
                const r = 2.5 + 7.5 * Math.cos(t * Math.PI / 2);
                const y = 22 + 6 * Math.sin(t * Math.PI / 2);
                points.push(new THREE.Vector2(r, y));
            }
        
            // Neck
            points.push(new THREE.Vector2(2.5, 30));
        
            const bodyGeo = new THREE.LatheGeometry(points, 32);
            const body = new THREE.Mesh(bodyGeo, whiteMaterial);
            dewar.add(body);
        
            // 2. Handles: ExtrudeGeometry (pulling a 2D grip outward)
            const handleProfile = new THREE.Shape();
            handleProfile.moveTo(-2, 0);
            handleProfile.lineTo(-1.5, 4);
            handleProfile.lineTo(1.5, 4);
            handleProfile.lineTo(2, 0);
            handleProfile.lineTo(1, 0);
            handleProfile.lineTo(0.5, 2.5);
            handleProfile.lineTo(-0.5, 2.5);
            handleProfile.lineTo(-1, 0);
        
            const handleGeo = new THREE.ExtrudeGeometry(handleProfile, {
                depth: 1.5,
                bevelEnabled: true,
                bevelThickness: 0.2,
                bevelSize: 0.2,
                bevelSegments: 2
            });
            handleGeo.translate(0, 0, -0.75); // Center the extrusion
        
            const leftHandle = new THREE.Mesh(handleGeo, whiteMaterial);
            leftHandle.position.set(-7.5, 24, 0);
            leftHandle.rotation.z = Math.PI / 5.5; // Angle flush with the shoulder
        
            const rightHandle = new THREE.Mesh(handleGeo, whiteMaterial);
            rightHandle.position.set(7.5, 24, 0);
            rightHandle.rotation.z = -Math.PI / 5.5;
        
            dewar.add(leftHandle, rightHandle);
        
            // 3. Blue Cap
            const capMaterial = new THREE.MeshBasicMaterial({ color: 0x1c3a76 });
            const capShape = new THREE.Shape();
            capShape.absarc(0, 0, 3.2, 0, Math.PI * 2, false);
           
            const capGeo = new THREE.ExtrudeGeometry(capShape, { depth: 2, bevelEnabled: false });
            const cap = new THREE.Mesh(capGeo, capMaterial);
            cap.rotation.x = -Math.PI / 2;
            cap.position.set(0, 29, 0);
            dewar.add(cap);
            dewar.scale.set(0.015, 0.015, 0.015);
            dewar.position.set(-0.6,-0.75,0.2)
            this.group.add(dewar);
            return dewar;
        }
        
        createDewar.call(this);
        
        //dewar pipe
        function dewar_pipe_connector() {
            const connector = new THREE.Group();
          const path1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-25, -1.8, 1.95),
            new THREE.Vector3(-25, 1.5, 1.95),
            new THREE.Vector3(-26, 1.5, 1.95)
          ]);
          const path2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-25, -2, 1.95),
            new THREE.Vector3(-25, 0.6, 1.95),
            new THREE.Vector3(-26, 0.6, 1.95)
          ]);
          const geometry1 = new THREE.TubeGeometry(path1, 64, 0.2, 20, false);
          const geometry2 = new THREE.TubeGeometry(path2, 64, 0.2, 20, false);
          const material = new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 });
          const mesh1 = new THREE.Mesh(geometry1, material);
          const mesh2 = new THREE.Mesh(geometry2, material);
          mesh2.position.set(-0.5,0,0);
          mesh1.position.set(0.3,0,0);
          connector.add(mesh1);
          connector.add(mesh2);
        
          const collar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32), new THREE.MeshStandardMaterial({ color: 0xb87333, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 }));
          collar1.position.set(-25.7, 1.5, 1.95);
          collar1.rotation.z = Math.PI / 2;
          connector.add(collar1);
        
          const collar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32), new THREE.MeshStandardMaterial({ color: 0xb87333, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 }));
          collar2.position.set(-26.4, 0.6, 1.95);
          collar2.rotation.z = Math.PI / 2;
          connector.add(collar2);
          connector.position.set(0.65, -0.14, 0.1);
          connector.scale.set(0.05, 0.08, 0.05);
          this.group.add(connector);
          return connector;
        }
        
        dewar_pipe_connector.call(this);
        
        function dewar_pipe() {
            const pipe = new THREE.Group();
          const path1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.63, -0.018, 0.198),
            new THREE.Vector3(-0.8, -0.05, 0.2),
            new THREE.Vector3(-0.8, -0.1, 0.3),
            new THREE.Vector3(-0.7, -0.2, 0.4),
            new THREE.Vector3(-0.5, -0.3, 0.45),
            new THREE.Vector3(-0.3, -0.28, 0.4),
            new THREE.Vector3(-0.31, -0.28, 0.33),
          ]);
          const path2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.66, -0.085, 0.198),
            new THREE.Vector3(-0.8, -0.15, 0.2),
            new THREE.Vector3(-0.8, -0.25, 0.3),
            new THREE.Vector3(-0.7, -0.35, 0.4),
            new THREE.Vector3(-0.5, -0.4, 0.45),
            new THREE.Vector3(-0.3, -0.35, 0.4),
            new THREE.Vector3(-0.31, -0.35, 0.33),
          ]);
          const geometry1 = new THREE.TubeGeometry(path1, 96, 0.01, 20, false);
          const geometry2 = new THREE.TubeGeometry(path2, 96, 0.01, 20, false);
          const material = new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 });
          const mesh1 = new THREE.Mesh(geometry1, material);
          const mesh2 = new THREE.Mesh(geometry2, material);
          pipe.add(mesh1);
          pipe.add(mesh2);
          this.group.add(pipe);
        }
        dewar_pipe.call(this);
        
    }

    getGroup(){
        return this.group;
    }
}