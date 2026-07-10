import './style.css'; // Vite mein CSS aise link hoti hai
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import gsap from 'gsap';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';       
import { Evaluator, Brush, SUBTRACTION } from 'three-bvh-csg';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

//***// 
//lil gui set up (*temprory)
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
const gui = new GUI();
const folder = gui.addFolder('Clicked Point');

// The object lil-gui is watching
const displayCoords = { x: 0, y: 0, z: 0 };

// Add the read-only display fields
folder.add(displayCoords, 'x').listen().disable();
folder.add(displayCoords, 'y').listen().disable();
folder.add(displayCoords, 'z').listen().disable();
//***//


// 1. Scene Setup
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0a0a0a'); 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,20,50);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



// Setup PMREM Generator for realistic reflections
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

// 2. Controls (Mouse se ghumane ke liye)
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = false;
controls.dampingFactor = 0.7;

// 3. Lighting
const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight('#ffffff', 1.5);
dirLight.position.set(15, 20, 15);
scene.add(dirLight);


//DILUTION REFRIGERATOR GROUP
const dfgroup = new THREE.Group();
scene.add(dfgroup);
dfgroup.position.set(-5.15,-3,0.15);
dfgroup.scale.set(1.2,1.2,1.2);



// Group for all Dilution Unit objects
const duGroup = new THREE.Group();
dfgroup.add(duGroup);
duGroup.visible = true;
duGroup.scale.set(0.5,1.1,0.5);
duGroup.position.set(-0.8,0,0.4);

// FLANGES
function goldplate(r, hasHoles = false) {
    const df_flange_plate = new THREE.Shape();
    df_flange_plate.absarc( 0, 0, r, 0, Math.PI * 2, false );

    if (hasHoles) {
        // holes to give flanges its swiss cheese appearance
        const numHoles = 3; 
        const holeRadius = 0.3; 
        for ( let i = 0; i < numHoles; i ++ ) {
            const angle = ( i / numHoles ) * Math.PI;
            const x = Math.cos( angle ) * r * 0.6;
            const y = Math.sin( angle ) * r * 0.6;
    
            const holePath = new THREE.Path();
            holePath.absarc( x, y, holeRadius, 0, 2 * Math.PI, true );
            df_flange_plate.holes.push( holePath );
        }
    }

    const extrudesettings = {
        depth: 0.2,
        bevelEnabled: false,
        curveSegments: 24,
    };
    
    // Creating the base geometry
    let geometry = new THREE.ExtrudeGeometry(df_flange_plate, extrudesettings);

    // ==========================================
    // CSG SPHERICAL INCISIONS (TOP AND BOTTOM)
    // ==========================================
    const incisionRadius = 0.05;
    const spacing = 0.45; // Distance between incisions

    // Base plate brush
    const plateBrush = new Brush(geometry);
    plateBrush.updateMatrixWorld();

    // Create a base cutter sphere
    const baseSphereGeo = new THREE.SphereGeometry(incisionRadius,6,6);
    const cutterGeometries = [];

    // Generate grid of spherical incisions
    for (let x = -r; x <= r; x += spacing) {
        for (let y = -r; y <= r; y += spacing) {
            // Keep incisions inside the radius (with a small margin so they don't clip the edges)
            if (x * x + y * y < (r - 0.2) * (r - 0.2)) {
                // Top spherical incision (centered at z = depth)
                const topSphere = baseSphereGeo.clone();
                topSphere.translate(x, y, extrudesettings.depth);
                cutterGeometries.push(topSphere);

                // Bottom spherical incision (centered at z = 0)
                const botSphere = baseSphereGeo.clone();
                botSphere.translate(x, y, 0);
                cutterGeometries.push(botSphere);
            }
        }
    }

    // Evaluate the CSG Subtraction if we have cutters
    if (cutterGeometries.length > 0) {
        const mergedCutters = BufferGeometryUtils.mergeGeometries(cutterGeometries);
        const cutterBrush = new Brush(mergedCutters);
        cutterBrush.updateMatrixWorld();

        const evaluator = new Evaluator();
        const result = evaluator.evaluate(plateBrush, cutterBrush, SUBTRACTION);

        // Replace our starting geometry with the CSG result
        evaluator.useGroups = false;
        geometry.dispose(); 
        geometry = result.geometry;
    }
    // // ==========================================

    const material = new THREE.MeshStandardMaterial({color: 0xd4af37, side: THREE.DoubleSide, roughness: 0.15, metalness: 1});
    const mesh = new THREE.Mesh(geometry, material);

    dfgroup.add(mesh);
    mesh.rotateX(Math.PI / 2);
    return mesh;
};

// Flange's radius and position
const plateConfigs = [
    { radius: 2.8, yPosition: 10 },
    { radius: 2.6, yPosition: 7.5 },
    { radius: 2.2, yPosition: 5 },
    { radius: 1.8, yPosition: 2.5 },
    { radius: 1.6, yPosition: 0 }
];

// Implementing the flange function
plateConfigs.forEach((config, index) => {
    const hasHoles = index >= plateConfigs.length - 3;
    const plate = goldplate(config.radius, hasHoles);
    plate.position.y = config.yPosition;
    plate.visible = true;
});

function df_pipe(r,d, x, y, z) {
    const shape = new THREE.Shape();
    shape.absarc( 0, 0, r, 0, Math.PI * 2, false );
    const extrudesettings = {
            depth: d,
            bevelEnabled: false,
            curveSegments: 64,
        };
        
    const geometry = new THREE.ExtrudeGeometry(shape, extrudesettings);
    const material = new THREE.MeshStandardMaterial({color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.2, metalness: 1});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(- Math.PI / 2);
    dfgroup.add(mesh);
    mesh.position.y = y;
    mesh.position.x = x;
    mesh.position.z = z;
    return mesh;
};

//df pipes

df_pipe(0.15, 11.4, 0.92, 0, -0.74);
df_pipe(0.2, 0.1, 0.92, 0, -0.74);

df_pipe(0.16, 11.4, -1.04, 0, 0.77);
df_pipe(0.16, 11.4, 0.95, 0, 0.79);

df_pipe(0.23, 0.1, -1.04, 0, 0.77);
df_pipe(0.23, 0.1, 0.95, 0, 0.75);



//top flange 
function top_flange(r) {
    const df_flange_plate = new THREE.Shape();
    df_flange_plate.absarc( 0, 0, r, 0, Math.PI * 2, false );

    const extrudesettings = {
        depth: 0.2,
        bevelEnabled: false,
        curveSegments: 64,
    };
    
    //creating the mesh
    const geometry = new THREE.ExtrudeGeometry(df_flange_plate, extrudesettings);
    const material = new THREE.MeshStandardMaterial({color: 0x353E43, side: THREE.DoubleSide, roughness: 0.15, metalness: 1});
    const mesh = new THREE.Mesh(geometry, material);

    dfgroup.add(mesh);
    mesh.position.y = 11.9;
    mesh.rotateX(Math.PI / 2);
    return mesh;
};

top_flange(3.5);


//top flange details
const tf_material =  new THREE.MeshStandardMaterial({color: 0x00c9fc, side: THREE.DoubleSide, roughness: 1, metalness: 1});
function tf_cylinder(r,d, x, y, z, angle, bevel = false) {
    const shape = new THREE.Shape();
    shape.absarc( 0, 0, r, 0, angle, true );
    const extrudesettings = {
            depth: d,
            bevelEnabled: bevel,
            bevelSize: 0.01,
            bevelThickness: 0.02,
            curveSegments: 64,
        };
        
    const geometry = new THREE.ExtrudeGeometry(shape, extrudesettings);
    const mesh = new THREE.Mesh(geometry, tf_material);
    mesh.position.set(x, y, z);
    mesh.rotation.x = - Math.PI / 2;
    dfgroup.add(mesh); 
    return mesh;    
};

tf_cylinder(0.2, 0.9, -1.5, 11.8, -1, Math.PI * 2);
tf_cylinder(0.24, 0.1, -1.5, 12.4, -1, Math.PI * 2);
tf_cylinder(0.35, 1.3, -1.5, 12.7, -1.15, Math.PI);
tf_cylinder(1, 0.2, 1.5, 11.9, 0, Math.PI * 2);
tf_cylinder(0.8, 0.9, 1.5, 12, 0, Math.PI * 2);
tf_cylinder(0.2, 0.7, 0.3, 11.9, 0, Math.PI * 2);
tf_cylinder(0.25, 0.01, 0.3, 12.6, 0, Math.PI * 2, true);
tf_cylinder(0.4, 0.7, -0.1, 12, 1.5, Math.PI * 2, true);
tf_cylinder(0.45, 0.1, -0.1, 12.5, 1.5, Math.PI * 2,);


//dilution unit
function cont_heatexchanger() {
    const points = [];
    for (let i = 0; i <= 150; i++) {
        const angle = i * 0.3;  // Controls how tight the coils are
        const height = i * 0.005; // Controls how tall the structure grows
        points.push(new THREE.Vector3(Math.cos(angle) * 0.5, height, Math.sin(angle) * 0.5));
    }

    const path = new THREE.CatmullRomCurve3(points);

    // Wrap a tube around that path (path, tube segments, radius, radial segments, closed loop)
    const geometry = new THREE.TubeGeometry(path, 64, 0.04, 8 , false);
    const material = new THREE.MeshStandardMaterial({ color: 0xd4af37,  side: THREE.DoubleSide, roughness: 0.1, metalness: 1});
    const mesh = new THREE.Mesh(geometry, material);
    //Adds to scene
    duGroup.add(mesh);
    mesh.position.y = 2.5; 
};

const CHE = cont_heatexchanger();

const SHE = []
function step_heatexchanger(y) {
    const geometry = new THREE.TorusGeometry( 0.5, 0.15, 3, 50 );
    const material = new THREE.MeshStandardMaterial( { color: 0xC0C0C0,  side: THREE.DoubleSide, roughness: 0.15, metalness: 1 } );
    const torus = new THREE.Mesh( geometry, material );
    duGroup.add( torus );
    torus.rotateX(Math.PI / 2);
    torus.position.y = y - 0.1;
    SHE.push(torus);
};

