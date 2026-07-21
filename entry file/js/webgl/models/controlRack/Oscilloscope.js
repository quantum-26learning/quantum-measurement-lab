import * as THREE from 'three';

export default class Oscilloscope{
    constructor(){
        this.group = new THREE.Group
        this.createModel()
    }
    createModel(){
        // ---------- Materials ----------
const chassisMat = new THREE.MeshStandardMaterial({ color: 0xf1efe9, metalness: 0.04, roughness: 0.5 });
const panelMat = new THREE.MeshStandardMaterial({ color: 0xbdbab3, metalness: 0.06, roughness: 0.48 });
const darkTrimMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2e, metalness: 0.2, roughness: 0.5 });
const screenBezelMat = new THREE.MeshStandardMaterial({ color: 0x131315, metalness: 0.25, roughness: 0.4 });
const screenGlassMat = new THREE.MeshStandardMaterial({
  color: 0x05070a, emissive: 0x0a1420, emissiveIntensity: 0.25, metalness: 0.1, roughness: 0.12,
});
const buttonMat = new THREE.MeshStandardMaterial({ color: 0xf4f2ec, metalness: 0.02, roughness: 0.5 });
const knobMat = new THREE.MeshStandardMaterial({ color: 0xeceae4, metalness: 0.08, roughness: 0.42 });
const knobBaseMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3d, metalness: 0.25, roughness: 0.4 });
const silverMat = new THREE.MeshStandardMaterial({ color: 0xc9cdd1, metalness: 0.9, roughness: 0.22 });
const rubberFootMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.1, roughness: 0.9 });
const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf4c400, metalness: 0.15, roughness: 0.4, emissive: 0xf4c400, emissiveIntensity: 0.12 });
const greenMat = new THREE.MeshStandardMaterial({ color: 0x2fbf5a, metalness: 0.15, roughness: 0.4, emissive: 0x2fbf5a, emissiveIntensity: 0.12 });
const runGreenMat = new THREE.MeshStandardMaterial({ color: 0x28c76f, metalness: 0.1, roughness: 0.4, emissive: 0x1f8f4f, emissiveIntensity: 0.5 });
const labelMat = new THREE.MeshStandardMaterial({ color: 0x9aa5ab, metalness: 0.1, roughness: 0.6 });

// ---------- Text label helper (functional numbers only, no branding) ----------
function createLabelPlane(text, { width = 0.1, height = 0.06, fontSize = 46, color = '#2a2a2c' } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  const geo = new THREE.PlaneGeometry(width, height);
  return new THREE.Mesh(geo, mat);
}


// ---------- Main Enclosure ----------
const CHASSIS_W = 3.6, CHASSIS_H = 2.2, CHASSIS_D = 1.3;
const chassisGeo = new THREE.BoxGeometry(CHASSIS_W, CHASSIS_H, CHASSIS_D, 4, 4, 4);
const chassis = new THREE.Mesh(chassisGeo, chassisMat);
chassis.castShadow = true;
chassis.receiveShadow = true;
chassis.position.y = CHASSIS_H / 2;
this.group.add(chassis);

// Beveled edge accent around the chassis top for a crisper, machined edge
const edgeFrameGeo = new THREE.BoxGeometry(CHASSIS_W + 0.01, 0.015, CHASSIS_D + 0.01);
const edgeFrame = new THREE.Mesh(edgeFrameGeo, silverMat);
edgeFrame.position.y = CHASSIS_H + 0.003;
this.group.add(edgeFrame);

// Thin metallic trim strip separating the light chassis shell from the control panel band
const trimStrip = new THREE.Mesh(new THREE.BoxGeometry(CHASSIS_W - 0.02, 0.012, 0.02), silverMat);
trimStrip.position.set(0, CHASSIS_H * 0.955, CHASSIS_D / 2 + 0.008);
this.group.add(trimStrip);

