import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'FindTheGlitch';

  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  ngOnInit(): void {
    window.onresize = () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    (document.querySelector('.wholepage') as HTMLElement).appendChild(
      this.renderer.domElement
    );
    const zeroOneTexture = new THREE.TextureLoader().load('../assets/grid.png');
    const geometry = new THREE.BoxGeometry(7, 7, 7);
    const material = new THREE.MeshPhongMaterial({
      map: zeroOneTexture,
      wireframe: false,
      transparent: true,
      opacity: 0.95,
    });
    const cube = new THREE.Mesh(geometry, material);

    const light = new THREE.DirectionalLight(0x00ff00, 0.7);
    light.position.set(0, 0, 12);
    this.scene.add(light);
    this.scene.add(cube);

    this.camera.position.set(0, 0, 12);

    const animation = () => {
      requestAnimationFrame(animation);

      this.camera.lookAt(light.position);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      this.renderer.render(this.scene, this.camera);
    };

    animation();
  }
}