step_heatexchanger(1);
step_heatexchanger(1.3);
step_heatexchanger(1.6);
step_heatexchanger(1.9);

function du_cylinder(r,d, col, y) {
    const shape = new THREE.Shape();
    shape.absarc( 0, 0, r, 0, Math.PI * 2, false );
    const extrudesettings = {
            depth: d,
            bevelEnabled: false,
            curveSegments: 64,
        };
        
    const geometry = new THREE.ExtrudeGeometry(shape, extrudesettings);
    const material = new THREE.MeshStandardMaterial({color: col, side: THREE.DoubleSide, roughness: 0.05, metalness: 1});
    const mesh = new THREE.Mesh(geometry, material);
    duGroup.add(mesh);
    mesh.rotateX(- Math.PI / 2);
    mesh.position.y = y;
    return mesh;
};

const still_1 = du_cylinder(0.55, 0.2, 0xD37B37, 3.5);
const still_2 = du_cylinder(0.5, 0.4, 0xD37B37, 3.5);
const mixer = du_cylinder(0.48, 0.5,  0xE7E7E7, 0.1);
const plate1 = du_cylinder(0.75, 0.05,  0xd4af37, 0);
const plate2 = du_cylinder(0.65, 0.08,  0xc0c6c7, 0.05);
const plate3 = du_cylinder(0.75, 0.25,  0xd4af37, 2.05);
const plate4 = du_cylinder(0.75, 0.08,  0xD37B37, 3.9);
const plate5 = du_cylinder(0.35, 0.08,  0xD37B37, 3.98);
const plate6= du_cylinder(0.25, 2.6,  0xE7E7E7, 4.0);
const plate7 = du_cylinder(0.45, 0.09,  0xD37B37, 4.35);
const plate8 = du_cylinder(0.45, 0.08,   0xE7E7E7, 4.28);
const plate9 = du_cylinder(0.75, 0.08,   0xE7E7E7, 0.55);
const plate10 = du_cylinder(0.7, 0.2,   0xD37B37, 5);
const plate11= du_cylinder(0.7, 0.2,   0xE7E7E7, 4.8);


function dupipe(r,d, x, y, z) {
    const shape = new THREE.Shape();
    shape.absarc( 0, 0, r, 0, Math.PI * 2, false );
    const extrudesettings = {
            depth: d,
            bevelEnabled: false,
            curveSegments: 64,
        };
        
    const geometry = new THREE.ExtrudeGeometry(shape, extrudesettings);
    const material = new THREE.MeshStandardMaterial({color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.15, metalness: 1});
    const mesh = new THREE.Mesh(geometry, material);
    duGroup.add(mesh);
    mesh.rotateX(- Math.PI / 2);
    mesh.position.y = y;
    mesh.position.x = x;
    mesh.position.z = z;
    return mesh;
};


dupipe(0.08, 1.7, 0.6*Math.cos(Math.PI/2), 0.55, -0.6*Math.sin(Math.PI/2));
dupipe(0.08, 1.7, 0.6*Math.cos(Math.PI), 0.55, -0.6*Math.sin(Math.PI));
dupipe(0.08, 1.7, 0.6*Math.cos(Math.PI*2), 0.55, -0.6*Math.sin(Math.PI*2));
dupipe(0.08, 1.7, 0.6*Math.cos(Math.PI*1.5), 0.55, -0.6*Math.sin(Math.PI*1.5));
dupipe(0.08, 1.7, 0.6*Math.cos(Math.PI*7/6), 2.2, -0.6*Math.sin(Math.PI*7/6));
dupipe(0.08, 1.7, 0.6*Math.cos(Math.PI*11/6), 2.2, -0.6*Math.sin(Math.PI*11/6));
dupipe(0.08, 1.7, 0.6*Math.cos(Math.PI*2/3), 2.2, -0.6*Math.sin(Math.PI*2/3));





// Connecting tube from Helix to Plate 9
function connectHelixToPlate9() {
    const points = [
        new THREE.Vector3(0.5, 2.5, 0.1),       // Helix lower end
        new THREE.Vector3(0.45, 2.45, -0.1),       // Straight down through the top step heat exchanger
        new THREE.Vector3(0.45, 1.5, -0.1),       // Pass through the edge of the bottom step heat exchanger
        new THREE.Vector3(0.5, 0.85, -0.1),       // Continue straight down slightly below
        new THREE.Vector3(0.5, 0.8, 0.0),      // Curve outwards towards the edge  
        new THREE.Vector3(-0.3, 0.8, 0.0),
        new THREE.Vector3(-0.35, 0.6, 0)    // Connects to the edge of plate9
    ];
    const path = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(path, 64, 0.04, 8, false);
    const material = new THREE.MeshStandardMaterial({ color: 0xd4af37, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 });
    const mesh = new THREE.Mesh(geometry, material);
    duGroup.add(mesh);
}

connectHelixToPlate9();



// Connecting tube from Helix upper end to the plate above (Still)
function connectHelixToUpperPlate() {
    const points = [];
    
    // Continue the spiral smoothly for a bit, gradually increasing the radius
    for (let i = 150; i <= 165; i++) {
        const angle = i * 0.3;
        const height = i * 0.005 + 2.5;
        const radius = 0.5 + (i - 150) * 0.003; 
        points.push(new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius));
    }
    
    // Bend upwards to connect vertically into the plate
    const endX = points[points.length - 1].x;
    const endZ = points[points.length - 1].z;
    
    points.push(new THREE.Vector3(endX, 3.4, endZ));
    points.push(new THREE.Vector3(endX, 3.5, endZ)); // Connects to the bottom of still_1
    
    const path = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(path, 64, 0.04, 8, false);
    const material = new THREE.MeshStandardMaterial({ color: 0xd4af37, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 });
    const mesh = new THREE.Mesh(geometry, material);
    duGroup.add(mesh);
}

connectHelixToUpperPlate();



//rf cable
const rfcableGrp = new THREE.Group();
dfgroup.add(rfcableGrp);
rfcableGrp.rotation.x = -Math.PI / 2;
rfcableGrp.position.x = -0.1;
rfcableGrp.position.z = -0.8;
rfcableGrp.position.y = -0.08;
rfcableGrp.scale.set(0.4,0.4,1);
rfcableGrp.visible = true;


// 4. Plate Assembly (Plate + Connectors)
const plateGroup = new THREE.Group();

const plateGeometry = new RoundedBoxGeometry(3, 3, 0.3, 4, 0.1);
const plateMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Steel Grey
    metalness: 1,  // High metalness for a metallic look
    roughness: 0.15   // Moderate roughness for a brushed or slightly dull steel
});
const plateMesh = new THREE.Mesh(plateGeometry, plateMaterial);
plateGroup.add(plateMesh);

// Gold connector geometry and material
const conGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.2, 12);
const conMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 1,
    roughness: 0.15
});


const attenutorgroup = new THREE.Group();
 
 
 attenutorgroup.position.x = -0.6;
 attenutorgroup.position.z = -0.1;
 attenutorgroup.position.y = -0.06;
 
 
 // attenutor main body
// attenutor main body
 const multiattenutor = new THREE.Group();
 const attenutorgeometry = new THREE.CylinderGeometry(1, 1, 2.2);
 const attenutormaterial = new THREE.MeshStandardMaterial({
     color:0xD4AF37,
     metalness:1,
     roughness:0.15,
     clearcoat :0.4,
     clearcoatRoughness :0
 });
 const attmainbody = new THREE.Mesh(attenutorgeometry,attenutormaterial);
 
 multiattenutor.add(attmainbody);
 
 // female centre contact
 const femaleccGeom = new THREE.CylinderGeometry(0.1,0.1,2);
 const femalecc = new THREE.Mesh(femaleccGeom,attenutormaterial);
 multiattenutor.add(femalecc);
 femalecc.position.set(0,0.7,0);
 
 
 
 // female end
 const femaleendgroup = new THREE.Group();
 const femaleendshape = new THREE.Shape();
femaleendshape.absarc(0, 0, 0.6, 0, Math.PI * 2);

const femaleendhole = new THREE.Path();
femaleendhole.absarc(0, 0, 0.45, 0, Math.PI * 2);

femaleendshape.holes.push(femaleendhole);

const femaleendgeometry = new THREE.ExtrudeGeometry(femaleendshape, {
    depth: 1.7,
    bevelEnabled: false
});

femaleendgeometry.rotateX(Math.PI / 2);

const femaleEnd = new THREE.Mesh(
    femaleendgeometry,
    attenutormaterial
);

femaleendgroup.add(femaleEnd);
femaleEnd.position.set(0,1.7,0);
 
 
 //ring fashion in female eend
 for(let i=1.2;i<=1.7;i+=0.15){
     const femaleringGeom = new THREE.TorusGeometry(0.4, 0.1, 16, 100);
     const femalering = new THREE.Mesh(femaleringGeom, attenutormaterial);
     femalering.rotation.x =Math.PI/2;
     femalering.position.set(0.05,i,0);
     femaleendgroup.add(femalering);
     multiattenutor.add(femaleendgroup);
 
 }
 
 
 
 
 //hexagon nut
 function Hexnut(radius ,thickness){
     const hexnutshape = new THREE.Shape();
     for(let i=0;i<6;i++){
         const hexnutangle = i*Math.PI/3;
         const x = radius*Math.cos(hexnutangle);
         const y = radius*Math.sin(hexnutangle);
         if(i==0) hexnutshape.moveTo(x,y);
         else hexnutshape.lineTo(x,y);
     }
     hexnutshape.closePath();
     const hexnutGeom = new THREE.ExtrudeGeometry(hexnutshape,{
         depth:thickness,
         bevelEnabled:false
     });
     const hexnutmaterial = new THREE.MeshStandardMaterial({
     color:0xD4AF37,
     metalness:1,
     roughness:0.15,
     clearcoat :0.4,
     clearcoatRoughness :0
     });
     return new THREE.Mesh(hexnutGeom,hexnutmaterial);
 
 }
 const hexnutbody = Hexnut(0.76,1.5);
 multiattenutor.add(hexnutbody);
 hexnutbody.position.set(0,1.5,0);
 hexnutbody.rotation.x =Math.PI/2;
 
 const hexnutbody2 = Hexnut(0.75,0.7);
 multiattenutor.add(hexnutbody2);
 hexnutbody2.position.set(0,-1.3,0)
 hexnutbody2.rotation.x =Math.PI/2;
 
 // male end
 
 // Male end
