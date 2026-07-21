import { Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, BoxGeometry, CapsuleGeometry, CylinderGeometry, PlaneGeometry, SphereGeometry, CanvasTexture, CircleGeometry } from "three";

export default class Octave {
    constructor() {
        this.group = new Group();
        this.createModel();
    }

    createModel() {
        // Base Chassis Material - Sleek Dark Anodized Aluminum
        const bodyMat = new MeshStandardMaterial({
            color: 0x161618,
            metalness: 0.8,
            roughness: 0.25
        });

        // Main 1U rack body
        const body = new Mesh(
            new BoxGeometry(4.95, 0.85, 2.65),
            bodyMat
        );
        body.castShadow = true;
        body.receiveShadow = true;
        this.group.add(body);

        // --- FRONT PANEL ---
        const panelMat = new MeshStandardMaterial({
            color: 0x0c0c0d,
            metalness: 0.5,
            roughness: 0.15
        });

        // Inner recessed bezel capsule
        const panel = new Mesh(
            new CapsuleGeometry(0.33, 4.6, 10, 40),
            panelMat
        );
        panel.rotation.z = Math.PI / 2;
        panel.scale.z = 0.1;
        panel.position.set(0, 0, 1.33);
        this.group.add(panel);

        // Ventilation Micro-Holes Grid (Front)
        const frontHoleGeo = new CylinderGeometry(0.009, 0.009, 0.02, 8);
        const frontHoleMat = new MeshStandardMaterial({ color: 0x020202, roughness: 1 });
        
        for (let x = -2.2; x <= 2.2; x += 0.05) {
            for (let y = -0.28; y <= 0.28; y += 0.06) {
                // Skip spacing for connectors and centered QM logo
                if (Math.abs(x) < 0.2 || (x > -2.1 && x < -1.7)) continue;
                const hole = new Mesh(frontHoleGeo, frontHoleMat);
                hole.rotation.x = Math.PI / 2;
                hole.position.set(x, y, 1.34);
                this.group.add(hole);
            }
        }

        // QM Branding Logo Texture
        const logoCanvas = document.createElement("canvas");
        logoCanvas.width = 256;
        logoCanvas.height = 256;
        const ctx = logoCanvas.getContext("2d");
        ctx.fillStyle = "transparent";
        ctx.clearRect(0, 0, 256, 256);
        ctx.strokeStyle = "#00D2FF";
        ctx.lineWidth = 24;
        ctx.lineCap = "round";
        // Simple procedural custom "QM" sketch loop
        ctx.beginPath(); ctx.arc(80, 128, 45, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(150, 85); ctx.lineTo(150, 170); ctx.lineTo(190, 85); ctx.lineTo(190, 170); ctx.stroke();
        
        const logoTexture = new CanvasTexture(logoCanvas);
        const logo = new Mesh(
            new PlaneGeometry(0.35, 0.35),
            new MeshBasicMaterial({ map: logoTexture, transparent: true })
        );
        logo.position.set(0, 0, 1.345);
        this.group.add(logo);

        // --- CONNECTOR STYLING GENERATORS ---
        const gold = new MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 });
        const silver = new MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.2 });
        const darkPlast = new MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });

        function addSMA(x, y, z, dir, group) {
            const flange = new Mesh(new CircleGeometry(0.05, 36), gold)
            flange.position.set(x, y, z + (0.025 ));

            const base = new Mesh(new CylinderGeometry(0.04, 0.06, 0.05, 16), gold);
            base.rotation.x = Math.PI / 2 * dir ;
            base.position.set(x, y, z + (0.025 ));

            const inside = new Mesh(new CylinderGeometry(0.03, 0.035, 0.06, 16), silver)
            inside.rotation.x = Math.PI / 2 * dir;
            inside.position.set(x, y, z + (0.03 ));

            const wire = new Mesh(new CylinderGeometry(0.01, 0.01, 0.075, 16), darkPlast)
            wire.rotation.x = Math.PI / 2 * dir ;
            wire.position.set(x, y, z + (0.03));

            group.add(flange);
            group.add(base);
            group.add(inside);
            group.add(wire);
        }

        function addBNC(x, y, z, dir, group) {
            const base = new Mesh(new CylinderGeometry(0.06, 0.06, 0.08, 24), silver);
            base.rotation.x = Math.PI / 2 * dir;
            base.position.set(x, y, z + (0.04 * dir));
            group.add(base);
        }

        // --- FRONT SMA CONNECTOR DISTRIBUTIONS ---
        const frontPositions = [
            // Left pair variants
            [-2.0, -0.1], [-1.5, -0.1],
            // Primary row arrays
            [-1.0, 0.12], [-1.0, -0.18], [-0.8, 0.12], [-0.8, -0.18], [-0.6, 0.12], [-0.6, -0.18], [-0.4, 0.12], [-0.4, -0.18], [-0.2, 0.12], [-0.2, -0.18],
            [0.2, 0.12], [0.2, -0.18], [0.4, 0.12], [0.4, -0.18], [0.6, 0.12], [0.6, -0.18], [0.8, 0.12], [0.8, -0.18], [1.0, 0.12], [1.0, -0.18],
            [1.3, 0.12], [1.3, -0.18], [1.5, 0.12], [1.5, -0.18], [1.7, 0.12], [1.7, -0.18], [2.0, 0.12], [2.0, -0.18]
        ];
        frontPositions.forEach(p => addSMA(p[0], p[1], 1.33, 1, this.group));

        // --- REAR PANEL COMPONENTS ---
        const rearZ = -1.35;

        // Left & Right Flanking Mesh Exhaust Patches
        [-2.2, 2.2].forEach(xOffset => {
            const ventPatch = new Mesh(new BoxGeometry(0.4, 0.5, 0.01), darkPlast);
            ventPatch.position.set(xOffset, 0, rearZ);
            this.group.add(ventPatch);
        });

        // Rear Interface Ports Map (SMA and BNC outputs)
        const rearSMAs = [
            [-1.7, 0.15], [-1.7, -0.15], [-1.2, 0.15], [-1.2, -0.15],
            [-0.9, 0.15], [-0.9, -0.15], [-0.7, 0.15], [-0.7, -0.15], [-0.5, 0.15], [-0.5, -0.15],
            [-0.2, 0.15], [-0.2, -0.15], [0.0, 0.15], [0.0, -0.15], [0.2, 0.15], [0.2, -0.15],
            [0.4, 0.15], [0.4, -0.15], [0.6, 0.15], [0.6, -0.15]
        ];
        rearSMAs.forEach(p => addSMA(p[0], p[1], rearZ, -1, this.group));
        
        // Twin Clock/Synth BNC ports
        addBNC(-1.4, 0.0, rearZ, -1, this.group);
        addBNC(0.8, 0.0, rearZ, -1, this.group);

        // Network Ethernet Box Housing (Dual stacked Ports)
        const ethHousing = new Mesh(new BoxGeometry(0.18, 0.35, 0.1), silver);
        ethHousing.position.set(1.3, -0.05, rearZ - 0.02);
        this.group.add(ethHousing);

        // USB Port Base
        const usbHousing = new Mesh(new BoxGeometry(0.16, 0.08, 0.08), silver);
        usbHousing.position.set(1.6, -0.18, rearZ - 0.01);
        this.group.add(usbHousing);

        // I/O Toggle Power Rocker Switch
        const switchBox = new Mesh(new BoxGeometry(0.18, 0.28, 0.08), darkPlast);
        switchBox.position.set(1.6, 0.12, rearZ - 0.01);
        this.group.add(switchBox);

        // Power Core input plug receiver barrel
        const powerJack = new Mesh(new CylinderGeometry(0.07, 0.07, 0.1, 16), darkPlast);
        powerJack.rotation.x = Math.PI / 2;
        powerJack.position.set(1.9, -0.12, rearZ - 0.02);
        this.group.add(powerJack);
    }
}