import { Group, MeshStandardMaterial, Mesh, BoxGeometry, CapsuleGeometry, PointLight, CylinderGeometry, MeshBasicMaterial, ExtrudeGeometry, Shape } from "three";

export default class OPX {
  constructor() {
    this.group = new Group();
    this.createModel();
  }

  createModel() {
    // ---------- Chassis Dimensions ----------
    const CHASSIS_W = 4.9;
    const CHASSIS_H = 1;
    const CHASSIS_D = 2.6;
    
    const FRONT_Z = CHASSIS_D / 2;
    const BACK_Z = -CHASSIS_D / 2;

    // Common Textures/Materials
    const bodyMat = new MeshStandardMaterial({ color: 0x161618, metalness: 0.6, roughness: 0.5 });
    const bevelMat = new MeshStandardMaterial({ color: 0x2c2c30, metalness: 0.8, roughness: 0.3 });
    const goldMat = new MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 });
    const silverMat = new MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const darkPlastMat = new MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    const greenMat = new MeshStandardMaterial({ color: 0x00a86b, roughness: 0.5 });
    const redMat = new MeshStandardMaterial({ color: 0xcc1111, roughness: 0.4 });

    // 1. Main Chassis Box & Bevel
    const bodyGeo = new BoxGeometry(CHASSIS_W, CHASSIS_H, CHASSIS_D);
    const body = new Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);

    const bevelGeo = new BoxGeometry(CHASSIS_W * 0.995, 0.02, CHASSIS_D * 0.995);
    const bevel = new Mesh(bevelGeo, bevelMat);
    bevel.position.y = CHASSIS_H / 2 + 0.001;
    this.group.add(bevel);


    // ==========================================
    // FRONT PANEL SIDE (Z > 0)
    // ==========================================
    const CAPSULE_Z = FRONT_Z + 0.015;
    const CAPSULE_LENGTH = 4.3;  
    const CAPSULE_RADIUS = 0.31;
    const CAPSULE_DEPTH_SCALE = 0.12;

    // High gloss dark core plate matching the image
    const capsuleMat = new MeshStandardMaterial({ color: 0x050505, metalness: 0.1, roughness: 0.05 });
    const capsuleGeo = new CapsuleGeometry(CAPSULE_RADIUS, CAPSULE_LENGTH, 8, 24);
    const capsule = new Mesh(capsuleGeo, capsuleMat);
    capsule.rotation.z = Math.PI / 2;
    capsule.scale.z = CAPSULE_DEPTH_SCALE;
    capsule.position.set(0, 0, CAPSULE_Z);
    this.group.add(capsule);

    // Chrome trim rim outline around the panel
    const trimGeo = new CapsuleGeometry(CAPSULE_RADIUS + 0.008, CAPSULE_LENGTH, 8, 24);
    const trim = new Mesh(trimGeo, silverMat);
    trim.rotation.z = Math.PI / 2;
    trim.scale.z = CAPSULE_DEPTH_SCALE * 0.7;
    trim.position.set(0, 0, CAPSULE_Z - 0.005);
    this.group.add(trim);

    // Front Port Generation Helper
    const FRONT_SURFACE_Z = CAPSULE_Z + (CAPSULE_RADIUS * CAPSULE_DEPTH_SCALE);
    function addFrontPort(x, y, group) {
      const pGroup = new Group();
      const base = new Mesh(new CylinderGeometry(0.045, 0.045, 0.04, 16), goldMat);
      base.rotation.x = Math.PI / 2;
      const inside = new Mesh(new CylinderGeometry(0.025, 0.025, 0.045, 16), silverMat);
      inside.rotation.x = Math.PI / 2;
      const wire = new Mesh(new CylinderGeometry(0.01, 0.01, 0.075, 16), darkPlastMat)
      wire.rotation.x = Math.PI / 2 ;
      pGroup.add(base, inside, wire);
      pGroup.position.set(x, y, FRONT_SURFACE_Z);
      group.add(pGroup);
    }

    // Port Row Y Alignment (tighter row spacing based on image)
    const FRONT_TOP_Y = 0.12;
    const FRONT_BOTTOM_Y = -0.12;
    const STEP_X = 0.20; 

    // Section 1: Digital Markers (5 Columns)
    const S1_CENTER_X = -0.95;
    [-2, -1, 0, 1, 2].forEach(i => {
      addFrontPort(S1_CENTER_X + (i * STEP_X), FRONT_TOP_Y, this.group);
      addFrontPort(S1_CENTER_X + (i * STEP_X), FRONT_BOTTOM_Y, this.group);
    });

    // Section 2: Analog Outputs (5 Columns)
    const S2_CENTER_X = 0.65;
    [-2, -1, 0, 1, 2].forEach(i => {
      addFrontPort(S2_CENTER_X + (i * STEP_X), FRONT_TOP_Y, this.group);
      addFrontPort(S2_CENTER_X + (i * STEP_X), FRONT_BOTTOM_Y, this.group);
    });

    // Section 3: Analog Inputs (1 Column)
    const S3_X = 1.75;
    addFrontPort(S3_X, FRONT_TOP_Y, this.group);
    addFrontPort(S3_X, FRONT_BOTTOM_Y, this.group);

    // Blue Neon Accent Dividers (3 vertical lines from image)
    const dividerMat = new MeshBasicMaterial({ color: 0x00d8ff });
    const divGeo = new BoxGeometry(0.012, 0.38, 0.01);
    function addFrontDivider(x, group) {
      const div = new Mesh(divGeo, dividerMat);
      div.position.set(x, 0, FRONT_SURFACE_Z + 0.002);
      group.add(div);
    }
    addFrontDivider(-1.60, this.group); // Left of Digital Markers
    addFrontDivider(-0.30, this.group); // Between Markers and Outputs
    addFrontDivider(1.45, this.group);  // Between Outputs and Inputs


    // ==========================================
    // BACK PANEL SIDE (Z < 0)
    // ==========================================
    const BACK_SURFACE_Z = BACK_Z - 0.005;

    // Dual Fan Assembly
    const fanPlate = new Mesh(new BoxGeometry(1.6, 0.85, 0.01), darkPlastMat);
    fanPlate.position.set(-1.5, 0, BACK_SURFACE_Z);
    this.group.add(fanPlate);

    const fanSilGeo = new CylinderGeometry(0.32, 0.32, 0.01, 16);
    fanSilGeo.rotateX(Math.PI / 2);
    const fan1 = new Mesh(fanSilGeo, new MeshStandardMaterial({ color: 0x222222 }));
    fan1.position.set(-1.9, 0, BACK_SURFACE_Z - 0.005);
    const fan2 = fan1.clone();
    fan2.position.set(-1.1, 0, BACK_SURFACE_Z - 0.005);
    this.group.add(fan1, fan2);

    // Green Terminal Blocks
    const greenXPositions = [-0.32, 0.04, 0.40, 0.76, 1.14, 1.50];
    
    const BLOCK_W = 0.24;
    const BLOCK_H = 0.14;
    const BLOCK_D = 0.08;
    const PIN_COUNT = 4; // Each block houses 4 terminal slots
    
    greenXPositions.forEach(x => {
      const blockGroup = new Group();
      blockGroup.position.set(x, 0.35, BACK_SURFACE_Z);

      // Main outer shell (back wall / frame)
      const shellGeo = new BoxGeometry(BLOCK_W, BLOCK_H, BLOCK_D * 0.4);
      const shell = new Mesh(shellGeo, greenMat);
      shell.position.z = -BLOCK_D * 0.2;
      blockGroup.add(shell);

      // Top and bottom protective lips to form the "hollow box" shape
      const lipGeo = new BoxGeometry(BLOCK_W, 0.015, BLOCK_D);
      const topLip = new Mesh(lipGeo, greenMat);
      topLip.position.set(0, (BLOCK_H / 2) - 0.0075, -BLOCK_D / 2);
      
      const botLip = topLip.clone();
      botLip.position.y = -(BLOCK_H / 2) + 0.0075;
      
      // Side walls
      const sideGeo = new BoxGeometry(0.015, BLOCK_H, BLOCK_D);
      const leftWall = new Mesh(sideGeo, greenMat);
      leftWall.position.set(-(BLOCK_W / 2) + 0.0075, 0, -BLOCK_D / 2);
      
      const rightWall = leftWall.clone();
      rightWall.position.x = (BLOCK_W / 2) - 0.0075;

      blockGroup.add(topLip, botLip, leftWall, rightWall);

      // Interior vertical divider prongs/teeth visible in the image
      const toothGeo = new BoxGeometry(0.012, BLOCK_H * 0.7, BLOCK_D * 0.8);
      const interiorMat = new MeshStandardMaterial({ color: 0x008754, roughness: 0.6 }); // Slightly darker inside for depth shadows
      
      // Calculate spacing to fit 4 prongs inside evenly
      const spacing = BLOCK_W / (PIN_COUNT + 1);
      for (let i = 1; i <= PIN_COUNT; i++) {
        const tooth = new Mesh(toothGeo, interiorMat);
        tooth.position.set(
          -(BLOCK_W / 2) + (i * spacing), 
          0, 
          -BLOCK_D * 0.5
        );
        blockGroup.add(tooth);
      }

      this.group.add(blockGroup);
    });

    // Connectivity Ports
    const lan = new Mesh(new BoxGeometry(0.14, 0.14, 0.08), silverMat);
    lan.position.set(0.0, 0.1, BACK_SURFACE_Z - 0.04);

    const usbStack = new Mesh(new BoxGeometry(0.14, 0.18, 0.06), silverMat);
    usbStack.position.set(0.0, -0.18, BACK_SURFACE_Z - 0.03);
    const qsfp = new Mesh(new BoxGeometry(0.22, 0.12, 0.08), silverMat);
    qsfp.position.set(0.4, 0.1, BACK_SURFACE_Z - 0.04);
    const syncPort = new Mesh(new BoxGeometry(0.35, 0.08, 0.04), silverMat);
    syncPort.position.set(0.85, 0.1, BACK_SURFACE_Z - 0.02);
    this.group.add(lan, usbStack, qsfp, syncPort);

    // Multi-pin Blocks
    const mp1 = new Mesh(new BoxGeometry(0.22, 0.32, 0.06), darkPlastMat);
    mp1.position.set(1.25, 0.12, BACK_SURFACE_Z - 0.03);
    const mp2 = mp1.clone();
    mp2.position.set(1.55, 0.12, BACK_SURFACE_Z - 0.03);
    this.group.add(mp1, mp2);

    // Rear SMA Ports
    function addRearSMA(x, y, group) {
      const base = new Mesh(new CylinderGeometry(0.035, 0.035, 0.06, 12), goldMat);
      base.rotation.x = Math.PI / 2;
      base.position.set(x, y, BACK_SURFACE_Z - 0.03);
      group.add(base);
    }
    addRearSMA(0.35, -0.18, this.group);
    addRearSMA(0.70, -0.18, this.group);
    addRearSMA(1.05, -0.18, this.group);
    addRearSMA(1.35, -0.18, this.group);
    addRearSMA(1.65, -0.18, this.group);

    // Power Module
    const pwrTrim = new Mesh(new BoxGeometry(0.26, 0.32, 0.02), redMat);
    pwrTrim.position.set(2.1, 0.22, BACK_SURFACE_Z - 0.01);
    const pwrSwitch = new Mesh(new BoxGeometry(0.2, 0.24, 0.03), darkPlastMat);
    pwrSwitch.position.set(2.1, 0.22, BACK_SURFACE_Z - 0.02);
    const acSocket = new Mesh(new BoxGeometry(0.26, 0.3, 0.06), darkPlastMat);
    acSocket.position.set(2.1, -0.16, BACK_SURFACE_Z - 0.03);
    this.group.add(pwrTrim, pwrSwitch, acSocket);
  }
}