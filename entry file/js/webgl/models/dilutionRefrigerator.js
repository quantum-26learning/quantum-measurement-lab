import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export default class DilutionRefrigerator {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(-5.15,-3,0.15);
        this.group.scale.set(1.2,1.2,1.2);
        this.buildDilutionRefrigerator();
    }

    buildDilutionRefrigerator() {

        // Group for all Dilution Unit objects
        const duGroup = new THREE.Group();
        this.group.add(duGroup);
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
        
            const material = new THREE.MeshStandardMaterial({color: 0xd4af37, side: THREE.DoubleSide, roughness: 0.15, metalness: 1});
            const mesh = new THREE.Mesh(geometry, material);
        
            this.group.add(mesh);
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
            const plate = goldplate.call(this, config.radius, hasHoles);
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
            this.group.add(mesh);
            mesh.position.y = y;
            mesh.position.x = x;
            mesh.position.z = z;
            return mesh;
        };
        
        //df pipes
        
        df_pipe.call(this, 0.15, 11.7, 0.92, 0, -0.74);
        df_pipe.call(this, 0.2, 0.1, 0.92, 0, -0.74);
        
        df_pipe.call(this, 0.16, 11.7, -1.04, 0, 0.77);
        df_pipe.call(this, 0.16, 11.7, 0.95, 0, 0.79);
        
        df_pipe.call(this, 0.23, 0.1, -1.04, 0, 0.77);
        df_pipe.call(this, 0.23, 0.1, 0.95, 0, 0.75);
        
        
        
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
        
            this.group.add(mesh);
            mesh.position.y = 11.9;
            mesh.rotateX(Math.PI / 2);
            return mesh;
        };
        
        top_flange.call(this, 3.5);
        
        
        //top flange details
        const tf_material =  new THREE.MeshStandardMaterial({color: 0x595959, side: THREE.DoubleSide, roughness: 0.15, metalness: 1});
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
            this.group.add(mesh);
            return mesh;    
        };
        
        tf_cylinder.call(this, 0.2, 0.9, -1.5, 11.8, -1, Math.PI * 2);
        tf_cylinder.call(this, 0.24, 0.1, -1.5, 12.4, -1, Math.PI * 2);
        tf_cylinder.call(this, 0.35, 1.3, -1.5, 12.7, -1.15, Math.PI);
        tf_cylinder.call(this, 1, 0.2, 1.5, 11.9, 0, Math.PI * 2);
        tf_cylinder.call(this, 0.8, 0.9, 1.5, 12, 0, Math.PI * 2);
        tf_cylinder.call(this, 0.32, 1, 0, 11.9, 0.2, Math.PI * 2);
        tf_cylinder.call(this, 0.3, 0.01, 0, 12.6, 0.2, Math.PI * 2, true);
        tf_cylinder.call(this, 0.45, 0.15, -0.1, 12, 1.5, Math.PI * 2, true);
        tf_cylinder.call(this, 0.55, 0.1, -0.1, 12.05, 1.5, Math.PI * 2,);
        tf_cylinder.call(this, 0.45, 0.15, -0.3, 12, -1.5, Math.PI * 2, true);
        tf_cylinder.call(this, 0.53, 0.1, -0.3, 12.05, -1.5, Math.PI * 2,);
        tf_cylinder.call(this, 0.12,1.5,1.2,12,0.3,Math.PI*2);
        tf_cylinder.call(this, 0.12,1.8,1.5,12,-0.3,Math.PI*2);
        tf_cylinder.call(this, 0.16,1.5,1.9,12,0.2,Math.PI*2);
        tf_cylinder.call(this, 0.1,0.8,-0.6,11.9,0.5, Math.PI * 2);
        tf_cylinder.call(this, 0.1, 0.8, -0.4, 11.9, -0.4, Math.PI * 2);
        tf_cylinder.call(this, 0.24, 0.1, -1.9, 11.9, 1.4, Math.PI * 2);
        tf_cylinder.call(this, 0.08,0.2,1.4,11.9,2., Math.PI * 2);
        tf_cylinder.call(this, 0.08,0.2,1.8,11.9,1.2, Math.PI * 2);
        tf_cylinder.call(this, 0.08,0.2,2.7,11.9,0.1, Math.PI * 2);
        tf_cylinder.call(this, 0.08,0.2,2.7,11.9,-0.3, Math.PI * 2);
        
        
        
        const topflangGrp = new THREE.Group();
        const topvaccumGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
        const topvaccumMat = new THREE.MeshStandardMaterial({ color: 0x595959 , metalness: 1, roughness: 0.15 });
        const topvaccum = new THREE.Mesh(topvaccumGeo, topvaccumMat);
        topvaccum.position.set(0.6, 7.9, 0.7);
        //topflangGrp.add(topvaccum);
        
        const topvaccum2 = new THREE.CircleGeometry(0.25,32);
        const topvaccum2Mat = new THREE.MeshStandardMaterial({ color: 0x595959 , metalness: 1, roughness: 0.15 });
        const topvaccum2Mesh = new THREE.Mesh(topvaccum2, topvaccum2Mat);
        topvaccum2Mesh.position.set(0.6, 8, 0.7);
        topvaccum2Mesh.rotation.x = -Math.PI / 2;
        //topflangGrp.add(topvaccum2Mesh);
        
        const vaccumcylinderGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32);
        const vaccumcylinderMat = new THREE.MeshStandardMaterial({ color: 0x595959, metalness: 0.7, roughness: 0.45 });
        const vaccumcylinder = new THREE.Mesh(vaccumcylinderGeo, vaccumcylinderMat);
        vaccumcylinder.position.set(0.9, 8.05, 0.7);
        topflangGrp.add(vaccumcylinder);
        const vaccumcylindertopassemble = new THREE.Group();
        const vaccumcylindertop = topvaccum.clone();
        vaccumcylindertop.position.set(1, 8.2, 0.7);
        vaccumcylindertopassemble.add(vaccumcylindertop);
        vaccumcylindertop.scale.set(0.4,0.2,0.4);
         const vaccumcylindertopring = new THREE.RingGeometry(0.09,0.13,32);
        const vaccumcylindertopringMat = new THREE.MeshStandardMaterial({ color: 0x9370DB, metalness: 1, roughness: 0.15 });
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
        vaccumcylindertopassemble.position.set(-0.1, 0, 0);
        
        const vaccumcylindertopassemble1 = vaccumcylindertopassemble.clone();
        const additionalvaccumcy= vaccumcylinder.clone();
        additionalvaccumcy.position.x+=0.1;
        vaccumcylindertopassemble1.add(additionalvaccumcy);
        vaccumcylindertopassemble1.position.set(-0.7, 0, -0.2);
        
        topflangGrp.add(vaccumcylindertopassemble1);
         
        const vaccumcylindertopassemble2 = topflangGrp.clone();
        vaccumcylindertopassemble2.position.set(-0.1,0,-1)
        topflangGrp.add(vaccumcylindertopassemble2);
        
        
        //add side bolts
        const sideboltGRp = new THREE.Group();
        const sideboltGeo = new THREE.BoxGeometry(0.08,0.13,0.09);
        const sideboltMat = new THREE.MeshStandardMaterial({ color: 0x595959, metalness: 1, roughness: 0.15 });
        const sidebolt1 = new THREE.Mesh(sideboltGeo, sideboltMat);
        sidebolt1.position.set(0.7, 8., 0.84);
        sidebolt1.rotation.x = Math.PI / 2;
        sidebolt1.rotation.z = -Math.PI / 6;
        sideboltGRp.add(sidebolt1);
        const sidebolts1 = sidebolt1.clone();
        sidebolts1.position.set(0.35, 8., 0.71);
        sidebolts1.rotation.z = Math.PI / 3;
        sideboltGRp.add(sidebolts1);
        const sidebolts2 = sidebolt1.clone();
        sidebolts2.position.set(0.63, 8., 0.42);
        sidebolts2.rotation.z = Math.PI / 12;
        sideboltGRp.add(sidebolts2);
        
        
        
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
        const sidebolttop = Hexnut(0.76, 1.5);
        sidebolttop.material = new THREE.MeshStandardMaterial({ color: 0x595959, metalness: 1, roughness: 0.15 });
        sidebolttop.position.set(0.7, 8.09, 0.84);
        sidebolttop.scale.set(0.04,0.04,0.04);
        sidebolttop.rotation.x = Math.PI / 2;
        sidebolttop.rotation.z = Math.PI / 6;
        const sidebolttop2 = sidebolttop.clone();
        sidebolttop2.position.set(0.35, 8.09, 0.71);
        sidebolttop2.rotation.z = -Math.PI / 3;
        const sidebolttop3 = sidebolttop.clone();
        sidebolttop3.position.set(0.63, 8.09, 0.42);
        sidebolttop3.rotation.z = -Math.PI / 12;  
        
        sideboltGRp.add(sidebolttop);
        sideboltGRp.add(sidebolttop2);
        sideboltGRp.add(sidebolttop3);
        
        sideboltGRp.add(sidebolttop);
        topflangGrp.add(sideboltGRp);
        const sideboltGRp2 = sideboltGRp.clone();
        sideboltGRp2.position.set(-0.06, 0, -1);
        
        topflangGrp.add(sideboltGRp2);
        
        
        //topvaccum around large still pump
        function create_topassemble(x,y,z,sx,sy,sz){
          const vaccumtopassembly = vaccumcylindertopassemble.clone();
          vaccumtopassembly.position.set(x,y,z);
          vaccumtopassembly.scale.set(sx,sy,sz);
          topflangGrp.add(vaccumtopassembly);
          
         
          
          return vaccumtopassembly;
        };
        create_topassemble(-0.4, 0.15, -0.48,1,1,1);
        create_topassemble(0.07, 0.1, -0.26,0.4,1,0.4);
        create_topassemble(0.0, 0.08, 0.04,0.4,1,0.4);
        create_topassemble(-0.74, -0.19, 0.12,0.71,1,0.71);
        create_topassemble(0.767, -0.15, 0.61,0.3,1,0.3);
        create_topassemble(0.897,- 0.15, 0.34,0.3,1,0.3);
        create_topassemble(1.2,- 0.15, -0.02,0.3,1,0.3);
        create_topassemble(1.2, -0.15, -0.16,0.3,1,0.3);
        
        const extraconngrp = new THREE.Group();
         //extraconngrp.add(sidebolts2.clone());
         extraconngrp.add(sidebolttop3.clone());
         topflangGrp.add(extraconngrp);
         extraconngrp.position.set(1.063,2.42,-0.248);
         extraconngrp.scale.set(0.7,0.7,0.7)
        
        
        
        
        topflangGrp.scale.set(3,2.5,3);
        topflangGrp.position.set(-1.8, -8, -0.45);
        this.group.add(topflangGrp);
        
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
        this.group.add(rfcableGrp);
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
        this.group.add(pumpline);
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
        
        
        createPumpLineAssembly.call(this);
        
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

        //ptc

        const pulseCooler = new THREE.Group();
        pulseCooler.scale.set(0.8,0.6,0.8);
        pulseCooler.position.set(0.92,12.5,0.5); 
        this.group.add(pulseCooler);    

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
          })
    
        
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
              6.5,
              32
            ),
            silverMaterial
          );
        
        leftRod.position.set(
          -0.65,
          -4.6,
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
                this.group.add(cloneGroup);
            }
        }
        
        createBolt.call(this, 1.5, 10, 0, 0.03, 0);
        createBolt.call(this, 0.5, 3, 0, 0.03, 0);
        createBolt.call(this, 0.4, 6, -0.8, 2.53, 0.2);
        createBolt.call(this, 1.7, 12, 0, 2.53, 0);
        createBolt.call(this, 1.9, 12, 0, 5.03, 0);
        createBolt.call(this, 0.3, 6, -0.8, 5.03, 0.2);
        createBolt.call(this, 2.3, 15, 0, 7.53, 0);
        createBolt.call(this, 0.6, 6, -0.8, 7.53, 0.2);
        createBolt.call(this, 2.5, 15, 0, 10.03, 0);
        // createBolt.call(this, 0.9, 9, 1, 10.25, 0.2);
        createBolt.call(this, 0.75, 8, -1.7, 10.03, 0.2);
        createBolt.call(this, 3, 15, 0, 11.95, 0);
        createBolt.call(this, 0.8, 8, -1.7, 11.95, 0.2);
        createBolt.call(this, 0.4, 4, -0.2, 10.1, -0.72);
        createBolt.call(this, 0.9, 8, 1.5, 12.15, 0);
        createBolt.call(this, 0.7, 8, 1.5, 12.95, 0);
    
    }

    getGroup(){
        return this.group;
    }
}