const maleendgroup = new THREE.Group();

const maleendshape = new THREE.Shape();
maleendshape.absarc(0, 0, 0.6, 0, Math.PI * 2);

const hole = new THREE.Path();
hole.absarc(0, 0, 0.25, 0, Math.PI * 2);

maleendshape.holes.push(hole);

const maleEndGeom = new THREE.ExtrudeGeometry(maleendshape, {
    depth: 1.8,
    bevelEnabled: false,
    curveSegments: 64
});

maleEndGeom.rotateX(Math.PI / 2);

const maleEnd = new THREE.Mesh(
    maleEndGeom,
    attenutormaterial
);

// Center the geometry
maleEnd.position.y = -1.4;

maleendgroup.add(maleEnd);
multiattenutor.add(maleendgroup);

// Position the group
maleendgroup.position.set(0, -2.1, 0);
multiattenutor.add(maleendgroup);
 
 // ring fashion on male end
 for(let i=-3.2;i<=-2.7;i+=0.25){
     const maleringGeom = new THREE.TorusGeometry(0.6, 0.1, 16, 100);
     const malering = new THREE.Mesh(maleringGeom, attenutormaterial);
     malering.rotation.x =Math.PI/2;
     malering.position.set(0.05,i,0);
     maleendgroup.add(malering);
     multiattenutor.add(maleendgroup);
 
 }
 maleendgroup.position.y=0.5;
 
 
 multiattenutor.scale.y=0.1;
 multiattenutor.scale.x=0.1;
 multiattenutor.scale.z=0.1;
 multiattenutor.position.set(0,0,0);
 multiattenutor.rotation.z=Math.PI;

 
 attenutorgroup.add(multiattenutor);
 





rfcableGrp.add(plateGroup);

const plates = [plateGroup]; // Keep track of all plates

// Clone the entire assembly (plate + its connectors) for other levels
for (let z = 2.5; z < 11; z += 2.5) {
    const plateAssemblyClone = plateGroup.clone();
    plateAssemblyClone.position.set(0, 0, z);
    rfcableGrp.add(plateAssemblyClone);
    plates.push(plateAssemblyClone);
}

// Add connectors aligned perfectly with the curved cables
plates.forEach((plate, index) => {
    const z = index * 4.15;
    const curveOffsetX = Math.sin(z * 1.5) * 0.2;
    const curveOffsetY = Math.cos(z * 1.5) * 0.2;

for (let i = -1.2; i < 1.2; i += 0.3) {
        for (let j = -1.0; j < 1.2; j += 0.3) {
            const connector = new THREE.Mesh(conGeometry, conMaterial);
            // Position them at the cable's exact x,y + curve offset
            connector.position.set(j + curveOffsetX, i + curveOffsetY, 0.14);
            connector.rotation.x = Math.PI / 2;
           
           // Add attenuator above the connector
            const attenuator = attenutorgroup.clone();
            attenuator.position.copy(connector.position);
           
             // Slightly above the connector      
            attenuator.rotation.x=-Math.PI/2;

            if(index===0 || index===4){
                

            }else{plate.add(attenuator);

            }
            
            // create a curved cable from the connector to the attenuator
           
    }
}


    

        }
    
);

const points = [];
for (let i = 0; i <= 100; i++) {
    const z = 0.46 + (i / 100) *9.54 ; // Spans from the first to the last connector
    const x = Math.sin((z - 0.14) * 2.49) * 0.2 + 0.01;
    const y = Math.cos((z - 0.14) * 2.49) * 0.2;
    points.push(new THREE.Vector3(x, y, z));
}
const curve = new THREE.CatmullRomCurve3(points); // Curve for the wire path
const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.025, 8, false);
const tubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xE7E7E7,
    metalness: 1,
    roughness: 0.15

 });

 // Assuming you want to offset each cable along the y-axis
 for(let i = -1.18; i < 1.2; i+=0.3) {
    for(let j = -1.08; j < 1.2; j+=0.3) {
    const cable = new THREE.Mesh(tubeGeometry, tubeMaterial);
    cable.position.y = i;
    cable.position.x = j;
    // Adjust the y-position for each cable
    rfcableGrp.add(cable);
 }

 }

 //----------------
 //rf filter
 //----------------
 const rffilterGrp = new THREE.Group();
 const rffiltergeom = new THREE.BoxGeometry(0.22, 0.2, 2.5, 32);
  const rffilter = new THREE.Mesh(rffiltergeom,attenutormaterial);
  rffilter.position.set(1.2,0,0.34);
  rffilter.rotation.x = Math.PI/2;
  rffilterGrp.add(rffilter);
 
  const rffilterbaseGeom = new THREE.BoxGeometry(0.22,0.09,2.5,32);
  const rffilterbasemat = new THREE.MeshStandardMaterial({color:0xB87333,metalness:1,roughness:0.3});
  const rffilterbase = new THREE.Mesh(rffilterbaseGeom,rffilterbasemat);
  rffilterbase.position.set(1.2,0.,0.2);
 rffilterbase.rotation.x = Math.PI/2;
 rffilterGrp.add(rffilterbase);
 
 const rffilterbaseplateG = new RoundedBoxGeometry(0.22, 0.01, 2.7, 2,0.02);
 const rffilterbaseplate = new THREE.Mesh(rffilterbaseplateG,rffilterbasemat);
  rffilterbaseplate.position.set(1.2,-0,0.15);
 rffilterbaseplate.rotation.x = Math.PI/2;
 rffilterGrp.add(rffilterbaseplate);
 
 
 
 //sma connector
 const baseattGroup= new THREE.Group();
 //baseattGroup.add(attmainbody);
 baseattGroup.add(femalecc);
 baseattGroup.add(femaleendgroup);
 baseattGroup.add(hexnutbody);
 baseattGroup.scale.set(0.1,0.1,0.1);
 baseattGroup.position.set(1.2,-1.09,0.4);
 baseattGroup.rotation.x = Math.PI/2;
 
 //rfcableGrp.add(baseattGroup);
 
 
        for (let y = -1.061; y < 1.061; y += 0.3) {
    
       
         const multirfconnector = baseattGroup.clone();
         multirfconnector.position.set(1.185, y, 0.32); // sits on top of filter
         rffilterGrp.add(multirfconnector);
     }
 
 rfcableGrp.add(rffilterGrp);
 
 // Remove the old x-only loop
 // Remove the old x-only loop
 // Remove the old x-only loop
 for(let k=-2.1;k<=-0.2;k+=0.3){
     const multirffilter = rffilterGrp.clone();
     multirffilter.position.x=k;
     rfcableGrp.add(multirffilter);
};
 

//still pump line
const pumpline = new THREE.Group();
dfgroup.add(pumpline);
pumpline.scale.set(0.6,0.65,0.6)
pumpline.position.set(-0.8,7.8,0.2);