// Rounded corner trim (quarter-round columns) softening the four vertical edges, chassis-colored
const cornerRadius = 0.05;
[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
  const cornerGeo = new THREE.CylinderGeometry(cornerRadius, cornerRadius, CHASSIS_H, 16);
  const corner = new THREE.Mesh(cornerGeo, chassisMat);
  corner.position.set(sx * (CHASSIS_W / 2 - cornerRadius), CHASSIS_H / 2, sz * (CHASSIS_D / 2 - cornerRadius));
  corner.castShadow = true; corner.receiveShadow = true;
  this.group.add(corner);
});

// Feet
const footGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.09, 16);
[[-CHASSIS_W / 2 + 0.28, -CHASSIS_D / 2 + 0.22], [CHASSIS_W / 2 - 0.28, -CHASSIS_D / 2 + 0.22],
 [-CHASSIS_W / 2 + 0.28, CHASSIS_D / 2 - 0.22], [CHASSIS_W / 2 - 0.28, CHASSIS_D / 2 - 0.22]]
  .forEach(([x, z]) => {
    const foot = new THREE.Mesh(footGeo, rubberFootMat);
    foot.position.set(x, -0.045, z);
    foot.castShadow = true; foot.receiveShadow = true;
    this.group.add(foot);
  });

// (top carry handle removed per request — chassis top is now smooth)


// ---------- Front Panel ----------
const PANEL_W = CHASSIS_W - 0.05;
const PANEL_H = CHASSIS_H - 0.04;
const PANEL_D = 0.035;
const facePanel = new THREE.Mesh(new THREE.BoxGeometry(PANEL_W, PANEL_H, PANEL_D), panelMat);
facePanel.position.set(0, CHASSIS_H / 2, CHASSIS_D / 2 + PANEL_D / 2 - 0.004);
facePanel.castShadow = true; facePanel.receiveShadow = true;
this.group.add(facePanel);
const panelFrontZ = facePanel.position.z + PANEL_D / 2;

// ---------- Display Screen (blank, no waveform) ----------
const SCREEN_W = 1.5, SCREEN_H = 1.1;
const SCREEN_X = -PANEL_W / 2 + SCREEN_W / 2 + 0.14;
const SCREEN_Y = CHASSIS_H * 0.58;

const bezel = new THREE.Mesh(new THREE.BoxGeometry(SCREEN_W + 0.14, SCREEN_H + 0.14, 0.03), screenBezelMat);
bezel.position.set(SCREEN_X, SCREEN_Y, panelFrontZ + 0.014);
bezel.castShadow = true; bezel.receiveShadow = true;
this.group.add(bezel);

const screen = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W, SCREEN_H), screenGlassMat);
screen.position.set(SCREEN_X, SCREEN_Y, panelFrontZ + 0.031);
this.group.add(screen);

// subtle glossy diagonal highlight across the glass, typical of an LCD cover lens
const glossMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.04 });
const gloss = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W * 0.9, SCREEN_H * 0.35), glossMat);
gloss.position.set(SCREEN_X - SCREEN_W * 0.08, SCREEN_Y + SCREEN_H * 0.22, panelFrontZ + 0.0316);
gloss.rotation.z = 0.25;
this.group.add(gloss);

// small power/status LED at the bezel's lower-right corner
const screenLedMat = new THREE.MeshStandardMaterial({ color: 0x2fbf5a, emissive: 0x2fbf5a, emissiveIntensity: 1.6 });
const screenLed = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 12), screenLedMat);
screenLed.position.set(SCREEN_X + SCREEN_W / 2 - 0.06, SCREEN_Y - SCREEN_H / 2 - 0.07, panelFrontZ + 0.02);
this.group.add(screenLed);

