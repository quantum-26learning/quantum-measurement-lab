import {Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, BoxGeometry, CylinderGeometry, PlaneGeometry, CanvasTexture, MeshPhysicalMaterial, SphereGeometry, SRGBColorSpace, AdditiveBlending, ExtrudeGeometry, Shape} from "three";

export default class VNA{
    constructor(){
        this.group = new Group();
        this.createModel();
    }

    createModel(){
        this.group.position.y = 0.25;

        const bodyMat = new MeshStandardMaterial({
        color: 0xf5f7fa,
        metalness: 0.9,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
        });

        const body = new Mesh(new BoxGeometry(5, 2.1, 2.4), bodyMat);
        body.castShadow = true;
        body.receiveShadow = true;
        

// ---- Surface z-reference constants ------------------------------------
// Everything mounted "on" the front panel is derived from the panel's
// own outer face so nothing floats in empty space.

        const FRONT_PANEL_DEPTH = 0.08;
        const FRONT_PANEL_Z = 1.17;
        const PANEL_FACE_Z = FRONT_PANEL_Z + FRONT_PANEL_DEPTH / 2; // 1.21, outer visible face

        const frontPanel = new Mesh(
        new BoxGeometry(4.95, 2, FRONT_PANEL_DEPTH),
        new MeshStandardMaterial({ color: 0xf5f7fa, metalness: 0.3, roughness: 0.2 })
        );
        frontPanel.position.z = FRONT_PANEL_Z;
        

// ---- Feet ---------------------------------------------------------------

        function foot(x, z, group) {
        const base = new Mesh(
            new CylinderGeometry(0.22, 0.26, 0.22, 40),
            new MeshStandardMaterial({ color: 0x8a8a8a, metalness: 0.9, roughness: 0.35 })
        );
        base.position.set(x, -1.18, z);
        group.add(base);
        }
        foot(-2.15, 0.95, this.group);
        foot(2.15, 0.95, this.group);
        foot(-2.15, -0.95, this.group);
        foot(2.15, -0.95, this.group);

// =====================================================================
// DISPLAY SCREEN
// =====================================================================

        const SCREEN_FRAME_DEPTH = 0.05;
        const screenFrame = new Mesh(
        new BoxGeometry(2.75, 1.35, SCREEN_FRAME_DEPTH),
        new MeshStandardMaterial({ color: 0x2e5ea8, metalness: 0.25, roughness: 0.08 })
        );
// frame sits flush against the front panel's outer face
        screenFrame.position.set(-0.72, 0.25, PANEL_FACE_Z + SCREEN_FRAME_DEPTH / 2);


        const SCREEN_FRAME_FACE_Z = PANEL_FACE_Z + SCREEN_FRAME_DEPTH;

// ---- Screen content texture --------------------------------------------
// Draws a grid + channel labels onto a canvas so the screen reads as an
// active instrument rather than a flat green rectangle.

        function createScreenTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 460;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#0a1f14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

  // quadrant dividers
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

  // fine grid
        ctx.strokeStyle = 'rgba(70,160,100,0.35)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += canvas.width / 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += canvas.height / 12) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '20px monospace';
  

        const tex = new CanvasTexture(canvas);
        tex.colorSpace = SRGBColorSpace;
        return tex;
        }

        const screenTexture = createScreenTexture();

        const screen = new Mesh(
        new PlaneGeometry(2.55, 1.15),
        new MeshStandardMaterial({
            map: screenTexture,
            emissive: 0xffffff,
            emissiveMap: screenTexture,
            emissiveIntensity: 1.5,
            color: 0x111111,
            roughness: 0.35,
            metalness: 0
        })
        );
// glass sits just proud of the frame's front face
        screen.position.set(-0.72, 0.25, SCREEN_FRAME_FACE_Z + 0.002);

// ---- Glossy glass overlay -----------------------------------------------
// Clearcoat layer catches the studio lights so the panel reads as
// glazed glass rather than flat plastic.

        const screenGlass = new Mesh(
        new PlaneGeometry(2.55, 1.15),
        new MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.07,
            roughness: 0.03,
            metalness: 0,
            clearcoat: 1,
            clearcoatRoughness: 0.03,
            reflectivity: 1
        })
        );
        screenGlass.position.set(-0.72, 0.25, SCREEN_FRAME_FACE_Z + 0.006);