function createPumpLineAssembly() {
    const points = [
        new THREE.Vector3(0, -0.5, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(-1.5, 2, 0),
        new THREE.Vector3(-1.5, 3, 0),
    ];
    
    // 1. Define the base path shared by both the tube and the helix
    const baseCurve = new THREE.CatmullRomCurve3(points);
    const mainTubeRadius = 0.55;

    // --- MAIN TUBE ---
    const tubeGeometry = new THREE.TubeGeometry(baseCurve, 100, mainTubeRadius, 16, false);
    const tubeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xE7E7E7, 
        metalness: 1, 
        roughness: 0.15,
        side: THREE.DoubleSide
    });
    const mainTubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    pumpline.add(mainTubeMesh);

    // --- HELIX COIL ---
    // Helix configuration
    const coils = 20; // Number of wraps
    const coilThickness = 0.05; // Radius of the wrapping wire
    const wrapRadius = mainTubeRadius + coilThickness; // Keeps it right on the surface
    
    // Define the "middle part" using percentage along the curve (0.0 to 1.0)
    const tStart = 0.35; 
    const tEnd = 0.62;   
    const helixSegments = 500;
    const helixPoints = [];

    // Pre-compute local orientations (normals/binormals) along the base curve
    const frameDetail = 1000;
    const frames = baseCurve.computeFrenetFrames(frameDetail, false);

    for (let i = 0; i <= helixSegments; i++) {
        // u goes from 0 to 1 (progress along the helix itself)
        const u = i / helixSegments; 
        
        // t maps u to the chosen segment of the base curve (0.25 to 0.75)
        const t = tStart + u * (tEnd - tStart); 

        // 1. Get the center point on the base curve at t
        const pointOnCurve = baseCurve.getPoint(t);

        // 2. Get the local normal and binormal vectors at t
        const frameIdx = Math.floor(t * frameDetail);
        const normal = frames.normals[frameIdx];
        const binormal = frames.binormals[frameIdx];

        // 3. Calculate rotation angle for this step
        const angle = u * Math.PI * 2 * coils;

        // 4. Calculate X and Y offsets in local space
        const xOffset = Math.cos(angle) * wrapRadius;
        const yOffset = Math.sin(angle) * wrapRadius;

        // 5. Apply offsets along local normal and binormal to get final 3D position
        const helixPoint = new THREE.Vector3().copy(pointOnCurve)
            .addScaledVector(normal, xOffset)
            .addScaledVector(binormal, yOffset);

        helixPoints.push(helixPoint);
    }

    // Create a curve from our generated spiral points
    const helixCurve = new THREE.CatmullRomCurve3(helixPoints);
    
    // Create the geometry and mesh for the helix
    const helixGeometry = new THREE.TubeGeometry(helixCurve, helixSegments, coilThickness, 8, false);
    const helixMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x71797E,
        metalness: 1, 
        roughness: 0.15 
    });
    const helixMesh = new THREE.Mesh(helixGeometry, helixMaterial);
    
    pumpline.add(helixMesh);
    
    function cylinder(r, d, y) {
        const shape = new THREE.Shape();
        shape.absarc(0, 0, r, 0, Math.PI * 2, false);
        const extrudesettings = {
            depth: d,
            bevelEnabled: false,
            curveSegments: 64,
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudesettings);
        const material = new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.05, metalness: 1 });
        const mesh = new THREE.Mesh(geometry, material);
        pumpline.add(mesh);
        mesh.rotateX(-Math.PI / 2);
        mesh.position.y = y;
        mesh.position.x = -1.5;
        return mesh;
    };

    cylinder(0.8, 0.5, 2.9);
    cylinder(1.2, 0.3, 3.4);
    cylinder(1.1, 0.4, 3.6);
    cylinder(1.2, 3.5, 4);
    cylinder(1.3, 0.4, 7);
    cylinder(1.3, 0.4, 7.5);


    function rectangle(w, h, angle, x, y, z) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(w, 0);
        shape.lineTo(w, h);
        shape.lineTo(0, h);
        shape.lineTo(0, 0);
        const extrudesettings = {
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.2,
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudesettings);
        const material = new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.05, metalness: 1 });
        const mesh = new THREE.Mesh(geometry, material);
        pumpline.add(mesh);
        mesh.position.y = y;
        mesh.position.x = x;
        mesh.position.z = z;
        mesh.rotateY(angle);
        return mesh;
    };

    rectangle(0.4, 0.7, 0 ,-1.92, 7.3, 1.3);
    rectangle(0.4, 0.7, Math.PI/6, -2.55, 7.3, -1.2);
    rectangle(0.4, 0.7, Math.PI/1.8, -0.22, 7.3, -0.2);

    function cylinder_caps(r, d, angle, x, y, z) {
        const shape = new THREE.Shape();
        shape.absarc(0, 0, r, 0, Math.PI * 2, false);
        const extrudesettings = {
            depth: d,
            bevelEnabled: false,
            curveSegments: 64,
        };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudesettings);
        const material = new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.05, metalness: 1 });
        const mesh = new THREE.Mesh(geometry, material);
        pumpline.add(mesh);
        mesh.rotateX(-Math.PI / 2);
        mesh.position.y = y;
        mesh.position.x = x;
        mesh.position.z = z;
        mesh.rotateY(angle);
        return mesh;
    }

    cylinder_caps(0.2, 0.1, 0, -1.73, 8.1, 1.37);
    cylinder_caps(0.2, 0.1, 0, -2.35, 8.1, -1.2);
    cylinder_caps(0.2, 0.1, 0, -0.14, 8.1, -0.4);
    cylinder_caps(0.15, 1, Math.PI/2, -3.5, 6.68, -0.01);
    cylinder_caps(0.25, 0.2, Math.PI/2, -3.5, 6.68, -0.01);
    cylinder_caps(0.2, 0.2, Math.PI/2, -3, 6.68, -0.01);
    cylinder_caps(0.7, 0.2, 0, 0, -0.45, 0);
    cylinder_caps(0.6, 0.6, 0, 0, -1, 0);
  
  function ptc_pumpline_junction() {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 1.4, 64),
      new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.05, metalness: 1 })
    );
    mesh.position.y = -1.4;
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = -Math.PI / 2;
    mesh.position.x = 1;
    mesh.scale.set (1,1.5,0.5);
    pumpline.add(mesh);

    const mesh2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.9, 64),
      new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.05, metalness: 1 })
    );
    mesh2.position.y = -1.1;
    mesh2.position.x = 2.2;
    pumpline.add(mesh2);
  }
  ptc_pumpline_junction();
};


createPumpLineAssembly();

function jt() {
  const points = [];
    for (let i = 0; i <= 150; i++) {
        const angle = i * 0.6;  // Controls how tight the coils are
        const height = i * 0.005; // Controls how tall the structure grows
        points.push(new THREE.Vector3(Math.cos(angle) * 0.4, height, Math.sin(angle) * 0.4));
    }

    const path = new THREE.CatmullRomCurve3(points);

    // Wrap a tube around that path (path, tube segments, radius, radial segments, closed loop)
    const geometry = new THREE.TubeGeometry(path, 64, 0.025, 10 , false);
    const material = new THREE.MeshStandardMaterial({ color: 0xC0C0C0,  side: THREE.DoubleSide, roughness: 0.1, metalness: 1});
    const mesh = new THREE.Mesh(geometry, material);
    //Adds to scene
    duGroup.add(mesh);
    mesh.position.y = 5.4; 
}

jt();


function createBolt(radius, numBolts, x, y, z) {
    const cloneGroup = new THREE.Group(); 
    const boltGroup = new THREE.Group();
    
    // 1. Single metallic material for the whole bolt
    const steelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x889498,   // Steel gray
        metalness: 0.9,    // Highly metallic
        roughness: 0.25    // Slightly glossy
    });

    // 2. Hexagonal Head (using 6 radial segments)
    const head = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.2, 6),
        steelMaterial
    );
    
    // 3. Washer (adds a nice realistic detail under the head)
    const washer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.05, 10),
        steelMaterial
    );
    washer.position.y = -0.125;

    // 4. Smooth Shaft
    const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1, 16),
        steelMaterial
    );
    shaft.position.y = -0.8; 
    
    boltGroup.add(head, washer, shaft);
    boltGroup.scale.set(0.2, 0.2, 0.2);  
    
    
    for (let i = 0; i < numBolts; i++) {
        const clone = boltGroup.clone();
        const angle = (i / numBolts) * Math.PI * 2;
        
        clone.position.x = Math.cos(angle) * radius;
        clone.position.z = Math.sin(angle) * radius;
        cloneGroup.add(clone);
        cloneGroup.position.set(x,y,z);
        dfgroup.add(cloneGroup);
    }
}

createBolt(1.5, 10, 0, 0.03, 0);
createBolt(0.5, 3, 0, 0.03, 0);
createBolt(0.4, 6, -0.8, 2.53, 0.2);
createBolt(1.7, 12, 0, 2.53, 0);
createBolt(1.9, 12, 0, 5.03, 0);
createBolt(0.3, 6, -0.8, 5.03, 0.2);
createBolt(2.3, 15, 0, 7.53, 0);
createBolt(0.6, 6, -0.8, 7.53, 0.2);
createBolt(2.5, 15, 0, 10.03, 0);
createBolt(0.9, 9, 1, 10.25, 0.2);
createBolt(0.75, 8, -1.7, 10.03, 0.2);
createBolt(3, 15, 0, 11.95, 0);
createBolt(0.8, 8, -1.7, 11.95, 0.2);
createBolt(0.4, 4, -0.2, 10.1, -0.72);

//PTC
// =================================================
// Materials
// =================================================

const silverMaterial =
  new THREE.MeshPhysicalMaterial({
    color: 0xd6d6d6,
    metalness: 1,
    roughness: 0.15
  });

const housingMaterial =
  new THREE.MeshPhysicalMaterial({
    color: 0x636A6E,
    metalness: 1,
    roughness: 0.15
  });

const copperMaterial =
  new THREE.MeshPhysicalMaterial({
    color: 0xb87333,
    metalness: 1,
    roughness: 0.15
  });

// =================================================
// Pulse Cooler Group
// =================================================

const pulseCooler = new THREE.Group();
dfgroup.add(pulseCooler);
pulseCooler.position.y = 12.5;
pulseCooler.scale.set(0.8,0.6,0.8)
pulseCooler.position.x = 1;
pulseCooler.position.z = 0.2;

// =================================================
// Top Cap
// =================================================
const ptcheadgrp = new THREE.Group();
const topCap = new THREE.Mesh(
  new THREE.CylinderGeometry(
    0.9,
    0.9,
    1.4,
    64
  ),
  housingMaterial
);

topCap.position.y = 2.0;

ptcheadgrp.add(topCap);
const topRing = new THREE.Mesh(
  new THREE.CylinderGeometry(
    1.15,
    1.15,
    0.15,
    64
  ),
  silverMaterial
);

topRing.position.y = 1.25;

ptcheadgrp.add(topRing);

// =================================================
// Main Housing
// =================================================

const housing = new THREE.Mesh(
  new THREE.CylinderGeometry(
    1.3,
    1.3,
    2.5,
    64
  ),
  housingMaterial
);

housing.position.y = 0.15;

ptcheadgrp.add(housing);


for(let i = 0; i < 8; i++){

  const angle = (i / 8) * Math.PI * 2;

  const bolt = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.07,
      0.07,
      0.30,
      16
    ),
    silverMaterial
  );

  bolt.position.set(
    Math.cos(angle) * 1.15,
    1.35,
    Math.sin(angle) * 1.15
  );

  ptcheadgrp.add(bolt);
}

// =================================================
// Side Connectors
// =================================================

for(let i = 0; i < 2; i++){

  const pipe = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.15,
      0.15,
      1.5,
      32
    ),
    silverMaterial
  );

  pipe.rotation.z = Math.PI / 2;

  pipe.position.set(
    1.8,
    0.5 - i * 0.6,
    0
  );

  ptcheadgrp.add(pipe);

  const fitting = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.25,
      0.25,
      0.4,
      32
    ),
    housingMaterial
  );

  fitting.rotation.z = Math.PI / 2;

  fitting.position.set(
  2.6,
  0.5 - i * 0.6,
  0
);

ptcheadgrp.add(fitting);

const collar = new THREE.Mesh(
  new THREE.CylinderGeometry(
    0.32,
    0.32,
    0.12,
    32
  ),
  silverMaterial
);

collar.rotation.z = Math.PI / 2;

collar.position.set(
  2.35,
  0.5 - i * 0.6,
  0
);

ptcheadgrp.add(collar);

}

const brassFitting = new THREE.Mesh(
  new THREE.CylinderGeometry(
    0.12,
    0.16,
    0.35,
    24
  ),
  copperMaterial
);

brassFitting.rotation.z = Math.PI / 2;