// thin inner grid lines etched into the blank screen (very subtle, no waveform)
const gridLineMat = new THREE.MeshBasicMaterial({ color: 0x14202c, transparent: true, opacity: 0.5 });
for (let i = 1; i < 8; i++) {
  const vLine = new THREE.Mesh(new THREE.PlaneGeometry(0.004, SCREEN_H - 0.04), gridLineMat);
  vLine.position.set(SCREEN_X - SCREEN_W / 2 + (i * SCREEN_W) / 8, SCREEN_Y, panelFrontZ + 0.0315);
  this.group.add(vLine);
}
for (let i = 1; i < 6; i++) {
  const hLine = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W - 0.04, 0.004), gridLineMat);
  hLine.position.set(SCREEN_X, SCREEN_Y - SCREEN_H / 2 + (i * SCREEN_H) / 6, panelFrontZ + 0.0315);
  this.group.add(hLine);
}
// slightly brighter center crosshair lines, matching a scope graticule
const gridCenterMat = new THREE.MeshBasicMaterial({ color: 0x1c2e3e, transparent: true, opacity: 0.75 });
const vCenter = new THREE.Mesh(new THREE.PlaneGeometry(0.006, SCREEN_H - 0.04), gridCenterMat);
vCenter.position.set(SCREEN_X, SCREEN_Y, panelFrontZ + 0.0316);
this.group.add(vCenter);
const hCenter = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W - 0.04, 0.006), gridCenterMat);
hCenter.position.set(SCREEN_X, SCREEN_Y, panelFrontZ + 0.0316);
this.group.add(hCenter);

// ---------- Softkey column (right of screen) ----------
const softkeyX = SCREEN_X + SCREEN_W / 2 + 0.16;
const softkeyYs = [];
for (let i = 0; i < 5; i++) softkeyYs.push(SCREEN_Y + SCREEN_H / 2 - 0.08 - i * ((SCREEN_H - 0.16) / 4));
softkeyYs.forEach(y => {
  const btn = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.09, 0.025), buttonMat);
  btn.position.set(softkeyX, y, panelFrontZ + 0.015);
  btn.castShadow = true; btn.receiveShadow = true;
  this.group.add(btn);

  // faint highlight ridge on the button face for a pressed-key look
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.006, 0.002), darkTrimMat);
  ridge.position.set(softkeyX, y - 0.026, panelFrontZ + 0.028);
  this.group.add(ridge);

  // matching menu tick etched into the screen edge, just inside the glass
  const tick = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.008), gridCenterMat);
  tick.position.set(SCREEN_X + SCREEN_W / 2 - 0.03, y, panelFrontZ + 0.0316);
  this.group.add(tick);
});

// ---------- Reusable builders ----------
function buildButton(w, h, d, mat, color) {
  const useMat = color ? new THREE.MeshStandardMaterial({ color, metalness: 0.08, roughness: 0.5 }) : mat;
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, useMat);
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}

function buildKnob(radius, height, ringColor) {
  const g = new THREE.Group();

  const baseGeo = new THREE.CylinderGeometry(radius * 1.22, radius * 1.22, 0.016, 24);
  const base = new THREE.Mesh(baseGeo, knobBaseMat);
  base.rotation.x = Math.PI / 2;
  g.add(base);

  if (ringColor) {
    const ringGeo = new THREE.TorusGeometry(radius * 1.08, 0.016, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: ringColor, metalness: 0.1, roughness: 0.35, emissive: ringColor, emissiveIntensity: 0.22 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = 0.01;
    g.add(ring);
  }

  const bodyGeo = new THREE.CylinderGeometry(radius, radius, height, 24);
  const body = new THREE.Mesh(bodyGeo, knobMat);
  body.rotation.x = Math.PI / 2;
  body.position.z = 0.02 + height / 2;
  g.add(body);

  const notchCount = 12;
  for (let i = 0; i < notchCount; i++) {
    const a = (i / notchCount) * Math.PI * 2;
    const notchGeo = new THREE.BoxGeometry(0.005, height * 0.7, 0.008);
    const notch = new THREE.Mesh(notchGeo, darkTrimMat);
    notch.position.set(Math.cos(a) * radius * 0.99, Math.sin(a) * radius * 0.99, 0.02 + height / 2);
    notch.rotation.z = a;
    g.add(notch);
  }

  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.012, 12), new THREE.MeshStandardMaterial({ color: 0x2a2a2c }));
  dot.position.set(0, radius * 0.6, 0.02 + height + 0.001);
  g.add(dot);

  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

