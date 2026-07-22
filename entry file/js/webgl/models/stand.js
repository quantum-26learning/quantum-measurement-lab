import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export default class Stand {
    constructor() {
        this.group = new THREE.Group();
        this.group.scale.set(3,2.5,3);
        this.group.position.y = -8.5;
        this.group.position.x = -7; 
        this.buildStand();
    }

    buildStand() {

        // 0. MATERIALS
        const aluminumMaterial = new THREE.MeshStandardMaterial({ color: '#c5cbd1', metalness: 0.9, roughness: 0.1 });
        const darkFrameMaterial = new THREE.MeshStandardMaterial({ color: '#1c1f22', roughness: 0.7 });
        const roofPlateMaterial = new THREE.MeshStandardMaterial({ color: '#3a414a', metalness: 0.9, roughness: 0.3 });
        const greenValveMat = new THREE.MeshStandardMaterial({ color: '#4d8060', roughness: 0.4 });
        
        
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
            this.group.add(leg);
        });
        
        // 2. MAIN HEADER BED & JOINT GUSSETS
        const longHeaderGeo = new THREE.BoxGeometry(6.3, 0.5, 0.4);
        const shortHeaderGeo = new THREE.BoxGeometry(0.4, 0.5, 4.4);
        
        const h1 = new THREE.Mesh(longHeaderGeo, aluminumMaterial); h1.position.set(1, 7.6, 2); this.group.add(h1);
        const h2 = new THREE.Mesh(longHeaderGeo, aluminumMaterial); h2.position.set(1, 7.6, -2); this.group.add(h2);
        const h3 = new THREE.Mesh(shortHeaderGeo, aluminumMaterial); h3.position.set(-2, 7.6, 0); this.group.add(h3);
        const h4 = new THREE.Mesh(shortHeaderGeo, aluminumMaterial); h4.position.set(4, 7.6, 0); this.group.add(h4);
        
        function addGusset(x, z) {
            const gussetGeo = new THREE.BoxGeometry(0.4, 0.1, 0.3);
            const gusset = new THREE.Mesh(gussetGeo, darkFrameMaterial);
            gusset.position.set(x, 7.85, z);
            gusset.rotation.y = Math.PI /2;
            this.group.add(gusset);
        }
        addGusset.call(this,2, 1.8);
        addGusset.call(this,-0.8, 1.8);
        addGusset.call(this,2, -1.7);
        addGusset.call(this,-0.8, -1.7);
        
        // 3. HORIZONTAL CROSS BRACES
        const sideBraceGeo = new THREE.BoxGeometry(0.3, 0.4, 4.0);
        const backBraceGeo = new THREE.BoxGeometry(3.1, 0.4, 0.3);
        const braceHeights = [3.0, 7.6];
        const left = [-2, -0.8]
        const right = [4, 2]
        
        braceHeights.forEach((h, i) => {
            const bLeft = new THREE.Mesh(sideBraceGeo, aluminumMaterial); bLeft.position.set(left[i], h, 0); this.group.add(bLeft);
            const bRight = new THREE.Mesh(sideBraceGeo, aluminumMaterial); bRight.position.set(right[i], h, 0); this.group.add(bRight);
            const bBack = new THREE.Mesh(backBraceGeo, aluminumMaterial); bBack.position.set(0.6, 7.6, -1.4); this.group.add(bBack);
            const bfront = new THREE.Mesh(backBraceGeo, aluminumMaterial); bfront.position.set(0.6, 7.6, 1.45); this.group.add(bfront);
        });
        
        //support braces
        function supportBrace(x, y, z, angle) {
          const supportbracegeo = new THREE.BoxGeometry(1.6, 0.3, 0.3);
          const supportbrace = new THREE.Mesh(supportbracegeo, aluminumMaterial);
          supportbrace.position.set(x, y, z);
          supportbrace.rotation.z = angle;
          this.group.add(supportbrace);
        };
        
        supportBrace.call(this,-1.6, 6.7, -2, Math.PI / 3);
        supportBrace.call(this,-1.6, 6.7, 2, Math.PI / 3);
        supportBrace.call(this,3.6, 6.7, -2, -Math.PI / 3);
        supportBrace.call(this,3.6, 6.7, 2, -Math.PI / 3);
        
        // 5. ANIMATED CLEAN SQUARE ROOF PLATFORM
        const topPlateGroup = new THREE.Group();
        topPlateGroup.position.set(0.25, 8.0, 0);
        
        // The Solid Square Roof / Ceiling plate covering the top completely
        const Roof2geo = new THREE.BoxGeometry(1.6, 0.15, 4.3);
        const Roof2 = new THREE.Mesh(Roof2geo, roofPlateMaterial);
        Roof2.position.set(2.8, -0.05, 0);
        topPlateGroup.add(Roof2);
        
        // Add the top plate to the this.group instead of the scene directly
        this.group.add(topPlateGroup);
        
        // 4. TOP VALVE ARRAY ASSEMBLY
        const EFAssembly= new THREE.Group();
        const EFmainGeom = new THREE.BoxGeometry(1,2,2);
        const EFmainmat =new THREE.MeshStandardMaterial({color:0x636A6E,metalness:1,roughness:0.15});
        const EFmain = new THREE.Mesh(EFmainGeom,EFmainmat);
        EFAssembly.add(EFmain);
        //EFmain.rotation.x = Math.PI/2;
        
        const EFmain2 = EFmain.clone();
        EFAssembly.add(EFmain2);
        EFmain2.position.set(0,2.02,0);
        
        const EFconnectorGeom = new THREE.CylinderGeometry(0.7,0.7,3,16,32);
        const Efconnectormat = new THREE.MeshStandardMaterial({color:0xd6d6d6,metalness:1,roughness:0.15});
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
            new THREE.Vector3(1.95, 0.00, 0.00),
            new THREE.Vector3(1.95, 0.05, 0.00),
            new THREE.Vector3(2.55, 0.08, 0.05),
            new THREE.Vector3(2.80, 0.1, 0.08),
            new THREE.Vector3(3.05, 0.1, 0.1),

            new THREE.Vector3(3.55, 0.2, 0.2),
            new THREE.Vector3(3.75,0.2, 0.3),

            // Straight entry into connector
            new THREE.Vector3(3.88, 0.3, 0.5),
            new THREE.Vector3(3.96, 3.1, 0.8),
            new THREE.Vector3(3.96, 3.15, 0.6),
        ];
            // new THREE.Vector3(3.97, 3.1, 0.65),
            
        
        
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
        
        
        
        
        const EFconnector2=EFconnector.clone();
        EFAssembly.add(EFconnector2);
        EFconnector2.position.set(0,2.05,0);
        
        const EFconend3 = EFconend2.clone();
        EFAssembly.add(EFconend3);
        EFconend3.position.set(-1.3,2.05,0);
        
        const EFconend4 = EFconend.clone();
        EFAssembly.add(EFconend4);
        EFconend4.position.set(1.3,2.05,0);
        
        const EFextraGEom=new THREE.BoxGeometry(0.12,1,0.4);
        const EFextramat=new THREE.MeshStandardMaterial({color:'red'});
        const EFextra = new THREE.Mesh(EFextraGEom,EFmainmat);
        EFextra.position.set(0,3,1.2);
        EFAssembly.add(EFextra);
        EFextra.rotation.z=Math.PI/2;
        for(let i=-1.;i<=2.8;i+=0.6){
            const EF2=EFextra.clone();
            EF2.position.set(0,i,1.2);
            EFAssembly.add(EF2);
        };
        
        
        
        
        
        
         const EFextra2GE =new THREE.BoxGeometry(4,0.2,0.4);
         const EFextra2=new THREE.Mesh(EFextra2GE,EFmainmat);
         EFAssembly.add(EFextra2);
         EFextra2.position.set(-0.4,1.,1.2);
        EFextra2.rotation.z=Math.PI/2;
        
        for(let j=-0.4;j<=0.6;j+=0.4){
             const EF3 =EFextra2.clone();
             EF3.position.set(j,1,1.2);
             EFAssembly.add(EF3);
        };
           const EFwirePoints2 = [
            new THREE.Vector3(1.95, 2.05, 0.00),
            new THREE.Vector3(2.45, 2.05, 0.00),   // straight
        
            // start bending earlier
            new THREE.Vector3(2.85, 2.08, 0.08),
            new THREE.Vector3(3.3, 2.1, 0.1),
            new THREE.Vector3(3.58, 2.90, 0.32),
            new THREE.Vector3(3.58, 3.20, 0.38),
        
            // almost straight into connector
            new THREE.Vector3(3.6, 3.42, 0.46),
            new THREE.Vector3(3.6, 3.6, 0.46),
            new THREE.Vector3(3.61, 3.65, 0.31),
        ];
        
        const EFwireCurve2 = new THREE.CatmullRomCurve3(EFwirePoints2);
        
        const EFwireGeom2 = new THREE.TubeGeometry(
            EFwireCurve2,
            100,
            0.05,
            12,
            false
        );
        const EFwire2 = new THREE.Mesh(EFwireGeom2, Efconnectormat);
        EFAssembly.add(EFwire2);
        
        this.group.add(EFAssembly);
        EFAssembly.rotation.x=Math.PI/2;
        EFAssembly.rotation.y=Math.PI;
        EFAssembly.position.set(3,8.5,-1.5);
        EFAssembly.scale.set(0.45,0.45,0.45);

        //ptc head

        //materials
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


        const ptc_headgrp = new THREE.Group();
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

        ptc_headgrp.add(topCap);
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

        ptc_headgrp.add(topRing);

        const ptc2topring = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.8,8.64,1),
        new THREE.Vector3(2.5,8.64,1),
        new THREE.Vector3(2.1,8.7,1),
        new THREE.Vector3(1.7,8.9,0.8),
        new THREE.Vector3(1.6,8.9,0.6),
        new THREE.Vector3(1.4,8.9,0.3),
        new THREE.Vector3(1.1,8.8,0.2),
        new THREE.Vector3(1.1,8.5,0.2),
        ]);

        ptc2topring.curveType = "chordal";

        const ptc2topringMesh = new THREE.Mesh(
        new THREE.TubeGeometry(ptc2topring, 64, 0.02, 8, false),
        new THREE.MeshStandardMaterial({ color: 0x595959, metalness: 1, roughness: 0.15 })
        );

        this.group.add(ptc2topringMesh);

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

        ptc_headgrp.add(housing);


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

        ptc_headgrp.add(bolt);
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

        ptc_headgrp.add(pipe);

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

        ptc_headgrp.add(fitting);

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

        ptc_headgrp.add(collar);

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

        ptc_headgrp.add(brassFitting);

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

        ptc_headgrp.add(flange);

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

        ptc_headgrp.add(bolt);
        }
        ptc_headgrp.position.set(3, 8.5, 1);
        ptc_headgrp.scale.set(0.3,0.3,0.3);
        this.group.add(ptc_headgrp);

    }

    getGroup() {
        return this.group;
    }
}
