import { Group, Mesh, MeshStandardMaterial, BoxGeometry, CanvasTexture, PlaneGeometry, CylinderGeometry, Color, Shape, ExtrudeGeometry} from "three";

export default class ThermometricUnit {
    constructor() {
        this.group = new Group();
        this.interactiveButtons = [];
        this.createModel();
    }

    createModel() {
        const materials = {
            chassis: new MeshStandardMaterial({ color: 0xe2e6e1, roughness: 0.3, metalness: 0.1 }), 
            darkGroove: new MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.7 }),
            bezelFace: new MeshStandardMaterial({ color: 0xb0b4ae, roughness: 0.5 }),
            plateBackground: new MeshStandardMaterial({ color: 0xdcdfdc, roughness: 0.4 }), // Light gray backdrop plates
            displayScreen: new MeshStandardMaterial({ color: 0x010812, roughness: 0.1, emissive: 0x000818 }), 
            
            // Replicating authentic physical rubber/membrane look from images
            buttonGrayLight: new MeshStandardMaterial({ color: 0xe8ebe7, roughness: 0.45, metalness: 0.05 }), // Numeric pad keys
            buttonGrayDark: new MeshStandardMaterial({ color: 0x2d3a4a, roughness: 0.5, metalness: 0.1 }),   // ESCAPE / ENTER
            buttonBlue: new MeshStandardMaterial({ color: 0x7da8d6, roughness: 0.45, metalness: 0.05 }),  // Soft instrument blue keys
            buttonRed: new MeshStandardMaterial({ color: 0xd9533f, roughness: 0.45, metalness: 0.05 }),   // ALL OFF key
            buttonHousing: new MeshStandardMaterial({ color: 0x737772, roughness: 0.6 }),                  // Dark gray bezel overlay borders
            
            // LED Materials
            ledGreenOn: new MeshStandardMaterial({ color: 0x55ff55, roughness: 0.2, emissive: 0x44d444 }),
            ledGreenOff: new MeshStandardMaterial({ color: 0x114411, roughness: 0.5 }),
            ledAmberOn: new MeshStandardMaterial({ color: 0xffaa33, roughness: 0.2, emissive: 0xcc7711 }),
            ledAmberOff: new MeshStandardMaterial({ color: 0x442200, roughness: 0.5 }),