function buildBNC(ringColorHex) {
  const g = new THREE.Group();

  const flangeGeo = new THREE.CylinderGeometry(0.078, 0.078, 0.018, 24);
  const flange = new THREE.Mesh(flangeGeo, silverMat);
  flange.rotation.x = Math.PI / 2;
  flange.position.z = 0.009;
  g.add(flange);

  if (ringColorHex) {
    const ringGeo = new THREE.TorusGeometry(0.078, 0.012, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: ringColorHex, metalness: 0.2, roughness: 0.35, emissive: ringColorHex, emissiveIntensity: 0.15 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = 0.02;
    g.add(ring);
  }

  const barrelGeo = new THREE.CylinderGeometry(0.056, 0.056, 0.075, 20);
  const barrel = new THREE.Mesh(barrelGeo, silverMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = 0.058;
  g.add(barrel);

  [-1, 1].forEach(s => {
    const pinGeo = new THREE.BoxGeometry(0.016, 0.016, 0.022);
    const pin = new THREE.Mesh(pinGeo, silverMat);
    pin.position.set(s * 0.056, 0, 0.055);
    g.add(pin);
  });

  const insulGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.018, 16);
  const insulMat = new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.6 });
  const insul = new THREE.Mesh(insulGeo, insulMat);
  insul.rotation.x = Math.PI / 2;
  insul.position.z = 0.104;
  g.add(insul);

  const centerPinGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.02, 8);
  const centerPin = new THREE.Mesh(centerPinGeo, silverMat);
  centerPin.rotation.x = Math.PI / 2;
  centerPin.position.z = 0.114;
  g.add(centerPin);

  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

// ---------- Right control cluster ----------
const ctrlGroup = new THREE.Group();

// Navigation cluster (entry knob + arrow buttons) — top of the control area
const navX = 0.55, navY = 1.5;
const navKnob = buildKnob(0.09, 0.05, null);
navKnob.position.set(navX, navY, panelFrontZ);
ctrlGroup.add(navKnob);
[[0, 0.16], [0, -0.16], [-0.16, 0], [0.16, 0]].forEach(([dx, dy]) => {
  const arrowBtn = buildButton(0.075, 0.075, 0.02, buttonMat);
  arrowBtn.position.set(navX + dx, navY + dy, panelFrontZ + 0.01);
  ctrlGroup.add(arrowBtn);
  // tiny directional arrow mark etched onto each nav button
  const arrowMark = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 0.025), darkTrimMat);
  arrowMark.position.set(navX + dx, navY + dy, panelFrontZ + 0.021);
  arrowMark.rotation.z = Math.atan2(dy, dx) + Math.PI / 4;
  ctrlGroup.add(arrowMark);
});
// two small utility buttons flanking the nav pad (e.g. Back / Print equivalents)
[[navX - 0.34, 'l'], [navX + 0.34, 'r']].forEach(([x]) => {
  const navSideBtn = buildButton(0.09, 0.07, 0.02, buttonMat);
  navSideBtn.position.set(x, navY, panelFrontZ + 0.01);
  ctrlGroup.add(navSideBtn);
});