brassFitting.position.set(
  -1.38,
   0.45,
   0
);
// Brass fitting wire curve
    const brassFittingWireCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.79, 13.33, 3), // Start at brass fitting
    new THREE.Vector3(1.79, 13.80, 3.50), // Straight section
    new THREE.Vector3(1.85, 14.60, 3.55), // Gentle bend begins
    new THREE.Vector3(2.10, 16.00, 3.80),
    new THREE.Vector3(2.60, 18.00, 4.20),
    new THREE.Vector3(3.20, 20.50, 4.80)  // Continue toward destination
]);

brassFittingWireCurve.curveType = "centripetal";
brassFittingWireCurve.tension = 0.2;


const brassFittingWire = new THREE.Mesh(
    new THREE.TubeGeometry(brassFittingWireCurve, 100, 0.03, 12, false),
    new THREE.MeshStandardMaterial({
        color:'black',
        metalness: 0.9,
        roughness: 0.3
    })
);

//brassFitting.add(brassFittingWire);

ptcheadgrp.add(brassFitting);



// =================================================
// Mounting Flange
// =================================================

const flange = new THREE.Mesh(
  new THREE.CylinderGeometry(
    1.8,
    1.8,
    0.9,
    64
  ),
  housingMaterial
);

flange.position.y = -1.4;

ptcheadgrp.add(flange);

for(let i = 0; i < 12; i++){

  const angle =
    (i / 12) * Math.PI * 2;

  const bolt =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.06,
        0.06,
        0.12,
        16
      ),
      silverMaterial
    );

  bolt.position.set(
    Math.cos(angle) * 1.55,
    -0.88,
    Math.sin(angle) * 1.55
  );

  ptcheadgrp.add(bolt);
}
pulseCooler.add(ptcheadgrp);
ptcheadgrp.position.set(6, 1, 4);

// =================================================
// Vacuum Tube
// =================================================

const polishedSteel =
  new THREE.MeshPhysicalMaterial({
    color: 'silver',
    roughness: 0.15,
    metalness: 1
  });

const rightUpperCylinder =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.45,
      0.45,
      3.5,
      64
    ),
    silverMaterial
  );

rightUpperCylinder.position.set(
  0.35,
  -3.0,
  0
);

pulseCooler.add(rightUpperCylinder);


const leftRod =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.20,
      0.12,
      7.8,
      32
    ),
    silverMaterial
  );

leftRod.position.set(
  -0.65,
  -4.5,
  0
);

pulseCooler.add(leftRod);



// =================================================
// Copper Stage
// =================================================

const stage = new THREE.Mesh(
  new THREE.CylinderGeometry(
    1.25,
    1.25,
    0.8,
    64
  ),
  copperMaterial
);

stage.position.y = -4.2;

pulseCooler.add(stage);
const copperCollar = new THREE.Mesh(
  new THREE.CylinderGeometry(
    0.75,
    0.75,
    1,
    64
  ),
  copperMaterial
);

copperCollar.position.set(
  0.35,
  -3.5,
  0
);

pulseCooler.add(copperCollar);

// =================================================
// Support Rods
// =================================================

for(const x of [-0.5, 0.5]){

  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.18,
      0.18,
      3.9,
      32
    ),
    silverMaterial
  );

  rod.position.set(
    x,
    -6.0,
    0
  );

  pulseCooler.add(rod);

  const rodCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.28,
      0.28,
      0.30,
      32
    ),
    copperMaterial
  );

  rodCollar.position.set(
    x,
    -8.0,
    0
  );

  pulseCooler.add(rodCollar);
}

// =================================================
// Bottom Plate
// =================================================

const bottomPlate = new THREE.Mesh(
  new THREE.CylinderGeometry(
    1.1,
    1.1,
    0.25,
    64
  ),
  copperMaterial
);

bottomPlate.position.y = -8.3;

pulseCooler.add(bottomPlate);

// =================================================
// Bolts
// =================================================

for(let i = 0; i < 8; i++){

  const angle =
    (i / 8) * Math.PI * 2;

  const bolt = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.08,
      0.08,
      0.1,
      16
    ),
    housingMaterial
  );

  bolt.position.set(
    Math.cos(angle) * 0.9,
    -8.15,
    Math.sin(angle) * 0.9
  );

  pulseCooler.add(bolt);
}


//dfcase

const cryocase = new THREE.Group();
const material = new THREE.MeshStandardMaterial({ color: 0xb87333, side: THREE.DoubleSide, metalness: 1, roughness: 0.15});
// scene.add(cryocase)

// Define structural tiers: [outerRadius, innerRadius, depth/height]
const tiers = [
  [2.6, 0.0, 0.2], // Solid base (closes the bottom)
  [2.6, 2.4, 3.8], // Bottom hollow section
  [2.8, 2.6, 0.1], // Flange 1
  [2.7, 2.5, 3.5], // Middle hollow section
  [2.9, 2.7, 0.1], // Flange 2
  [2.8, 2.6, 3.5], // Top hollow section
  [3, 2.7, 0.1]  // Top flange (open top)
];

let currentY = 0;

tiers.forEach(([outR, inR, height]) => {
  const shape = new THREE.Shape().absarc(0, 0, outR, 0, Math.PI * 2, false);
  
  // Create hollow interior by adding a hole path
  if (inR > 0) {
    shape.holes.push(new THREE.Path().absarc(0, 0, inR, 0, Math.PI * 2, true));
  }

  const geometry = new THREE.ExtrudeGeometry(shape, { 
    depth: height, 
    curveSegments: 64, 
    bevelEnabled: true 
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  // ExtrudeGeometry extrudes along +Z. Rotate -90° on X to stack vertically along +Y.
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = currentY;
  
  cryocase.add(mesh);
  currentY += height;
});



//pulse tube compressor


// 2. CPA010 Components (Scaled for 8 x 4 x 5 box)
const machineGroup = new THREE.Group();

// Main Body (Chassis) - Now 8x6.5x5
const bodyGeom = new THREE.BoxGeometry(8, 6.5, 5);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x71797E, metalness: 1, roughness: 0.15 }); // Industrial Gray
const body = new THREE.Mesh(bodyGeom, bodyMat);
machineGroup.add(body);

//front panel with controls (Scaled and positioned)
const panelGeom = new THREE.BoxGeometry(4, 2.2, 0.1 ); // Rounded box for front panel
const panelMat = new THREE.MeshStandardMaterial({ color: "black", metalness: 0.8, roughness: 0.2 });
machineGroup.add(new THREE.Mesh(panelGeom, panelMat));
machineGroup.children[1].position.set(0, 1.5, 2.55); // Front panel slightly protruding
//start button
const buttonGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 32);
const buttonMat = new THREE.MeshStandardMaterial({ color: 0x71797E, metalness: 0.7, roughness: 0.3});

const button= new THREE.Mesh(buttonGeom, buttonMat);
button.rotation.x = Math.PI / 2;
machineGroup.add(button);
machineGroup.children[2].position.set(1.4,1.7,2.55);

//green ring
const ringGeom =new THREE.RingGeometry(0.2,0.28,16);
const ringMat =new THREE.MeshStandardMaterial({color:'green'});
const ring = new THREE.Mesh(ringGeom,ringMat);
ring.rotation.z = Math.PI/2;
machineGroup.add(ring);
ring.position.set(1.4,1.7,2.64);



//screens (Scaled and positione 
const screenGeom = new THREE.BoxGeometry(2, 1.1, 0.05);
const screenMat = new THREE.MeshStandardMaterial({ color: 'white', emissive: 'white', emissiveIntensity: 0.5 });
const screen =new THREE.Mesh(screenGeom, screenMat);
machineGroup.add(screen);
screen.position.set(0, 1.5, 2.6); // Screens slightly protruding
// Screens slightly protruding


// MCB body
const mcbBody = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 1.4, 0.1),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);

// Front panel position
mcbBody.position.set(-2.5, 1.3, 2.5);
machineGroup.add(mcbBody);

// MCB lever
const lever = new THREE.Mesh( new THREE.BoxGeometry(0.3, 0.7, 0.05),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);

lever.rotation.z = 0; // ON position
lever.position.set(0, -0.2, 0.15);
mcbBody.add(lever);

// MCB label
const labelGeom = new THREE.BoxGeometry(0.7, 0.2, -0.005);
const labelMat = new THREE.MeshStandardMaterial({ color: 'red' });
const label = new THREE.Mesh(labelGeom, labelMat);
label.position.set(0, 0.35, 0.13);
mcbBody.add(label);

// Handle Bars (Scaled and positioned)
function createHandle(xPos) {
    const handleGroup = new THREE.Group();
    const handleMat = new THREE.MeshStandardMaterial({ color: 'black' });
    
    // Vertical grip (Scaled to 1.6 units long)
    const gripGeom = new THREE.CylinderGeometry(0.15, 0.15, 2.2);
    
    const grip = new THREE.Mesh(gripGeom, handleMat);
    
    // Top/Bottom supports (Scaled)
    const supportGeom = new THREE.BoxGeometry(0.15, 0.15, 1.2);
    const topSup = new THREE.Mesh(supportGeom, handleMat);
    topSup.position.set(0, 1.1, 0.6);
    const botSup = new THREE.Mesh(supportGeom, handleMat);
    botSup.position.set(0, -1.1, 0.6);

    handleGroup.add(grip, topSup, botSup);
    handleGroup.rotation.y= Math.PI ; // Rotate to be horizontal
    handleGroup.position.set(xPos, 1.6, 2.5 + 0.3); // Extends slightly past front
    return handleGroup;
}
// Handles shifted outward to match the new width
machineGroup.add(createHandle(3.5), createHandle(-3.5)); // Rotate handles to be vertical

// red wala label
const geometries = new THREE.BoxGeometry(8, 0.4, 0.1);
const redmaterial = new THREE.MeshStandardMaterial({ color: 'red',metalness:0.8,roughness:0.1 });
const redlabel = new THREE.Mesh(geometries, redmaterial);
redlabel.position.set(0,0 , 2.5);
machineGroup.add(redlabel);

//ventilation grill