// diagonal glare streak, sold with additive blending
        function createGlareTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, c.width, c.height);
        grad.addColorStop(0.00, 'rgba(255,255,255,0)');
        grad.addColorStop(0.42, 'rgba(255,255,255,0)');
        grad.addColorStop(0.50, 'rgba(255,255,255,0.4)');
        grad.addColorStop(0.58, 'rgba(255,255,255,0)');
        grad.addColorStop(1.00, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, c.width, c.height);
        return new CanvasTexture(c);
        }

        const glare = new Mesh(
        new PlaneGeometry(2.55, 1.15),
        new MeshBasicMaterial({
            map: createGlareTexture(),
            transparent: true,
            opacity: 0.55,
            blending: AdditiveBlending,
            depthWrite: false
        })
        );
        glare.position.set(-0.72, 0.25, SCREEN_FRAME_FACE_Z + 0.008);


// =====================================================================
// LOWER SILVER PANEL
// =====================================================================

        const SILVER_PANEL_DEPTH = 0.04;
        const silverPanel = new Mesh(
        new BoxGeometry(4.95, 0.42, SILVER_PANEL_DEPTH),
        new MeshStandardMaterial({ color: 0xd7d9dc, metalness: 0.95, roughness: 0.18 })
        );
        silverPanel.position.set(0, -0.79, PANEL_FACE_Z + SILVER_PANEL_DEPTH / 2);


        const SILVER_PANEL_FACE_Z = PANEL_FACE_Z + SILVER_PANEL_DEPTH;

// =====================================================================
// BLUE SIDE HANDLES
// =====================================================================

        const blueMat = new MeshStandardMaterial({ color: 0x2e5ea8, metalness: 0.65, roughness: 0.32 });

        function makeHandle(side, group) {
            const handle = new Group();

            const outer = new Mesh(new BoxGeometry(0.32, 2.25, 0.28), blueMat);
            outer.position.x = side * 2.72;
            handle.add(outer);

            const top = new Mesh(new BoxGeometry(0.55, 0.25, 0.85), blueMat);
            top.position.set(side * 2.56, 1.0, 0);
            handle.add(top);

            const bottom = top.clone();
            bottom.position.y = -1.0;
            handle.add(bottom);

            const grip = new Mesh(
                new BoxGeometry(0.12, 1.35, 0.18),
                new MeshStandardMaterial({ color: 0xe8e8e8, metalness: 0.2, roughness: 0.6 })
            );
            grip.position.set(side * 2.63, 0, 0.05);
            handle.add(grip);

            group.add(handle);
        }
        makeHandle(-1, this.group);
        makeHandle(1, this.group);

// =====================================================================
// SIDE VENTILATION
// =====================================================================

        const ventMat = new MeshStandardMaterial({ color: 0xf5f7fa });

        for (let y = -0.65; y <= 0.65; y += 0.10) {
        for (let z = -0.80; z <= 0.80; z += 0.10) {
            const slot = new Mesh(new BoxGeometry(0.03, 0.05, 0.06), ventMat);
            slot.position.set(-2.47, y, z);
            this.group.add(slot);

            const slot2 = slot.clone();
            slot2.position.x = 2.47;
            this.group.add(slot2);
        }
        }

// =====================================================================
// TOP HIGHLIGHT
// =====================================================================

        const highlight = new Mesh(
        new BoxGeometry(4.85, 0.02, 2.28),
        new MeshStandardMaterial({ color: 0xf5f7fa, metalness: 0.5, roughness: 0.5 })
        );
        highlight.position.y = 1.06;

        const BUTTON_DEPTH = 0.035;          
        const BUTTON_BEVEL = 0.006;          
        const BUTTON_Z = PANEL_FACE_Z + BUTTON_DEPTH;

        const buttonMat = new MeshStandardMaterial({ color: 0x2e2e2e, metalness: 0.2, roughness: 0.35 });
        const orangeButtonMat = new MeshStandardMaterial({ color: 0xe66a00, metalness: 0.1, roughness: 0.4 });
        const tealButtonMat = new MeshStandardMaterial({ color: 0x00a896, metalness: 0.1, roughness: 0.4 });
        const socketMat = new MeshStandardMaterial({ color: 0x121212, roughness: 0.9 }); // Dark inner cutout shadow
        const knobMat = new MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.4 });

        // Helper function to generate a rounded rectangle shape for extrusion
        function createRoundedRectShape(w, h, r) {
            const shape = new Shape();
            const x = -w/2, y = -h/2;
            shape.moveTo(x, y + r);
            shape.lineTo(x, y + h - r);
            shape.quadraticCurveTo(x, y + h, x + r, y + h);
            shape.lineTo(x + w - r, y + h);
            shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
            shape.lineTo(x + w, y + r);
            shape.quadraticCurveTo(x + w, y, x + w - r, y);
            shape.lineTo(x + r, y);
            shape.quadraticCurveTo(x, y, x, y + r);
            return shape;
        }