// Menu button grid (4 x 3) with small etched icon marks — function keys below the nav pad
const gridStartX = 1.2, gridStartY = 1.65;
const iconShapes = ['circle', 'square', 'line', 'triangle'];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 4; c++) {
    const btn = buildButton(0.1, 0.07, 0.02, buttonMat);
    const bx = gridStartX + c * 0.135, by = gridStartY - r * 0.1;
    btn.position.set(bx, by, panelFrontZ + 0.01);
    ctrlGroup.add(btn);

    const shape = iconShapes[(r * 4 + c) % iconShapes.length];
    let iconGeo;
    if (shape === 'circle') iconGeo = new THREE.CircleGeometry(0.012, 12);
    else if (shape === 'square') iconGeo = new THREE.PlaneGeometry(0.02, 0.02);
    else if (shape === 'triangle') iconGeo = new THREE.CircleGeometry(0.013, 3);
    else iconGeo = new THREE.PlaneGeometry(0.024, 0.005);
    const icon = new THREE.Mesh(iconGeo, darkTrimMat);
    icon.position.set(bx, by, panelFrontZ + 0.021);
    ctrlGroup.add(icon);
  }
}

// Utility row (larger function buttons) beneath the menu grid
const utilY = gridStartY - 3 * 0.1 - 0.08;
[1.05, 1.25, 1.45, 1.65].forEach((x) => {
  const utilBtn = buildButton(0.16, 0.06, 0.02, buttonMat);
  utilBtn.position.set(x, utilY, panelFrontZ + 0.01);
  ctrlGroup.add(utilBtn);
  const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.006), darkTrimMat);
  dash.position.set(x, utilY, panelFrontZ + 0.021);
  ctrlGroup.add(dash);
});

// Horizontal + Trigger + Run row — one shared row, as on the real instrument
const horizRowY = 1.05;

// Horizontal timebase knob (dark, left of the row) with a fine-adjust cap ring
const horizKnob = buildKnob(0.1, 0.06, null);
horizKnob.position.set(0.15, horizRowY, panelFrontZ);
ctrlGroup.add(horizKnob);
const horizCap = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.018, 20), knobMat);
horizCap.rotation.x = Math.PI / 2;
horizCap.position.set(0.15, horizRowY, panelFrontZ + 0.095);
ctrlGroup.add(horizCap);
const horizCapDot = new THREE.Mesh(new THREE.CircleGeometry(0.007, 10), new THREE.MeshStandardMaterial({ color: 0x2a2a2c }));
horizCapDot.position.set(0.15, horizRowY + 0.028, panelFrontZ + 0.104);
ctrlGroup.add(horizCapDot);

// Trigger knob + level LED + mode buttons, next to the horizontal knob
const trigX = 0.55;
const trigKnob = buildKnob(0.075, 0.05, 0xe0e0e0);
trigKnob.position.set(trigX, horizRowY, panelFrontZ);
ctrlGroup.add(trigKnob);
const trigLed = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffb020, emissive: 0xffb020, emissiveIntensity: 1.3 }));
trigLed.position.set(trigX - 0.13, horizRowY + 0.1, panelFrontZ + 0.015);
ctrlGroup.add(trigLed);
[-1, 1].forEach(s => {
  const modeBtn = buildButton(0.065, 0.05, 0.02, buttonMat);
  modeBtn.position.set(trigX + s * 0.1, horizRowY - 0.12, panelFrontZ + 0.01);
  ctrlGroup.add(modeBtn);
});

// Run/Stop, Single, Auto-scale buttons, completing the row on the right
const runBtn = buildButton(0.13, 0.13, 0.025, runGreenMat);
runBtn.position.set(1.55, horizRowY, panelFrontZ + 0.012);
ctrlGroup.add(runBtn);
const runRing = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.006, 8, 24), silverMat);
runRing.position.set(1.55, horizRowY, panelFrontZ + 0.02);
ctrlGroup.add(runRing);

const singleBtn = buildButton(0.11, 0.11, 0.025, buttonMat);
singleBtn.position.set(1.33, horizRowY, panelFrontZ + 0.012);
ctrlGroup.add(singleBtn);