for (let i = -15; i <5; i+=0.6){
    const grillGeom =new THREE.BoxGeometry(5.1, 0.05, 0.1);
    const grillMat=new THREE.MeshStandardMaterial({ color: 0x71797E,metalness:0.7,roughness:0.15  });
    const grill = new THREE.Mesh(grillGeom,grillMat);
    grill.position.set(-1.5, i * 0.15-1.0,2.45);
  machineGroup.add(grill);
}
for (let i = -26.8; i <8; i+=2){
    const grillvGeom =new THREE.BoxGeometry(0.1, 3.0, 0.1);
    const grillvMat=new THREE.MeshStandardMaterial({ color: 0x71797E,metalness:0.7,roughness:0.15 });
    const grillv = new THREE.Mesh(grillvGeom,grillvMat);
    grillv.position.set(i*0.15, -1.75,2.45);
  machineGroup.add(grillv);
}
// Low Pressure Gauge/Knob
const loader = new THREE.TextureLoader();

loader.load('pressuregaug.jpeg', (texture) => {
    texture.center.set(0.5,0.5);
    texture.rotation=Math.PI/2;


    const knobGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 32);

    const knobMat = new THREE.MeshBasicMaterial({
        map : texture,
    
        side: THREE.DoubleSide
    });
    const knob = new THREE.Mesh(knobGeom, knobMat);
    knob.position.set(3.3, -1,2.5 );
    knob.rotation.x =Math.PI/2;
    loader.anisotropy = renderer.capabilities.getMaxAnisotropy();
    loader.generateMipmaps = true;
    
    machineGroup.add(knob);

    const knob2 = knob.clone();
    knob2.position.x = 1.7;
    machineGroup.add(knob2);
    console.log("Texture loaded");
});




// Caster Wheels
function createWheel(x, z) {
    const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6, 0.35, 16),
        new THREE.MeshStandardMaterial({ color: 'black', metalness: 0.5, roughness: 0.5 })
    );
    wheel.rotation.z = Math.PI / 2;
    // Y positioned half-height down (-2) minus half of the wheel's thickness (-0.1)
    wheel.position.set(x, -3.3, z);
    return wheel;
}
machineGroup.add(
    createWheel(3.2, 1.7), 
    createWheel(-3.2, 1.7), 
    createWheel(3.2, -1.7), 
    createWheel(-3.2, -1.7)
);

// 2

// ring for the fornt side
for(let i = -3; i < 1; i+=0.05){
  const compressorringGeom =new THREE.RingGeometry(0.1,0.2,16);
  const compressorringMat =new THREE.MeshStandardMaterial({color:0x636A6E, metalness:1, roughness:0.15});
  const compressorring = new THREE.Mesh(compressorringGeom,compressorringMat);
  compressorring.rotation.z = Math.PI/2;
  machineGroup.add(compressorring);
  compressorring.position.set(3.3,-2 ,2.55+i*0.15);
  const compressorring2=compressorring.clone();
  machineGroup.add(compressorring2);
  compressorring2.position.set(1.7, -2, 2.55+i*0.15);
  

}
scene.add(machineGroup);
machineGroup.position.set(27,-5,0);




//PTC se connecting tube
const hoseMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.45,
    metalness: 0.15
});


function compressor_pipes() {
    const points_1 = [
         new THREE.Vector3(3.24, 12.84, 0.18),
         new THREE.Vector3(4.5, 13.1, 0.18),
         new THREE.Vector3(6, 13.2, 0.18),
         new THREE.Vector3(10, 12.5, 0.18),

// smooth hanging section
         new THREE.Vector3(11,12,0.18),
         new THREE.Vector3(12,11,0.18),
         new THREE.Vector3(13,9.5,-4),
         new THREE.Vector3(16,-3,-8),
         new THREE.Vector3(19, -3, -5.0),
         new THREE.Vector3(22, -7.8, -8),

// connection side
         new THREE.Vector3(22,-7.8,-8),
         new THREE.Vector3(22.5,-7.6,-7),
         new THREE.Vector3(22.11,-7.4,-6),
         new THREE.Vector3(22.11,-7.3,-5),
         new THREE.Vector3(22.11,-7.2,-4),

         new THREE.Vector3(22.11,-7.2,3.5),
         new THREE.Vector3(26,-7.1,3.5),
         new THREE.Vector3(28.2,-7.0,4),
         new THREE.Vector3(28.58,-6.97,2.7),
    ];
        
    
        const points_2 = [
        new THREE.Vector3(3.24, 12.44, 0.18),
         new THREE.Vector3(4.5, 12.5, 0.18),
         new THREE.Vector3(6, 12.6, 0.18),
         new THREE.Vector3(10, 11.9, 0.18),

// smooth hanging section
         new THREE.Vector3(11,11.4,0.18),
         new THREE.Vector3(12,10.4,0.18),
         new THREE.Vector3(14,8.9,-4),
         new THREE.Vector3(16,-3.6,-8),
         new THREE.Vector3(19, -3.6, -5.0),
         new THREE.Vector3(22, -8.4, -8),

// connection side
         new THREE.Vector3(22,-8.4,-8),
         new THREE.Vector3(22.5,-8.2,-7),
         new THREE.Vector3(22.11,-8,-6),
         new THREE.Vector3(22.11,-7.9,-5),
         new THREE.Vector3(22.11,-7.8,-4),

         new THREE.Vector3(22.11,-7.8,3.5),
         new THREE.Vector3(26,-7.7,3.5),
         new THREE.Vector3(28.2,-7.6,4),
         new THREE.Vector3(30.5,-6.87,2.7),
    ];
   
 

    const connectingwiregroup = new THREE.Group();
    const curve_1 = new THREE.CatmullRomCurve3(points_1);
    curve_1.curveType ="chordal";
    curve_1.tension =0;
    const geo_1 = new THREE.TubeGeometry(curve_1, 64, 0.1, 8, false,'centripetal');
    const curve_2 = new THREE.CatmullRomCurve3(points_2);
    const geo_2 = new THREE.TubeGeometry(curve_2, 64, 0.1, 8, false,'centripetal');
    const hoseMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.45,
      metalness: 0.15
    });
    const pipe_1 = new THREE.Mesh(geo_1, hoseMaterial);
    const pipe_2 = new THREE.Mesh(geo_2, hoseMaterial);
    connectingwiregroup.add(pipe_1);
    connectingwiregroup.add(pipe_2);

  

    scene.add(connectingwiregroup);
};

compressor_pipes();

//STAND

// 0. MATERIALS
const aluminumMaterial = new THREE.MeshStandardMaterial({ color: '#c5cbd1', metalness: 0.9, roughness: 0.1 });
const darkFrameMaterial = new THREE.MeshStandardMaterial({ color: '#1c1f22', roughness: 0.7 });
const roofPlateMaterial = new THREE.MeshStandardMaterial({ color: '#3a414a', metalness: 0.9, roughness: 0.3 }); 
const greenValveMat = new THREE.MeshStandardMaterial({ color: '#4d8060', roughness: 0.4 });

// MASTER STAND GROUP
const standGroup = new THREE.Group();

// 1. VERTICAL LEGS & BASE ADJUSTMENT FEET
const legGeo = new THREE.BoxGeometry(0.3, 7.6, 0.3);
const legPositions = [
    { x: -2, z: -2 }, { x: 4, z: -2 },
    { x: -2, z: 2 },  { x: 4, z: 2 }
];

legPositions.forEach(pos => {
    // Main vertical leg
    const leg = new THREE.Mesh(legGeo, aluminumMaterial);
    leg.position.set(pos.x, 4, pos.z);
    standGroup.add(leg);
});

// 2. MAIN HEADER BED & JOINT GUSSETS
const longHeaderGeo = new THREE.BoxGeometry(6.3, 0.5, 0.4);
const shortHeaderGeo = new THREE.BoxGeometry(0.4, 0.5, 4.4);

const h1 = new THREE.Mesh(longHeaderGeo, aluminumMaterial); h1.position.set(1, 7.6, 2); standGroup.add(h1);
const h2 = new THREE.Mesh(longHeaderGeo, aluminumMaterial); h2.position.set(1, 7.6, -2); standGroup.add(h2);
const h3 = new THREE.Mesh(shortHeaderGeo, aluminumMaterial); h3.position.set(-2, 7.6, 0); standGroup.add(h3);
const h4 = new THREE.Mesh(shortHeaderGeo, aluminumMaterial); h4.position.set(4, 7.6, 0); standGroup.add(h4);

function addGusset(x, z) {
    const gussetGeo = new THREE.BoxGeometry(0.4, 0.1, 0.3);
    const gusset = new THREE.Mesh(gussetGeo, darkFrameMaterial);
    gusset.position.set(x, 7.85, z);
    gusset.rotation.y = Math.PI /2;
    standGroup.add(gusset);
}
addGusset(2, 1.8);
addGusset(-0.8, 1.8);
addGusset(2, -1.7);
addGusset(-0.8, -1.7);

// 3. HORIZONTAL CROSS BRACES
const sideBraceGeo = new THREE.BoxGeometry(0.3, 0.4, 4.0);
const backBraceGeo = new THREE.BoxGeometry(3.1, 0.4, 0.3);
const braceHeights = [3.0, 7.6];
const left = [-2, -0.8]
const right = [4, 2]

braceHeights.forEach((h, i) => {
    const bLeft = new THREE.Mesh(sideBraceGeo, aluminumMaterial); bLeft.position.set(left[i], h, 0); standGroup.add(bLeft);
    const bRight = new THREE.Mesh(sideBraceGeo, aluminumMaterial); bRight.position.set(right[i], h, 0); standGroup.add(bRight);
    const bBack = new THREE.Mesh(backBraceGeo, aluminumMaterial); bBack.position.set(0.6, 7.6, -1.4); standGroup.add(bBack);
    const bfront = new THREE.Mesh(backBraceGeo, aluminumMaterial); bfront.position.set(0.6, 7.6, 1.45); standGroup.add(bfront);
});