// Advanced Button Factory with Bold Proportions
        function addRealisticButton(x, y, w = 0.14, h = 0.11, colorMat = buttonMat, group) {
            const radius = 0.015; // Increased rounding radius to match the larger scale
            const shape = createRoundedRectShape(w - BUTTON_BEVEL * 2, h - BUTTON_BEVEL * 2, radius);
    
            const extrudeSettings = {
                steps: 1,
                depth: BUTTON_DEPTH,
                bevelEnabled: true,
                bevelThickness: BUTTON_BEVEL,
                bevelSize: BUTTON_BEVEL,
                bevelSegments: 4 // Extra segments for smooth curvature at larger sizes
            };

            const geometry = new ExtrudeGeometry(shape, extrudeSettings);
            geometry.center(); 
    
            const buttonMesh = new Mesh(geometry, colorMat);
            buttonMesh.position.set(x, y, BUTTON_Z);
            buttonMesh.castShadow = true;
            buttonMesh.receiveShadow = true;

            // Socket Backing (Creates the mechanical gap outline on the panel)
            const socketGeo = new BoxGeometry(w + 0.008, h + 0.008, 0.002);
            const socketMesh = new Mesh(socketGeo, socketMat);
            socketMesh.position.set(x, y, PANEL_FACE_Z + 0.001);
    
            group.add(socketMesh);
            group.add(buttonMesh);
            return buttonMesh;
        }

// ---- 1. TOP FUNCTION BLOCK (Widened Spacing for Larger Keys) ----
// Left block
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 3; c++) {
                addRealisticButton(0.95 + c * 0.17, 0.60 - r * 0.14, 0.14, 0.11, buttonMat, this.group);
            }
        }
// Middle block
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 3; c++) {
                addRealisticButton(1.50 + c * 0.17, 0.60 - r * 0.14, 0.14, 0.11, buttonMat, this.group);
            }
        }
// Right block
        const rightBlockColors = [
            [buttonMat, buttonMat],
            [orangeButtonMat, tealButtonMat]
        ];
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 2; c++) {
                addRealisticButton(2.05 + c * 0.17, 0.60 - r * 0.14, 0.14, 0.11, rightBlockColors[r][c], this.group);
            }
        }

// ---- 2. NUMERIC KEYPAD ----
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 3; c++) {
                addRealisticButton(0.95 + c * 0.17, 0.25 - r * 0.14, 0.14, 0.11, buttonMat, this.group);
            }
        }
// Side column next to numpad
        for (let r = 0; r < 4; r++) {
            addRealisticButton(1.48, 0.25 - r * 0.14, 0.14, 0.11, buttonMat, this.group);
        }

// ---- 3. DETAILED ROTARY KNOB (Scaled to match) ----
        const knobRadius = 0.2;
        const knobHeight = 0.06;
        const knobGeo = new CylinderGeometry(knobRadius, knobRadius, knobHeight, 64);
        knobGeo.rotateX(Math.PI / 2);

        const rotaryKnob = new Mesh(knobGeo, knobMat);
        rotaryKnob.position.set(1.95, 0.04, PANEL_FACE_Z + knobHeight / 2);
        rotaryKnob.castShadow = true;
        this.group.add(rotaryKnob);

// ---- 4. NAVIGATION KEYS ----
        addRealisticButton(0.95, -0.40, 0.14, 0.11, buttonMat, this.group); 
        addRealisticButton(1.30, -0.40, 0.14, 0.11, buttonMat, this.group); 
        addRealisticButton(1.48, -0.32, 0.14, 0.11, buttonMat, this.group); 
        addRealisticButton(1.48, -0.48, 0.14, 0.11, buttonMat, this.group); 
        addRealisticButton(1.66, -0.40, 0.14, 0.11, buttonMat, this.group);