const autoBtn = buildButton(0.11, 0.11, 0.025, buttonMat);
autoBtn.position.set(1.0, horizRowY, panelFrontZ + 0.012);
ctrlGroup.add(autoBtn);

// Channel vertical knobs (colored rings), aligned directly above their matching BNC jacks below
const channelRowY = 0.72;
const channelSubY = channelRowY - 0.16;

const ch1Knob = buildKnob(0.1, 0.06, 0xf4c400);
ch1Knob.position.set(0.55, channelRowY, panelFrontZ);
ctrlGroup.add(ch1Knob);
const ch1SubKnob = buildKnob(0.045, 0.03, 0xf4c400);
ch1SubKnob.position.set(0.55, channelSubY, panelFrontZ);
ctrlGroup.add(ch1SubKnob);

const ch2Knob = buildKnob(0.1, 0.06, 0x2fbf5a);
ch2Knob.position.set(1.1, channelRowY, panelFrontZ);
ctrlGroup.add(ch2Knob);
const ch2SubKnob = buildKnob(0.045, 0.03, 0x2fbf5a);
ch2SubKnob.position.set(1.1, channelSubY, panelFrontZ);
ctrlGroup.add(ch2SubKnob);

// Math/Ref channel button between the two channel knob columns
const mathBtn = buildButton(0.09, 0.06, 0.02, buttonMat);
mathBtn.position.set(0.825, channelRowY, panelFrontZ + 0.01);
ctrlGroup.add(mathBtn);

this.group.add(ctrlGroup);

// ---------- Bottom connector strip ----------
const stripY = 0.22;
const stripBand = new THREE.Mesh(new THREE.BoxGeometry(PANEL_W - 0.06, 0.34, 0.012), darkTrimMat);
stripBand.position.set(0, stripY, panelFrontZ + 0.006);
this.group.add(stripBand);

// thin divider ticks between each connector group along the strip
[-1.44, -1.0, 0.28, 0.83].forEach(x => {
  const tick = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.24, 0.014), new THREE.MeshStandardMaterial({ color: 0x1a1a1c }));
  tick.position.set(x, stripY, panelFrontZ + 0.007);
  this.group.add(tick);
});

// Power button
const powerBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.025, 24), buttonMat);
powerBtn.rotation.x = Math.PI / 2;
powerBtn.position.set(-1.55, stripY, panelFrontZ + 0.02);
powerBtn.castShadow = true; powerBtn.receiveShadow = true;
this.group.add(powerBtn);
const powerRing = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.006, 8, 20), silverMat);
powerRing.position.set(-1.55, stripY, panelFrontZ + 0.033);
this.group.add(powerRing);
// small power-on indicator LED beside the switch
const powerLedMat = new THREE.MeshStandardMaterial({ color: 0x2fbf5a, emissive: 0x2fbf5a, emissiveIntensity: 1.5 });
const powerLed = new THREE.Mesh(new THREE.SphereGeometry(0.01, 10, 10), powerLedMat);
powerLed.position.set(-1.55, stripY + 0.1, panelFrontZ + 0.02);
this.group.add(powerLed);

// USB port
const usbOuter = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.02), darkTrimMat);
usbOuter.position.set(-1.32, stripY, panelFrontZ + 0.016);
this.group.add(usbOuter);
const usbInner = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, 0.018), new THREE.MeshStandardMaterial({ color: 0x050505 }));
usbInner.position.set(-1.32, stripY, panelFrontZ + 0.02);
this.group.add(usbInner);

// Probe compensation terminal (small ground loop + signal tab, common calibration point)
const probeCompGroup = new THREE.Group();
const compBase = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.014), darkTrimMat);
probeCompGroup.add(compBase);
const compTabGeo = new THREE.BoxGeometry(0.014, 0.05, 0.006);
const compTab1 = new THREE.Mesh(compTabGeo, silverMat);
compTab1.position.set(-0.018, 0.005, 0.011);
probeCompGroup.add(compTab1);
const compTab2 = new THREE.Mesh(compTabGeo, silverMat);
compTab2.position.set(0.018, 0.005, 0.011);
probeCompGroup.add(compTab2);
const compLoop = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.004, 6, 16, Math.PI), silverMat);
compLoop.position.set(0, -0.02, 0.011);
probeCompGroup.add(compLoop);
probeCompGroup.position.set(-1.1, stripY, panelFrontZ + 0.013);
probeCompGroup.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
this.group.add(probeCompGroup);