//support braces
function supportBrace(x, y, z, angle) {
  const supportbracegeo = new THREE.BoxGeometry(1.6, 0.3, 0.3);
  const supportbrace = new THREE.Mesh(supportbracegeo, aluminumMaterial);
  supportbrace.position.set(x, y, z);
  supportbrace.rotation.z = angle;
  standGroup.add(supportbrace);
};

supportBrace(-1.6, 6.7, -2, Math.PI / 3);
supportBrace(-1.6, 6.7, 2, Math.PI / 3);
supportBrace(3.6, 6.7, -2, -Math.PI / 3);
supportBrace(3.6, 6.7, 2, -Math.PI / 3);

// 5. ANIMATED CLEAN SQUARE ROOF PLATFORM
const topPlateGroup = new THREE.Group();
topPlateGroup.position.set(0.25, 8.0, 0); 

// The Solid Square Roof / Ceiling plate covering the top completely
const Roof2geo = new THREE.BoxGeometry(1.6, 0.15, 4.3);
const Roof2 = new THREE.Mesh(Roof2geo, roofPlateMaterial);
Roof2.position.set(2.8, -0.05, 0);
topPlateGroup.add(Roof2);

// Add the top plate to the standGroup instead of the scene directly
standGroup.add(topPlateGroup);

// 4. TOP VALVE ARRAY ASSEMBLY
const EFAssembly= new THREE.Group();
const EFmainGeom = new THREE.BoxGeometry(1,2,2);
const EFmainmat =new THREE.MeshStandardMaterial({color:0x6B8E23,metalness:1,roughness:0.15});
const EFmain = new THREE.Mesh(EFmainGeom,EFmainmat);
EFAssembly.add(EFmain);
//EFmain.rotation.x = Math.PI/2;

const EFmain2 = EFmain.clone();
EFAssembly.add(EFmain2);
EFmain2.position.set(0,2.02,0);

const EFconnectorGeom = new THREE.CylinderGeometry(0.7,0.7,3,16,32);
const Efconnectormat = new THREE.MeshStandardMaterial({color:0x91B7D8,metalness:0.7,roughness:0.1});
const EFconnector = new THREE.Mesh(EFconnectorGeom,Efconnectormat);
EFAssembly.add(EFconnector);
EFconnector.position.set(0,0,0);
EFconnector.rotation.z= Math.PI/2;

const EFconendGeom = new THREE.SphereGeometry(0.65,32,16,0,Math.PI*2,0,Math.PI/2);
const EFconend = new THREE.Mesh(EFconendGeom,Efconnectormat);
EFAssembly.add(EFconend);
EFconend.position.set(1.3,0,0);
EFconend.rotation.z = -Math.PI/2;

const EFconend2 = EFconend.clone();
EFAssembly.add(EFconend2);
EFconend2.position.set(-1.3,0,0);

EFconend2.rotation.z=Math.PI/2;
//EFconnecting wire
const EFwirePoints = [
    new THREE.Vector3(1.95, 0, 0),   // Start from EFconnector end
    new THREE.Vector3(2.3, 0.05, 0),
    new THREE.Vector3(2.8, 0.2, -0.15),
    new THREE.Vector3(3.5, 0.4, -0.4),
    new THREE.Vector3(4.5, 0.3, -0.8)
];

const EFwireCurve = new THREE.CatmullRomCurve3(EFwirePoints);

const EFwireGeom = new THREE.TubeGeometry(
    EFwireCurve,
    100,
    0.05,
    12,
    false
);



const EFwire = new THREE.Mesh(EFwireGeom, Efconnectormat);
EFAssembly.add(EFwire);
const EFwire2 = EFwire.clone();
EFAssembly.add(EFwire2);
EFwire2.position.set(0,2.05,0);

const EFconnector2=EFconnector.clone();
EFAssembly.add(EFconnector2);
EFconnector2.position.set(0,2.05,0);

const EFconend3 = EFconend2.clone();
EFAssembly.add(EFconend3);
EFconend3.position.set(-1.3,2.05,0);

const EFconend4 = EFconend.clone();
EFAssembly.add(EFconend4);
EFconend4.position.set(1.3,2.05,0);

standGroup.add(EFAssembly);
EFAssembly.rotation.y=-Math.PI;
EFAssembly.position.set(3,8.3,-0.9);
EFAssembly.scale.set(0.4,0.4,0.4);


//------------
//top flangs view
//-----------
const topflangGrp = new THREE.Group();
const topvaccumGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
const topvaccumMat = new THREE.MeshStandardMaterial({ color: 0x2EB8FF, metalness: 1, roughness: 0.15 });
const topvaccum = new THREE.Mesh(topvaccumGeo, topvaccumMat);
topvaccum.position.set(0.6, 7.9, 0.7);
topflangGrp.add(topvaccum);

const topvaccum2 = new THREE.CircleGeometry(0.25,32);
const topvaccum2Mat = new THREE.MeshStandardMaterial({ color: 0x2EB8FF, metalness: 1, roughness: 0.15 });
const topvaccum2Mesh = new THREE.Mesh(topvaccum2, topvaccum2Mat);
topvaccum2Mesh.position.set(0.6, 8., 0.7);
topvaccum2Mesh.rotation.x = -Math.PI / 2;
topflangGrp.add(topvaccum2Mesh);
const vaccumcylindertopassemble = new THREE.Group();
const vaccumcylinderGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 32);
const vaccumcylinderMat = new THREE.MeshStandardMaterial({ color: 0x636A6E, metalness: 1, roughness: 0.15 });
const vaccumcylinder = new THREE.Mesh(vaccumcylinderGeo, vaccumcylinderMat);
vaccumcylinder.position.set(1, 7.9, 0.7);
vaccumcylindertopassemble.add(vaccumcylinder);

const vaccumcylindertop = topvaccum.clone();
vaccumcylindertop.position.set(1, 8.2, 0.7);
vaccumcylindertopassemble.add(vaccumcylindertop);
vaccumcylindertop.scale.set(0.4,0.2,0.4);
 const vaccumcylindertopring = new THREE.RingGeometry(0.09,0.13,32);
const vaccumcylindertopringMat = new THREE.MeshStandardMaterial({ color: 0x636A6E, metalness: 1, roughness: 0.15 });
const vaccumcylindertopringMesh = new THREE.Mesh(vaccumcylindertopring, vaccumcylindertopringMat);
vaccumcylindertopringMesh.position.set(1, 8.2, 0.7);
vaccumcylindertopringMesh.rotation.x = -Math.PI / 2;
vaccumcylindertopassemble.add(vaccumcylindertopringMesh);
const vaccumcylindertopring2 = new THREE.RingGeometry(0.085,0.09,32);
const vaccumcylindertopring2Mat = new THREE.MeshStandardMaterial({ color: 0x636A6E, metalness: 1, roughness: 0.15 });
const vaccumcylindertopring2Mesh = new THREE.Mesh(vaccumcylindertopring2, vaccumcylindertopring2Mat);
vaccumcylindertopring2Mesh.position.set(1, 8.23, 0.7);
vaccumcylindertopring2Mesh.rotation.x = -Math.PI / 2;
vaccumcylindertopassemble.add(vaccumcylindertopring2Mesh);
topflangGrp.add(vaccumcylindertopassemble);

const vaccumcylindertopassemble2 = vaccumcylindertopassemble.clone();
vaccumcylindertopassemble2.position.set(-0.1, 4, -0.2);
vaccumcylindertopassemble2.scale.set(0.5,0.5,0.5);
topflangGrp.add(vaccumcylindertopassemble2);
standGroup.add(topflangGrp);


scene.add(standGroup);
standGroup.scale.set(3,2.5,3);
standGroup.position.y = -8.5;
standGroup.position.x = -7;
 

//pipe connecting to gas chamber
// Materials
const pipe_material = new THREE.MeshStandardMaterial({
  color: 0xb0b0b0,
  metalness: 0.9,
  roughness: 0.25
});

const dark_metal_material = new THREE.MeshStandardMaterial({
  color: 0x999999,
  metalness: 1.0,
  roughness: 0.25
});

// Create a group to hold all pipe components
const pipe_assembly_group = new THREE.Group();

// --------------------------
// Horizontal Pipe
// --------------------------
const main_horizontal_pipe = new THREE.Mesh(
  new THREE.CylinderGeometry(0.15, 0.15, 5, 64),
  pipe_material
);
main_horizontal_pipe.rotation.z = Math.PI / 2;
main_horizontal_pipe.position.set(-0.5, 2, 0);
pipe_assembly_group.add(main_horizontal_pipe);

// --------------------------
// Elbow Bend
// --------------------------
const elbow_torus_geometry = new THREE.TorusGeometry(
  0.5,
  0.2,
  32,
  100,
  Math.PI / 2
);
const elbow_torus_mesh = new THREE.Mesh(elbow_torus_geometry, pipe_material);
elbow_torus_mesh.rotation.z = 0;
elbow_torus_mesh.position.set(2.0, 1.5, 0); // Important
pipe_assembly_group.add(elbow_torus_mesh);

const left_end_flange = new THREE.Mesh(
  new THREE.CylinderGeometry(0.24, 0.24, 0.08, 64),
  pipe_material
);
left_end_flange.rotation.z = Math.PI / 2;
left_end_flange.position.set(-2.7, 2, 0);
pipe_assembly_group.add(left_end_flange);

const elbow_connector_flange = new THREE.Mesh(
  new THREE.CylinderGeometry(0.28, 0.28, 0.10, 64),
  dark_metal_material
);
elbow_connector_flange.rotation.z = Math.PI / 2;
elbow_connector_flange.position.set(2.0, 2.0, 0);
pipe_assembly_group.add(elbow_connector_flange);

// --------------------------
// Vertical Pipe
// --------------------------
const right_vertical_pipe = new THREE.Mesh(
  new THREE.CylinderGeometry(0.20, 0.20, 1.0, 64),
  pipe_material
);
right_vertical_pipe.position.set(2.5, 1.0, 0);
pipe_assembly_group.add(right_vertical_pipe);

