import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export default class PipeAssembly { 
    constructor() {
        this.group = new THREE.Group();
        this.group.scale.set(3,3,3);
        this.group.position.set(5.8,10,0);
        this.group.rotation.y = Math.PI;
        this.buildPipeAssembly();
    }

    buildPipeAssembly() {

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
        
        // --------------------------
        // Horizontal Pipe
        // --------------------------
        const main_horizontal_pipe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, 5, 64),
          pipe_material
        );
        main_horizontal_pipe.rotation.z = Math.PI / 2;
        main_horizontal_pipe.position.set(-0.5, 2, 0);
        this.group.add(main_horizontal_pipe);
        
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
        this.group.add(elbow_torus_mesh);
        
        const left_end_flange = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, 0.08, 64),
          pipe_material
        );
        left_end_flange.rotation.z = Math.PI / 2;
        left_end_flange.position.set(-2.7, 2, 0);
        this.group.add(left_end_flange);
        
        const elbow_connector_flange = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.28, 0.10, 64),
          dark_metal_material
        );
        elbow_connector_flange.rotation.z = Math.PI / 2;
        elbow_connector_flange.position.set(2.0, 2.0, 0);
        this.group.add(elbow_connector_flange);
        
        // --------------------------
        // Vertical Pipe
        // --------------------------
        const right_vertical_pipe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.20, 0.20, 1.0, 64),
          pipe_material
        );
        right_vertical_pipe.position.set(2.5, 1.0, 0);
        this.group.add(right_vertical_pipe);
        
        const bottom_base_flange = new THREE.Mesh(
          new THREE.CylinderGeometry(0.32, 0.32, 0.08, 64),
          pipe_material
        );
        bottom_base_flange.position.set(
          2.5,   // same X as vertical neck center
          1.0,   // near bottom of neck
          0
        );
        this.group.add(bottom_base_flange);
        
        // --------------------------
        // T-Branch Junction
        // --------------------------
        const t_junction_body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.28, 0.5, 64),
          pipe_material
        );
        t_junction_body.rotation.z = Math.PI / 2;
        t_junction_body.position.set(-3, 2.0, 0);
        this.group.add(t_junction_body);
        
        // left end of horizontal pipe (adjusted naming based on -3 X coordinate)
        const left_side_vertical_pipe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.16, 2.5, 64),
          pipe_material
        );
        left_side_vertical_pipe.position.set(-3, 1.1, 0);
        this.group.add(left_side_vertical_pipe);
        
        const left_side_lower_collar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.12, 64),
          pipe_material
        );
        left_side_lower_collar.position.set(-3, 1.75, 0);
        this.group.add(left_side_lower_collar);
        
        // Vertical part of T
        const t_junction_vertical_stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.6, 64),
          pipe_material
        );
        t_junction_vertical_stem.position.set(-3, 2.0, 0);
        this.group.add(t_junction_vertical_stem);
        
        // Horizontal part of T
        const t_junction_horizontal_stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.3, 64),
          pipe_material
        );
        t_junction_horizontal_stem.rotation.z = Math.PI / 2;
        t_junction_horizontal_stem.position.set(-3, 2.0, 0);
        this.group.add(t_junction_horizontal_stem);
        
        const left_side_upper_dark_block = new THREE.Mesh(
          new THREE.CylinderGeometry(0.26, 0.26, 0.15, 64),
          dark_metal_material
        );
        left_side_upper_dark_block.position.set(-3, 2.38, 0);
        this.group.add(left_side_upper_dark_block);
        
        const left_side_top_cap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.12, 64),
          pipe_material
        );
        left_side_top_cap.position.set(-3, 2.50, 0);
        this.group.add(left_side_top_cap);
        
        const left_side_lower_dark_block = new THREE.Mesh(
          new THREE.CylinderGeometry(0.26, 0.26, 0.15, 64),
          dark_metal_material
        );
        left_side_lower_dark_block.position.set(-3, 1.62, 0);
        this.group.add(left_side_lower_dark_block);
        
        const left_side_bottom_extension = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.12, 64),
          pipe_material
        );
        
        left_side_bottom_extension.position.set(-3, 1.42, 0);
        this.group.add(left_side_bottom_extension);
        
        
        const ghucollar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.12, 64),
          pipe_material
        );
        ghucollar.position.set(-3,-0.1, 0);
        ghucollar.rotation.x = Math.PI;
        this.group.add(ghucollar);

    }

    getGroup() {
        return this.group;
    }
}