// External trigger BNC (neutral silver ring)
const trigBNC = buildBNC(0xb5bbc0);
trigBNC.position.set(-0.05, stripY, panelFrontZ);
this.group.add(trigBNC);
const trigLabel = createLabelPlane('EXT', { width: 0.14, height: 0.05, fontSize: 34, color: '#3a3a3c' });
trigLabel.position.set(-0.05, stripY - 0.13, panelFrontZ + 0.012);
this.group.add(trigLabel);

// Channel 1 BNC (yellow)
const ch1BNC = buildBNC(0xf4c400);
ch1BNC.position.set(0.55, stripY, panelFrontZ);
this.group.add(ch1BNC);
const ch1Label = createLabelPlane('1', { width: 0.08, height: 0.06, fontSize: 48, color: '#8a6d00' });
ch1Label.position.set(0.55, stripY - 0.13, panelFrontZ + 0.012);
this.group.add(ch1Label);

// Channel 2 BNC (green)
const ch2BNC = buildBNC(0x2fbf5a);
ch2BNC.position.set(1.1, stripY, panelFrontZ);
this.group.add(ch2BNC);
const ch2Label = createLabelPlane('2', { width: 0.08, height: 0.06, fontSize: 48, color: '#1c7a3d' });
ch2Label.position.set(1.1, stripY - 0.13, panelFrontZ + 0.012);
this.group.add(ch2Label);

// ---------- Rear panel details ----------
const backZ = -CHASSIS_D / 2 - 0.004;
const rearVentGroup = new THREE.Group();
for (let i = 0; i < 16; i++) {
  const slatGeo = new THREE.BoxGeometry(0.022, 0.9, 0.012);
  const slat = new THREE.Mesh(slatGeo, darkTrimMat);
  slat.position.set(-1.3 + i * 0.05, CHASSIS_H * 0.55, backZ);
  rearVentGroup.add(slat);
}
this.group.add(rearVentGroup);

const powerInlet = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.11, 0.03), darkTrimMat);
powerInlet.position.set(1.3, CHASSIS_H * 0.3, backZ - 0.01);
this.group.add(powerInlet);

// Cooling fan grille (concentric rings + radial blades) beside the vent slats
const fanGroup = new THREE.Group();
const fanOuterGeo = new THREE.RingGeometry(0.12, 0.135, 32);
const fanOuter = new THREE.Mesh(fanOuterGeo, darkTrimMat);
fanGroup.add(fanOuter);
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2;
  const bladeGeo = new THREE.BoxGeometry(0.11, 0.012, 0.006);
  const blade = new THREE.Mesh(bladeGeo, darkTrimMat);
  blade.position.set(Math.cos(a) * 0.06, Math.sin(a) * 0.06, 0.002);
  blade.rotation.z = a;
  fanGroup.add(blade);
}
const fanHub = new THREE.Mesh(new THREE.CircleGeometry(0.02, 16), darkTrimMat);
fanHub.position.z = 0.004;
fanGroup.add(fanHub);
fanGroup.position.set(1.0, CHASSIS_H * 0.55, backZ);
this.group.add(fanGroup);