const bottom_base_flange = new THREE.Mesh(
  new THREE.CylinderGeometry(0.32, 0.32, 0.08, 64),
  pipe_material
);
bottom_base_flange.position.set(
  2.5,   // same X as vertical neck center
  1.0,   // near bottom of neck
  0
);
pipe_assembly_group.add(bottom_base_flange);

// --------------------------
// T-Branch Junction
// --------------------------
const t_junction_body = new THREE.Mesh(
  new THREE.CylinderGeometry(0.28, 0.28, 0.5, 64),
  pipe_material
);
t_junction_body.rotation.z = Math.PI / 2;
t_junction_body.position.set(-3, 2.0, 0);
pipe_assembly_group.add(t_junction_body); 

// left end of horizontal pipe (adjusted naming based on -3 X coordinate)
const left_side_vertical_pipe = new THREE.Mesh(
  new THREE.CylinderGeometry(0.16, 0.16, 2.5, 64),
  pipe_material
);
left_side_vertical_pipe.position.set(-3, 1.1, 0);
pipe_assembly_group.add(left_side_vertical_pipe);

const left_side_lower_collar = new THREE.Mesh(
  new THREE.CylinderGeometry(0.22, 0.22, 0.12, 64),
  pipe_material
);
left_side_lower_collar.position.set(-3, 1.75, 0);
pipe_assembly_group.add(left_side_lower_collar);

// Vertical part of T
const t_junction_vertical_stem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.22, 0.22, 0.6, 64),
  pipe_material
);
t_junction_vertical_stem.position.set(-3, 2.0, 0);
pipe_assembly_group.add(t_junction_vertical_stem);

// Horizontal part of T
const t_junction_horizontal_stem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.18, 0.18, 0.3, 64),
  pipe_material
);
t_junction_horizontal_stem.rotation.z = Math.PI / 2;
t_junction_horizontal_stem.position.set(-3, 2.0, 0);
pipe_assembly_group.add(t_junction_horizontal_stem);

const left_side_upper_dark_block = new THREE.Mesh(
  new THREE.CylinderGeometry(0.26, 0.26, 0.15, 64),
  dark_metal_material
);
left_side_upper_dark_block.position.set(-3, 2.38, 0);
pipe_assembly_group.add(left_side_upper_dark_block);

const left_side_top_cap = new THREE.Mesh(
  new THREE.CylinderGeometry(0.18, 0.18, 0.12, 64),
  pipe_material
);
left_side_top_cap.position.set(-3, 2.50, 0);
pipe_assembly_group.add(left_side_top_cap);

const left_side_lower_dark_block = new THREE.Mesh(
  new THREE.CylinderGeometry(0.26, 0.26, 0.15, 64),
  dark_metal_material
);
left_side_lower_dark_block.position.set(-3, 1.62, 0);
pipe_assembly_group.add(left_side_lower_dark_block);

const left_side_bottom_extension = new THREE.Mesh(
  new THREE.CylinderGeometry(0.18, 0.18, 0.12, 64),
  pipe_material
);

left_side_bottom_extension.position.set(-3, 1.42, 0);
pipe_assembly_group.add(left_side_bottom_extension);


const ghucollar = new THREE.Mesh(
  new THREE.CylinderGeometry(0.22, 0.22, 0.12, 64),
  pipe_material
);
ghucollar.position.set(-3,-0.1, 0);
ghucollar.rotation.x = Math.PI;
pipe_assembly_group.add(ghucollar);


//add grp to scene
// scene.add(pipe_assembly_group); 
pipe_assembly_group.scale.set(3,3,3);
pipe_assembly_group.position.set(5.8,10,0);
pipe_assembly_group.rotation.y = Math.PI;




//gas chamber

//gas chamber

// --- 4. Industrial Spec PBR Materials ---
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
const gaschambergroup = new THREE.Group();

const chamberGroup = new THREE.Group();
gaschambergroup.add(chamberGroup);

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
    gaschambergroup.add(basePlate);
    basePlate.position.y = -0.6;
    return basePlate; // Returns a single THREE.Mesh
}
createQuantumFridgeStand();

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
    gaschambergroup.add(dewar);
    return dewar;
}

createDewar();

//dewar pipe
function dewar_pipe_connector() {
    const connector = new THREE.Group();
  const path1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-25, -1.8, 1.95),
    new THREE.Vector3(-25, 1.5, 1.95),
    new THREE.Vector3(-26, 1.5, 1.95)
  ]);
  const path2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-25, -1.0, 1.95),
    new THREE.Vector3(-25, 0.6, 1.95),
    new THREE.Vector3(-26, 0.6, 1.95)
  ]);
  const geometry1 = new THREE.TubeGeometry(path1, 64, 0.2, 20, false);
  const geometry2 = new THREE.TubeGeometry(path2, 64, 0.2, 20, false);
  const material = new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 });
  const mesh1 = new THREE.Mesh(geometry1, material);
  const mesh2 = new THREE.Mesh(geometry2, material);
  connector.add(mesh1);
  connector.add(mesh2);

  const collar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32), new THREE.MeshStandardMaterial({ color: 0xb87333, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 }));
  collar1.position.set(-26, 1.5, 1.95);
  collar1.rotation.z = Math.PI / 2;
  connector.add(collar1);

  const collar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32), new THREE.MeshStandardMaterial({ color: 0xb87333, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 }));
  collar2.position.set(-26, 0.6, 1.95);
  collar2.rotation.z = Math.PI / 2;
  connector.add(collar2);
  connector.position.set(0.65, -0.14, 0.1);
  connector.scale.set(0.05, 0.08, 0.05);
  gaschambergroup.add(connector);
  return connector;
}

dewar_pipe_connector();

function dewar_pipe() {
    const pipe = new THREE.Group();
  const path1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.65, -0.018, 0.198),
    new THREE.Vector3(-0.8, -0.05, 0.2),
    new THREE.Vector3(-0.8, -0.1, 0.3),
    new THREE.Vector3(-0.7, -0.2, 0.4),
    new THREE.Vector3(-0.5, -0.3, 0.45),
    new THREE.Vector3(-0.3, -0.28, 0.4),
    new THREE.Vector3(-0.31, -0.28, 0.33),
  ]);
  const path2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.65, -0.09, 0.198),
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
  gaschambergroup.add(pipe);
}
dewar_pipe();

scene.add(gaschambergroup);
gaschambergroup.scale.set(11.7,11.7,9);
gaschambergroup.position.set(16,0.8,0)


//======
//ROOM |
//======
//Floor

const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshPhysicalMaterial({ color: 0x1c1c1c, metalness: 1});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -8;
scene.add(floor);

// const wallGeometry = new THREE.PlaneGeometry(100, 200);
// const wallMaterial = new THREE.MeshPhysicalMaterial({ color: 0xf3ebd4, roughness: 0.9,  metalness: 1});
// const backwall = new THREE.Mesh(wallGeometry, wallMaterial);
// scene.add(backwall);
// backwall.rotation.z = -Math.PI / 2;
// backwall.position.set(0, 40, -50);
// const sidewallgeometry = new THREE.PlaneGeometry(200, 100);
// const leftwall = new THREE.Mesh(sidewallgeometry, wallMaterial);
// scene.add(leftwall);
// leftwall.rotation.y = Math.PI / 2;
// leftwall.position.set(-100, 40, 0);
// const rightwall = new THREE.Mesh(sidewallgeometry, wallMaterial);
// scene.add(rightwall);
// rightwall.rotation.y = -Math.PI / 2;
// rightwall.position.set(100, 40, 0);
// const ceilinggeometry = new THREE.PlaneGeometry(200, 200);
// const ceiling = new THREE.Mesh(ceilinggeometry, wallMaterial);
// scene.add(ceiling);
// ceiling.rotation.x = Math.PI / 2;
// ceiling.position.set(0, 80, 0);



// =================================================
// Animation
// =================================================

// 1. Set up the Raycaster and a vector to hold mouse coordinates
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Define your animation states (same as before)
let isOpen = false;
const closedY = 0;      
const openY = -15;       

// 2. Listen for clicks
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // CHANGE: Check the whole scene so you can grab compressor/environment points too
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const closestHit = intersects[0];
        const hitPoint = closestHit.point;

        // 🌟 ADDED: Update lil-gui with the precise click coordinates
        displayCoords.x = Number(hitPoint.x.toFixed(2));
        displayCoords.y = Number(hitPoint.y.toFixed(2));
        displayCoords.z = Number(hitPoint.z.toFixed(2));

        // 🌟 ADDED: Safely check if the clicked mesh is part of the cryocase group
        let hitCryocase = false;
        let currentObject = closestHit.object;
        
        // Walk up the 3D object tree to see if it belongs to 'cryocase'
        while (currentObject) {
            if (currentObject === cryocase) {
                hitCryocase = true;
                break;
            }
            currentObject = currentObject.parent;
        }

        // YOUR ORIGINAL LOGIC: Toggle state only if the cryocase was part of the hit
        if (hitCryocase) {
            isOpen = !isOpen; 
        }
    }
});

// 3. Render loop (remains exactly the same)
function animate() {
    requestAnimationFrame(animate);

    const targetY = isOpen ? openY : closedY;
    cryocase.position.y += (targetY - cryocase.position.y) * 0.05;

    renderer.render(scene, camera);
}

animate();

// 7. Button Click Animations (GSAP)
document.getElementById('btn-onetone').addEventListener('click', () => {
    // 1. Move the camera
    gsap.to(camera.position, {
        x: -2, y: 2, z: 6,
        duration: 1.5, ease: "power2.inOut"
    });
    
    // 2. Move the point the camera is looking at!
    gsap.to(controls.target, {
        x: 0, y: 2, z: 0, // Adjust these coordinates to match the center of what you want to look at
        duration: 1.5, ease: "power2.inOut"
    });
});

document.getElementById('btn-twotone').addEventListener('click', () => {
    gsap.to(camera.position, {
        x: 5, y: 4, z: 8,
        duration: 1.5, ease: "power2.inOut"
    });
    
    gsap.to(controls.target, {
        x: 0, y: 4, z: 0, 
        duration: 1.5, ease: "power2.inOut"
    });
});