// =====================================================================
// FOUR RF PORTS
// =====================================================================
// Each port = mounting flange -> knurled nut -> insulator ring -> pin,
// stacked outward from the silver panel's face so it reads as a real
// coax connector rather than a flat gold knob.

        const portMat = new MeshStandardMaterial({ color: 0xd5b24a, metalness: 1, roughness: 0.12 });

        const RF_FLANGE_DEPTH = 0.03;
        const RF_NUT_DEPTH = 0.06;
        const RF_INSULATOR_DEPTH = 0.02;
        const RF_PIN_DEPTH = 0.05;

        const connectorMetalMat = new MeshStandardMaterial({ color: 0xc9cdd2, metalness: 1, roughness: 0.22 });
        const insulatorMat = new MeshStandardMaterial({ color: 0xf2ead9, metalness: 0.1, roughness: 0.6 });
        const pinMat = new MeshStandardMaterial({ color: 0xffd76a, metalness: 1, roughness: 0.15 });

        function addRFPort(x, group) {
  // mounting flange, flush against the silver panel
        const flange = new Mesh(
            new CylinderGeometry(0.075, 0.075, RF_FLANGE_DEPTH, 32),
            portMat
        );
        flange.rotation.x = Math.PI / 2;
        flange.position.set(x, -0.79, SILVER_PANEL_FACE_Z + RF_FLANGE_DEPTH / 2);
        group.add(flange);

        const flangeFaceZ = SILVER_PANEL_FACE_Z + RF_FLANGE_DEPTH;

  // knurled outer nut — hexagonal, low-poly cylinder reads as a real
  // threaded coax nut you'd twist a cable connector onto
        const nut = new Mesh(
            new CylinderGeometry(0.058, 0.058, RF_NUT_DEPTH, 6),
            connectorMetalMat
        );
        nut.rotation.x = Math.PI / 2;
        nut.rotation.z = Math.PI / 6;
        nut.position.set(x, -0.79, flangeFaceZ + RF_NUT_DEPTH / 2);
        group.add(nut);

        const nutFaceZ = flangeFaceZ + RF_NUT_DEPTH;

  // cream dielectric insulator ring, recessed just inside the nut
        const insulator = new Mesh(
            new CylinderGeometry(0.032, 0.032, RF_INSULATOR_DEPTH, 32),
            insulatorMat
        );
        insulator.rotation.x = Math.PI / 2;
        insulator.position.set(x, -0.79, nutFaceZ + RF_INSULATOR_DEPTH / 2);
        group.add(insulator);

        const insulatorFaceZ = nutFaceZ + RF_INSULATOR_DEPTH;

  // protruding center pin — the actual contact a cable connects to
        const pin = new Mesh(
            new CylinderGeometry(0.011, 0.011, RF_PIN_DEPTH, 20),
            pinMat
        );
        pin.rotation.x = Math.PI / 2;
        pin.position.set(x, -0.79, insulatorFaceZ + RF_PIN_DEPTH / 2);
        group.add(pin);
        }

        addRFPort(-1.60, this.group);
        addRFPort(-0.50, this.group);
        addRFPort(0.60, this.group);
        addRFPort(1.70, this.group);

// =====================================================================
// USB CONNECTOR
// =====================================================================

        const USB_DEPTH = 0.03;
        const usb = new Mesh(
        new BoxGeometry(0.16, 0.08, USB_DEPTH),
        new MeshStandardMaterial({ color: 0xd9d9d9, metalness: 1, roughness: 0.15 })
        );
        usb.position.set(-2.15, -0.78, SILVER_PANEL_FACE_Z + USB_DEPTH / 2);


// =====================================================================
// STATUS LEDs
// =====================================================================

        const LED_RADIUS = 0.018;
        const ledMat = new MeshStandardMaterial({
        color: 0x00ff66,
        emissive: 0x00ff66,
        emissiveIntensity: 3
        });

        for (let i = 0; i < 6; i++) {
            const led = new Mesh(new SphereGeometry(LED_RADIUS, 12, 12), ledMat);
            led.position.set(-1.60 + i * 0.14, 0.93, PANEL_FACE_Z + LED_RADIUS);
            this.group.add(led);
        }

        this.group.add(body);
        this.group.add(frontPanel);
        this.group.add(screenFrame);
        this.group.add(screen);
        this.group.add(screenGlass);        
        this.group.add(glare);        
        this.group.add(silverPanel);
        this.group.add(highlight);        
        this.group.add(usb);
    }
}