// LAN (ethernet) port
const lanOuter = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.1, 0.03), darkTrimMat);
lanOuter.position.set(0.55, CHASSIS_H * 0.3, backZ - 0.01);
this.group.add(lanOuter);
const lanInner = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.024), new THREE.MeshStandardMaterial({ color: 0x050505 }));
lanInner.position.set(0.55, CHASSIS_H * 0.3, backZ - 0.006);
this.group.add(lanInner);
[0.024, -0.024].forEach(dy => {
  const lanLed = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), new THREE.MeshStandardMaterial({ color: 0x2fbf5a, emissive: 0x2fbf5a, emissiveIntensity: 1.0 }));
  lanLed.position.set(0.55 - 0.075, CHASSIS_H * 0.3 + dy, backZ - 0.008);
  this.group.add(lanLed);
});

// USB device port (square, rear)
const usbDevOuter = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.02), darkTrimMat);
usbDevOuter.position.set(0.2, CHASSIS_H * 0.3, backZ - 0.005);
this.group.add(usbDevOuter);

// Kensington security lock slot
const kensingtonGeo = new THREE.BoxGeometry(0.045, 0.018, 0.02);
const kensington = new THREE.Mesh(kensingtonGeo, new THREE.MeshStandardMaterial({ color: 0x050505 }));
kensington.position.set(-0.15, CHASSIS_H * 0.3, backZ - 0.005);
this.group.add(kensington);

// Blank rating / compliance plate (no printed text, just the recessed plate)
const ratingPlate = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.32, 0.006), new THREE.MeshStandardMaterial({ color: 0xf0efe9, roughness: 0.6 }));
ratingPlate.position.set(-1.5, CHASSIS_H * 0.28, backZ - 0.003);
this.group.add(ratingPlate);
for (let i = 0; i < 4; i++) {
  const ratingLine = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.012), new THREE.MeshStandardMaterial({ color: 0xb9b7b0 }));
  ratingLine.position.set(-1.5, CHASSIS_H * 0.28 + 0.1 - i * 0.06, backZ - 0.0025);
  this.group.add(ratingLine);
}

// Corner mounting screws on the rear panel
const rearScrewGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.01, 10);
[[-1.68, CHASSIS_H - 0.14], [1.68, CHASSIS_H - 0.14], [-1.68, 0.14], [1.68, 0.14]].forEach(([x, y]) => {
  const rearScrew = new THREE.Mesh(rearScrewGeo, darkTrimMat);
  rearScrew.rotation.x = Math.PI / 2;
  rearScrew.position.set(x, y, backZ - 0.006);
  this.group.add(rearScrew);
});

// Fold-out tilt legs near the rear feet, for propping the display up
[-1, 1].forEach(s => {
  const legGroup = new THREE.Group();
  const legGeo = new THREE.BoxGeometry(0.05, 0.18, 0.02);
  const leg = new THREE.Mesh(legGeo, darkTrimMat);
  leg.position.set(0, 0.09, 0);
  legGroup.add(leg);
  const legPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.06, 10), darkTrimMat);
  legPivot.rotation.z = Math.PI / 2;
  legPivot.position.set(0, 0.18, 0);
  legGroup.add(legPivot);
  legGroup.rotation.x = -0.5;
  legGroup.position.set(s * (CHASSIS_W / 2 - 0.35), 0.02, -CHASSIS_D / 2 + 0.15);
  legGroup.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  this.group.add(legGroup);
});

// ---------- Side panel ventilation louvers ----------
[-1, 1].forEach(s => {
  const sideVentGroup = new THREE.Group();
  for (let i = 0; i < 10; i++) {
    const louverGeo = new THREE.BoxGeometry(0.012, 0.55, 0.09);
    const louver = new THREE.Mesh(louverGeo, darkTrimMat);
    louver.position.set(0, CHASSIS_H * 0.62, -0.35 + i * 0.09);
    louver.rotation.y = 0.35 * s;
    sideVentGroup.add(louver);
  }
  sideVentGroup.position.set(s * (CHASSIS_W / 2 + 0.003), 0, 0);
  sideVentGroup.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  this.group.add(sideVentGroup);
});

// enable shadows across everything
this.group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    }
}