'use client';

import React, { useEffect, useRef } from 'react';

type Props = {
  images: string[];
  width?: number | string;
  height?: number | string;
  autoRotateSpeed?: number; // radians per frame-ish
};

export default function ThreeDCarousel({ images, width = '100%', height = '100%', autoRotateSpeed = 0.002 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const waitingRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    let scene: any, camera: any, renderer: any, group: any;
    const textures: any[] = [];

    const init = async () => {
      // dynamic import to avoid SSR issues; ensure `three` is installed
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: dynamic import without types; treat as any at runtime
      const THREE = await import('three');

      if (!mounted || !containerRef.current) return;

      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 400;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
      camera.position.set(0, 0, 6);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      renderer.setSize(w, h, false);
      renderer.outputEncoding = THREE.sRGBEncoding;

      containerRef.current.appendChild(renderer.domElement);

      const light = new THREE.AmbientLight(0xffffff, 1);
      scene.add(light);

      group = new THREE.Group();
      scene.add(group);

      const loader = new THREE.TextureLoader();

      const radius = 4.0;
      const count = images.length || 1;
      const step = (Math.PI * 2) / count;

      for (let i = 0; i < count; i++) {
        const url = images[i % images.length];
        const tex = loader.load(url);
        tex.encoding = THREE.sRGBEncoding;
        // Improve sampling quality: enable mipmaps and anisotropic filtering
        try {
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          const maxAniso = renderer.capabilities && renderer.capabilities.getMaxAnisotropy
            ? renderer.capabilities.getMaxAnisotropy()
            : 1;
          if (maxAniso && tex.anisotropy !== undefined) tex.anisotropy = maxAniso;
        } catch (err) {
          // ignore if renderer/capabilities aren't available yet
        }
        textures.push(tex);

        // Plane geometry (w x h) - tuned for card shape
        const geom = new THREE.PlaneGeometry(3.2, 2.0, 1, 1);
        const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geom, mat);

        const angle = (i / count) * Math.PI * 2;
        mesh.position.x = Math.sin(angle) * radius;
        mesh.position.z = Math.cos(angle) * radius * 0.95;
        mesh.position.y = Math.sin(i * 0.3) * 0.2;
        mesh.lookAt(0, 0, 0);
        mesh.userData = { angle };

        // Add subtle rounded card border via plane scale and small extrusion illusion
        group.add(mesh);
      }

      // initial target rotation: show index 0
      let currentIndex = 0;
      let targetRotation = (currentIndex * step);
      let pauseTimer: number | null = null;

      const onResize = () => {
        if (!containerRef.current) return;
        const w2 = containerRef.current.clientWidth;
        const h2 = containerRef.current.clientHeight || 400;
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
        renderer.setSize(w2, h2, false);
      };

      window.addEventListener('resize', onResize);


      const animate = () => {
        if (!mounted) return;

        // determine shortest angular difference
        const diff = targetRotation - group.rotation.y;
        const shortest = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;

        // If not paused by hover or waiting for the 1s stop, rotate at constant speed
        if (!pausedRef.current && !waitingRef.current) {
          const move = Math.sign(shortest) * autoRotateSpeed;
          // If we're about to overshoot the target, snap to it and start waiting
          if (Math.abs(shortest) <= Math.abs(move)) {
            group.rotation.y = targetRotation;
            waitingRef.current = true;
            if (pauseTimer) clearTimeout(pauseTimer);
            pauseTimer = window.setTimeout(() => {
              currentIndex = (currentIndex + 1) % count;
              targetRotation = (currentIndex * step);
              waitingRef.current = false;
              pauseTimer = null;
            }, 1000);
          } else {
            group.rotation.y += move;
          }
        }

        // Sine bobbing for each card
        for (let i = 0; i < group.children.length; i++) {
          const m = group.children[i];
          m.position.y = Math.sin((i * 0.3) + performance.now() / 800) * 0.05;
          // face camera a bit
          m.lookAt(camera.position.x, camera.position.y, camera.position.z);
        }
        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);

      // Pause on hover -- this pauses the approach and also the interval pause
      const onMouseEnter = () => {
        // hover pause cancels any pending auto-advance pause
        pausedRef.current = true;
        if (pauseTimer) {
          clearTimeout(pauseTimer);
          pauseTimer = null;
        }
        waitingRef.current = false;
      };
      const onMouseLeave = () => { pausedRef.current = false; };
      containerRef.current.addEventListener('mouseenter', onMouseEnter);
      containerRef.current.addEventListener('mouseleave', onMouseLeave);

      // cleanup
      return () => {
        mounted = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        window.removeEventListener('resize', onResize);
        if (containerRef.current) {
          containerRef.current.removeEventListener('mouseenter', onMouseEnter);
          containerRef.current.removeEventListener('mouseleave', onMouseLeave);
        }
        if (pauseTimer) {
          clearTimeout(pauseTimer);
          pauseTimer = null;
        }
        if (renderer && renderer.domElement && containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        // dispose textures
        textures.forEach((t) => t && t.dispose && t.dispose());
        if (scene) {
          // traverse and dispose materials/geometries
          scene.traverse((obj: any) => {
            if (obj.isMesh) {
              if (obj.geometry) obj.geometry.dispose();
              if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
                else obj.material.dispose();
              }
            }
          });
        }
      };
    };

    const cleanupPromise = init();

    return () => {
      mounted = false;
      // nothing else needed; inner cleanup will run
      cleanupPromise.then((fn: any) => fn && fn());
    };
  }, [images, autoRotateSpeed]);

  return (
    <div style={{ width, height }} ref={containerRef} className="w-full h-full rounded-xl" />
  );
}