            // Backside Hardware Interfaces
            rearPanel: new MeshStandardMaterial({ color: 0xc8ccc7, roughness: 0.4, metalness: 0.3 }),
            metalGold: new MeshStandardMaterial({ color: 0xcfa63c, roughness: 0.2, metalness: 0.85 }),
            metalSilver: new MeshStandardMaterial({ color: 0xcccccc, roughness: 0.15, metalness: 0.9 }),
            blackPlastic: new MeshStandardMaterial({ color: 0x181818, roughness: 0.6 })
        };

        const width = 32;
        const height = 8;
        const depth = 24;
        const frontZ = depth / 2 + 0.02;

        // --- A. MAIN OUTER CHASSIS & BEZEL ---
        const mainBodyGeo = new BoxGeometry(width, height, depth);
        const mainBody = new Mesh(mainBodyGeo, materials.chassis);
        mainBody.castShadow = true;
        mainBody.receiveShadow = true;
        this.group.add(mainBody);

        const frontPanelGroup = new Group();
        frontPanelGroup.position.z = frontZ;

        // Outer Structural Frame Bezel
        const bezelGeo = new BoxGeometry(width + 0.4, height + 0.4, 0.4);
        const bezel = new Mesh(bezelGeo, materials.chassis);
        frontPanelGroup.add(bezel);

        // Inner Light Gray Dark Face
        const faceGeo = new BoxGeometry(width - 0.4, height - 0.4, 0.1);
        const face = new Mesh(faceGeo, materials.bezelFace);
        face.position.z = 0.2;
        frontPanelGroup.add(face);

        // --- B. GRAPHIC USER INTERFACE DYNAMIC LCD ---
        const canvasText = document.createElement('canvas');
        canvasText.width = 1024;
        canvasText.height = 512;
        const ctx = canvasText.getContext('2d');
        ctx.fillStyle = '#010812';
        ctx.fillRect(0, 0, 1024, 512);
        
        ctx.fillStyle = '#66ccff';
        ctx.font = 'bold 74px monospace';
        ctx.fillText('98.837 kΩ', 140, 200);
        
        ctx.font = '36px monospace';
        ctx.fillText('1 Sample Space       99.135 kΩ Max', 60, 100);
        ctx.fillText('Sample->A  19.8581 mK  1 Range        200 kΩ', 60, 320);
        ctx.fillText('Setpoint   20.0000 mK    Excitation   316 pA', 60, 390);
        ctx.fillText('Heat 6.22 % of 31.6µA  Power        9.86 fW', 60, 460);
        
        const screenTexture = new CanvasTexture(canvasText);
        const screenMat = new MeshStandardMaterial({ 
            map: screenTexture, 
            emissiveMap: screenTexture,
            emissive: new Color(0x444444),
            roughness: 0.05 
        });

        const screenGeo = new PlaneGeometry(12, 5.0);
        const screen = new Mesh(screenGeo, screenMat);
        screen.position.set(-9.25, 0, 0.26);
        frontPanelGroup.add(screen);

        // --- C. EXTRUDE PROFILE GENERATORS FOR BUTTON TYPES ---
        
        // Helper function for building a standard rounded rectangle path profile
        const createRoundedRectShape = (w, h, r) => {
            const shape = new Shape();
            shape.moveTo(-w/2 + r, -h/2);
            shape.lineTo(w/2 - r, -h/2);
            shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
            shape.lineTo(w/2, h/2 - r);
            shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
            shape.lineTo(-w/2 + r, h/2);
            shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
            shape.lineTo(-w/2, -h/2 + r);
            shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
            return shape;
        };

        // Helper function for parameter adjustments arrows (teardrop / delta button shapes)
        const createArrowShape = (w, h, isUp) => {
            const shape = new Shape();
            if (isUp) {
                shape.moveTo(0, h/2);
                shape.quadraticCurveTo(w/2, h/4, w/2, -h/2 + 0.1);
                shape.quadraticCurveTo(w/2, -h/2, w/2 - 0.1, -h/2);
                shape.lineTo(-w/2 + 0.1, -h/2);
                shape.quadraticCurveTo(-w/2, -h/2, -w/2, -h/2 + 0.1);
                shape.quadraticCurveTo(-w/2, h/4, 0, h/2);
            } else {
                shape.moveTo(0, -h/2);
                shape.quadraticCurveTo(w/2, -h/4, w/2, h/2 - 0.1);
                shape.quadraticCurveTo(w/2, h/2, w/2 - 0.1, h/2);
                shape.lineTo(-w/2 + 0.1, h/2);
                shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - 0.1);
                shape.quadraticCurveTo(-w/2, -h/4, 0, -h/2);
            }
            return shape;
        };

        const extrudeOptions = { depth: 0.12, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 3, steps: 1 };
        const housingOptions = { depth: 0.04, bevelEnabled: false };

        const buildInteractiveButton = (x, y, shape, material, name, parent) => {
            const btnGroup = new Group();
            btnGroup.position.set(x, y, 0.26);

            // Realistic dark housing border behind the button pad element
            const housingGeo = new ExtrudeGeometry(shape, housingOptions);
            const housing = new Mesh(housingGeo, materials.buttonHousing);
            housing.position.z = -0.01;
            btnGroup.add(housing);

            // Main tactile key component
            const capGeo = new ExtrudeGeometry(shape, extrudeOptions);
            const cap = new Mesh(capGeo, material);
            cap.castShadow = true;
            cap.position.z = 0.02;

            // Interactive state data properties
            cap.userData = { 
                isButton: true, 
                name: name,
                originalZ: 0.02,
                pressedZ: -0.04 
            };

            btnGroup.add(cap);
            this.interactiveButtons.push(cap);
            parent.add(btnGroup);
        };

        const createLEDIndicator = (x, y, material, parent) => {
            const ledGeo = new BoxGeometry(0.18, 0.18, 0.08);
            const led = new Mesh(ledGeo, material);
            led.position.set(x, y, 0.27);
            parent.add(led);
        };

        // --- D. LAYOUT BLOCKS ASSEMBLY ---

        // 1. LEFT CONTROLS UNIT (AutoRange / Voltage / Current / AutoScan Grid)
        const leftPlateGeo = new ExtrudeGeometry(createRoundedRectShape(5.4, 5.0, 0.2), housingOptions);
        const leftPlate = new Mesh(leftPlateGeo, materials.plateBackground);
        leftPlate.position.set(0.4, 0, 0.22);
        frontPanelGroup.add(leftPlate);

        const leftBlock = new Group();
        leftBlock.position.set(0.4, 0, 0);
        frontPanelGroup.add(leftBlock);

        const standardPadShape = createRoundedRectShape(0.9, 0.7, 0.15);
        const arrowShapeUp = createArrowShape(0.7, 0.6, true);
        const arrowShapeDown = createArrowShape(0.7, 0.6, false);

        for (let i = 0; i < 4; i++) {
            const xOffset = -2.1 + (i * 1.4);
            // Membrane Square Keys
            buildInteractiveButton(xOffset, 1.2, standardPadShape, materials.buttonBlue, `LeftGroup_Key_${i}`, leftBlock);
            createLEDIndicator(xOffset, 1.8, i === 2 ? materials.ledGreenOn : materials.ledGreenOff, leftBlock);
            
            // Parametric Adjust Direction Arrows
            buildInteractiveButton(xOffset, 0.1, arrowShapeUp, materials.buttonBlue, `LeftGroup_ArrowUp_${i}`, leftBlock);
            buildInteractiveButton(xOffset, -1.1, arrowShapeDown, materials.buttonBlue, `LeftGroup_ArrowDown_${i}`, leftBlock);
        }

        // 2. MIDDLE CONTROLS UNIT (Heaters / SETPOINT / ALL OFF)
        const midPlateGeo = new ExtrudeGeometry(createRoundedRectShape(3.4, 5.0, 0.2), housingOptions);
        const midPlate = new Mesh(midPlateGeo, materials.plateBackground);
        midPlate.position.set(5.2, 0, 0.22);
        frontPanelGroup.add(midPlate);

        const midBlock = new Group();
        midBlock.position.set(5.2, 0, 0);
        frontPanelGroup.add(midBlock);

        // Top Row Heater Settings Panel
        buildInteractiveButton(-0.8, 1.2, standardPadShape, materials.buttonBlue, "SampleHeater", midBlock);
        createLEDIndicator(-0.8, 1.8, materials.ledAmberOn, midBlock);
        
        buildInteractiveButton(0.8, 1.2, standardPadShape, materials.buttonBlue, "WarmupHeater", midBlock);
        createLEDIndicator(0.8, 1.8, materials.ledAmberOff, midBlock);

        // Center wide SETPOINT execution bar
        const setpointShape = createRoundedRectShape(2.7, 0.6, 0.15);
        buildInteractiveButton(0, 0.1, setpointShape, materials.buttonBlue, "SetpointBar", midBlock);

        // Lower tuning functions
        buildInteractiveButton(-0.8, -1.0, standardPadShape, materials.buttonBlue, "PidManOut", midBlock);
        buildInteractiveButton(0.8, -1.0, standardPadShape, materials.buttonBlue, "HeaterRange", midBlock);

        // Bottom Highlight safety kill switch: ALL OFF
        const allOffShape = createRoundedRectShape(1.8, 0.5, 0.12);
        buildInteractiveButton(0, -2.0, allOffShape, materials.buttonRed, "AllOff", midBlock);

        // 3. RIGHT PROGRAMMING ENTRY UNIT (Keypad & Command Matrix)
        const rightBlock = new Group();
        rightBlock.position.set(11.2, 0, 0);
        frontPanelGroup.add(rightBlock);

        // 12-Key Data Input Matrix (using extruded circular/oval profile configurations)
        const numKeyShape = createRoundedRectShape(0.9, 0.55, 0.25);
        const keypadMapping = [
            ['7','8','9'],
            ['4','5','6'],
            ['1','2','3'],
            ['0','.','+/-']
        ];
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const x = -2.2 + (col * 1.3);
                const y = 1.6 - (row * 1.1);
                buildInteractiveButton(x, y, numKeyShape, materials.buttonGrayLight, `NumKey_${keypadMapping[row][col]}`, rightBlock);
            }
        }

        // Dedicated Command Column Options (Escape / Navigation / Enter)
        const cmdKeyShape = createRoundedRectShape(1.1, 0.8, 0.2);
        buildInteractiveButton(1.6, 1.6, cmdKeyShape, materials.buttonGrayDark, "CmdKey_ESCAPE", rightBlock);
        buildInteractiveButton(1.6, 0.7, arrowShapeUp, materials.buttonBlue, "CmdKey_NavUp", rightBlock);
        buildInteractiveButton(1.6, -0.4, arrowShapeDown, materials.buttonBlue, "CmdKey_NavDown", rightBlock);
        buildInteractiveButton(1.6, -1.5, cmdKeyShape, materials.buttonGrayDark, "CmdKey_ENTER", rightBlock);

        // Far Right Diagnostic System Status Light Emitting Diodes
        const statusLEDsX = 3.1;
        createLEDIndicator(statusLEDsX, 1.8, materials.ledGreenOn, rightBlock);   // Remote
        createLEDIndicator(statusLEDsX, 1.1, materials.ledGreenOff, rightBlock);  // Ethernet
        createLEDIndicator(statusLEDsX, 0.4, materials.ledAmberOff, rightBlock);  // Alarm
        createLEDIndicator(statusLEDsX, -0.3, materials.ledGreenOff, rightBlock); // Still

        this.group.add(frontPanelGroup);

        // --- E. INSTRUMENT CHASSIS FLANGES & FEET BACKINGS ---
        const legGeo = new CylinderGeometry(0.3, 0.4, 1.8, 16);
        const frontLeftLeg = new Mesh(legGeo, materials.blackPlastic);
        frontLeftLeg.position.set(-width / 2 + 3, -height / 2 - 0.6, depth / 2 - 2); 
        
        const frontRightLeg = frontLeftLeg.clone();
        frontRightLeg.position.x = width / 2 - 3;

        const rearLeftLeg = new Mesh(legGeo, materials.blackPlastic);
        rearLeftLeg.scale.set(1, 0.4, 1);
        rearLeftLeg.position.set(-width / 2 + 3, -height / 2 - 0.2, -depth / 2 + 2);
        const rearRightLeg = rearLeftLeg.clone();
        rearRightLeg.position.x = width / 2 - 3;

        this.group.add(frontLeftLeg, frontRightLeg, rearLeftLeg, rearRightLeg);

        // --- F. REAR HARDWARE CONNECTOR LAYOUTS ---
        const rearPanelGroup = new Group();
        rearPanelGroup.position.z = -depth / 2 - 0.02;

        const rearFaceGeo = new BoxGeometry(width - 0.4, height - 0.4, 0.1);
        const rearFace = new Mesh(rearFaceGeo, materials.rearPanel);
        rearFace.rotation.y = Math.PI; 
        rearPanelGroup.add(rearFace);

        const createRearBNC = (x, y) => {
            const bncGroup = new Group();
            const outer = new CylinderGeometry(0.35, 0.35, 0.5, 24);
            outer.rotateX(Math.PI/2);
            const outerMesh = new Mesh(outer, materials.metalSilver);
            const inner = new CylinderGeometry(0.12, 0.12, 0.6, 12);
            inner.rotateX(Math.PI/2);
            const innerMesh = new Mesh(inner, materials.metalGold);
            bncGroup.add(outerMesh, innerMesh);
            bncGroup.position.set(x, y, -0.25);
            rearPanelGroup.add(bncGroup);
        };

        const createRearTerminalBlock = (x, y, pins) => {
            const blockGeo = new BoxGeometry(pins * 0.45, 0.5, 0.4);
            const block = new Mesh(blockGeo, materials.blackPlastic);
            block.position.set(x, y, -0.2);
            rearPanelGroup.add(block);
        };

        const createRearDSub = (x, y, wSize) => {
            const dSubGeo = new BoxGeometry(wSize, 0.5, 0.25);
            const dSub = new Mesh(dSubGeo, materials.metalSilver);
            const innerGeo = new BoxGeometry(wSize - 0.3, 0.25, 0.3);
            const inner = new Mesh(innerGeo, materials.blackPlastic);
            inner.position.z = -0.02;
            dSub.add(inner);
            dSub.position.set(x, y, -0.12);
            rearPanelGroup.add(dSub);
        };

        // Populate backplane connectors mapping exact locations
        const dinGeo = new CylinderGeometry(0.65, 0.65, 0.25, 24);
        dinGeo.rotateX(Math.PI/2);
        const mInput1 = new Mesh(dinGeo, materials.metalSilver); mInput1.position.set(-11, -1, -0.12);
        const mInput2 = new Mesh(dinGeo, materials.metalSilver); mInput2.position.set(-8, -1, -0.12);
        const cInput = new Mesh(dinGeo, materials.metalSilver);  cInput.position.set(-4, -1, -0.12);
        rearPanelGroup.add(mInput1, mInput2, cInput);

        createRearBNC(-1, -1);
        createRearBNC(2, -1);
        createRearTerminalBlock(6, -1, 6); 
        createRearTerminalBlock(10, -1, 4); 

        const ethGeo = new BoxGeometry(0.8, 0.8, 0.35);
        const eth = new Mesh(ethGeo, materials.metalSilver);
        eth.position.set(13, -1, -0.15);
        rearPanelGroup.add(eth);

        createRearDSub(10, 2, 3.4);  // IEEE-488
        createRearDSub(-10, 2, 2.0); // SCAN CONTROL

        const powerModuleGeo = new BoxGeometry(2.8, 1.6, 0.4);
        const powerModule = new Mesh(powerModuleGeo, materials.blackPlastic);
        powerModule.position.set(13, 2, -0.2);
        rearPanelGroup.add(powerModule);

        this.group.add(rearPanelGroup);
    }
}