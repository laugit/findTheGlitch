import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { BufferAttribute } from 'three';

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
    const geometry = new THREE.BoxGeometry(120, 120, 120);
    const material = new THREE.MeshPhongMaterial({
      map: zeroOneTexture,
      wireframe: false,
      transparent: true,
      opacity: 1,
    });

    const particlesNb = 1200;

    for (let i = 0; i < particlesNb; i++) {
      const vertices = [];
      const particleX = THREE.MathUtils.randFloatSpread(500);
      const particleY = THREE.MathUtils.randFloatSpread(700);
      const particleZ = THREE.MathUtils.randFloatSpread(200);
      const particleGeometry = new THREE.BufferGeometry();
      vertices.push(particleX, particleY, particleZ);
      particleGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      const particleMaterial = new THREE.PointsMaterial({ color: 0x00ff00 });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      this.scene.add(particles);
    }

    const cube = new THREE.Mesh(geometry, material);

    const smokeTexture = new THREE.TextureLoader().load(
      '../assets/zeroOne.png'
    );

    //narrowing the texture
    smokeTexture.repeat.set(8, 8);

    const smokeMaterial = new THREE.MeshLambertMaterial({
      //color: 0xf1ebdd,
      //emissive: 0xffffff,
      map: smokeTexture,
      transparent: true,
      opacity: 1,
    });
    const smokeGeo = new THREE.PlaneGeometry(160, 150);
    const smokeCloud: any[] = [];

    const bounds = {
      x: 150,
      y: 150,
      z: 150,
    };
    const numParticles = 100;

    for (let p = 0; p < numParticles; p++) {
      const particle = new THREE.Mesh(smokeGeo, smokeMaterial);
      particle.position.set(
        Math.random() * bounds.x - bounds.x * 0.5,
        Math.random() * bounds.y - bounds.y * 0.5,
        Math.random() * bounds.z - bounds.z * 0.6
      );
      particle.rotation.z = Math.random() * 360;
      this.scene.add(particle);
      smokeCloud.push(particle);
    }

    const clock = new THREE.Clock();
    let delta = 0;

    const rotateSmoke = () => {
      for (let i = 0; i < numParticles; i++) {
        smokeCloud[i].rotation.z -= delta * 0.4;
      }
    };

    const light = new THREE.DirectionalLight(0x00ff00, 0.7);
    light.position.set(0, 0, 200);
    this.scene.add(light);
    this.scene.add(cube);

    this.camera.position.set(0, 0, 200);

    const animation = () => {
      requestAnimationFrame(animation);

      this.camera.lookAt(light.position);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      delta = clock.getDelta();
      rotateSmoke();

      this.renderer.render(this.scene, this.camera);
    };

    animation();
  }
}
