import * as THREE from 'three';
import vertexShader from '../shaders/particles.vert.glsl?raw';
import fragmentShader from '../shaders/particles.frag.glsl?raw';
import type { CanvasShaderOptions } from '../types';

export class StarfieldCanvas {
  private canvas: HTMLCanvasElement | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private particlesMesh: THREE.Points | null = null;
  private animationFrameId: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private clock = new THREE.Clock();
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private options: CanvasShaderOptions) {}

  public init(): boolean {
    this.canvas = document.getElementById(this.options.canvasId) as HTMLCanvasElement;
    if (!this.canvas) return false;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.canvas.style.display = 'none';
      return false;
    }

    const isMobile = window.innerWidth < 768;
    const count = isMobile
      ? (this.options.particleCountMobile ?? 600)
      : (this.options.particleCountDesktop ?? 1300);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randomness = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 11;
      positions[i3 + 1] = (Math.random() - 0.5) * 11;
      positions[i3 + 2] = (Math.random() - 0.5) * 11;

      scales[i] = Math.random() * 0.8 + 0.3;

      randomness[i3] = Math.random();
      randomness[i3 + 1] = Math.random();
      randomness[i3 + 2] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

    // Custom GLSL Shader Material
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: isMobile ? 0.38 : 0.32 },
        uColorA: { value: new THREE.Color(this.options.colorA ?? '#b4e648') },
        uColorB: { value: new THREE.Color(this.options.colorB ?? '#38bdf8') }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.particlesMesh = new THREE.Points(geometry, this.material);
    this.scene.add(this.particlesMesh);

    if (!isMobile) {
      window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    }
    window.addEventListener('resize', this.handleResize, { passive: true });

    this.animate();
    return true;
  }

  private handleMouseMove = (event: MouseEvent): void => {
    this.mouseX = (event.clientX / window.innerWidth - 0.5) * 0.35;
    this.mouseY = (event.clientY / window.innerHeight - 0.5) * 0.35;
  };

  private handleResize = (): void => {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      if (!this.camera || !this.renderer || !this.material) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }, 150);
  };

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const elapsedTime = this.clock.getElapsedTime();

    if (this.material) {
      this.material.uniforms.uTime.value = elapsedTime;
    }

    if (this.particlesMesh) {
      this.particlesMesh.rotation.y = elapsedTime * 0.04;
      this.particlesMesh.rotation.x = elapsedTime * 0.02;
    }

    if (this.camera) {
      this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.04;
      this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.04;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);

    if (this.particlesMesh) {
      this.particlesMesh.geometry.dispose();
      this.material?.dispose();
    }
    this.renderer?.dispose();
  }
}
