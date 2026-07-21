import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export default class Compressor {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(-11, -4,-11);
        this.group.rotation.y=-Math.PI/2;
        //this.group.scale.set(1,0.8,1);
        this.buildCompressor();
    }

    buildCompressor() {
        
        // Main Body (Chassis) - Now 8x6.5x5
        const bodyGeom = new THREE.BoxGeometry(8, 6.5, 5);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x71797E, metalness: 1, roughness: 0.15 }); // Industrial Gray
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        this.group.add(body);
        
        //front panel with controls (Scaled and positioned)
        const panelGeom = new THREE.BoxGeometry(4, 2.2, 0.1 ); // Rounded box for front panel
        const panelMat = new THREE.MeshStandardMaterial({ color: "black", metalness: 0.8, roughness: 0.2 });
        this.group.add(new THREE.Mesh(panelGeom, panelMat));
        this.group.children[1].position.set(0, 1.5, 2.55); // Front panel slightly protruding
        //start button
        const buttonGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 32);
        const buttonMat = new THREE.MeshStandardMaterial({ color: 0x71797E, metalness: 0.7, roughness: 0.3});
        
        const button= new THREE.Mesh(buttonGeom, buttonMat);
        button.rotation.x = Math.PI / 2;
        this.group.add(button);
        this.group.children[2].position.set(1.4,1.7,2.55);
        
        //green ring
        const ringGeom =new THREE.RingGeometry(0.2,0.28,16);
        const ringMat =new THREE.MeshStandardMaterial({color:'green'});
        const ring = new THREE.Mesh(ringGeom,ringMat);
        ring.rotation.z = Math.PI/2;
        this.group.add(ring);
        ring.position.set(1.4,1.7,2.64);
        
        
        
        //screens (Scaled and positione
        const screenGeom = new THREE.BoxGeometry(2, 1.1, 0.05);
        const screenMat = new THREE.MeshStandardMaterial({ color: 'white', emissive: 'white', emissiveIntensity: 0.5 });
        const screen =new THREE.Mesh(screenGeom, screenMat);
        this.group.add(screen);
        screen.position.set(0, 1.5, 2.6); // Screens slightly protruding
        // Screens slightly protruding
        
        
        // MCB body
        const mcbBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 1.4, 0.1),
          new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        
        // Front panel position
        mcbBody.position.set(-2.5, 1.3, 2.5);
        this.group.add(mcbBody);
        
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
        this.group.add(createHandle(3.5), createHandle(-3.5)); // Rotate handles to be vertical
        
        // red wala label
        const geometries = new THREE.BoxGeometry(8, 0.4, 0.1);
        const redmaterial = new THREE.MeshStandardMaterial({ color: 'red',metalness:0.8,roughness:0.1 });
        const redlabel = new THREE.Mesh(geometries, redmaterial);
        redlabel.position.set(0,0 , 2.5);
        this.group.add(redlabel);
        
        //ventilation grill
        
        
        for (let i = -15; i <5; i+=0.6){
            const grillGeom =new THREE.BoxGeometry(5.1, 0.05, 0.1);
            const grillMat=new THREE.MeshStandardMaterial({ color: 0x71797E,metalness:0.7,roughness:0.15  });
            const grill = new THREE.Mesh(grillGeom,grillMat);
            grill.position.set(-1.5, i * 0.15-1.0,2.45);
          this.group.add(grill);
        }
        for (let i = -26.8; i <8; i+=2){
            const grillvGeom =new THREE.BoxGeometry(0.1, 3.0, 0.1);
            const grillvMat=new THREE.MeshStandardMaterial({ color: 0x71797E,metalness:0.7,roughness:0.15 });
            const grillv = new THREE.Mesh(grillvGeom,grillvMat);
            grillv.position.set(i*0.15, -1.75,2.45);
          this.group.add(grillv);
        }
        
         //  Pressure Gauge/Knob
         const loader = new THREE.TextureLoader();
         const knobGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 32);
         const knobMat = new THREE.MeshBasicMaterial({
         color:'white',
         side: THREE.DoubleSide
         });
         const knob = new THREE.Mesh(knobGeom, knobMat);
         knob.position.set(3.3, -1,2.5 );
         knob.rotation.x =Math.PI/2;
      
         this.group.add(knob);

         const knob2 = knob.clone();
         knob2.position.x = 1.7;
         this.group.add(knob2);
         console.log("Texture loaded");
         // Caster Wheels
         function createWheel(x, z) {
          const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.6, 0.6, 0.35, 16),
          new THREE.MeshStandardMaterial({ color: 'black', metalness: 0.5, roughness: 0.5 })
        );
         wheel.rotation.z = Math.PI / 2;
    
         wheel.position.set(x, -3.3, z);
         return wheel;
        }
         this.group.add(
         createWheel(3.2, 1.7),
         createWheel(-3.2, 1.7),
         createWheel(3.2, -1.7),
         createWheel(-3.2, -1.7)
        );
         // ring for the fornt side
         for(let i = -3; i < 1; i+=0.05){
         const compressorringGeom =new THREE.RingGeometry(0.1,0.2,16);
         const compressorringMat =new THREE.MeshStandardMaterial({color:0x636A6E, metalness:1, roughness:0.15});
         const compressorring = new THREE.Mesh(compressorringGeom,compressorringMat);
         compressorring.rotation.z = Math.PI/2;
         this.group.add(compressorring);
         compressorring.position.set(3.3,-2 ,2.55+i*0.15);
         const compressorring2=compressorring.clone();
         this.group.add(compressorring2);
        compressorring2.position.set(1.7, -2, 2.55+i*0.15);}

    }
  

     getGroup(){
        return this.group;
    }
}
