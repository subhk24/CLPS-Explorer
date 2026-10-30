import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import type { LandingSite, Mission } from '../../types';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Compass, AlertTriangle } from 'lucide-react';
import { getLandingSites, getMissions } from '../../data';

export interface LunarGlobe3DProps {
  selectedSiteId?: string | null;
  onSelectSite?: (siteId: string) => void;
  onSelectMission?: (mission: Mission) => void;
  className?: string;
}

/**
 * Convert Selenographic Latitude & Longitude to 3D Cartesian coordinates
 * on a sphere of given radius.
 * - Latitude: -90° (South Pole) to +90° (North Pole)
 * - Longitude: -180° (Far side west) to +180° (Far side east), 0° (Prime Meridian / Sub-Earth)
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * Create a holographic mission callout billboard sprite.
 * Displays the mission flight code with high contrast in NASA typography.
 */
function createCalloutSprite(text: string, colorHex: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 56;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Backdrop
    ctx.fillStyle = 'rgba(6, 27, 74, 0.9)';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.rect(4, 4, 152, 48);
    ctx.fill();
    ctx.stroke();

    // Top accent line
    ctx.fillStyle = colorHex;
    ctx.fillRect(8, 8, 144, 3);

    // Label text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 80, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(0.42, 0.15, 1);
  return sprite;
}

/**
 * Generate a high-resolution authentic procedural selenographic texture canvas.
 * Faithfully represents major basaltic lunar Maria and prominent crater ray systems
 * at their verified physical coordinates, ensuring 100% offline resilience.
 */
function createProceduralMoonCanvas(): HTMLCanvasElement {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Base anorthositic highlands regolith
  ctx.fillStyle = '#A3A8B2';
  ctx.fillRect(0, 0, width, height);

  // Micro-crater and regolith texture noise
  for (let i = 0; i < 40000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 2.5 + 0.5;
    const brightness = Math.floor(Math.random() * 60 + 130);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness + 4})`;
    ctx.fill();
  }

  // Convert (lat, lon) to equirectangular pixel coordinates
  const toPix = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  // 2. Basaltic Lunar Maria Depressions (Dark basalt plains)
  const mariaList = [
    // Oceanus Procellarum (Enormous western expanse)
    { lat: 20, lon: -55, rx: 220, ry: 200, opacity: 0.5 },
    // Mare Imbrium (Major northwestern basin)
    { lat: 34, lon: -16, rx: 140, ry: 130, opacity: 0.55 },
    // Mare Serenitatis
    { lat: 28, lon: 18, rx: 80, ry: 75, opacity: 0.5 },
    // Mare Tranquillitatis (Apollo 11 site)
    { lat: 8, lon: 31, rx: 90, ry: 80, opacity: 0.55 },
    // Mare Crisium (Distinct circular eastern basin)
    { lat: 17, lon: 59, rx: 65, ry: 55, opacity: 0.6 },
    // Mare Fecunditatis
    { lat: -8, lon: 52, rx: 75, ry: 65, opacity: 0.45 },
    // Mare Nectaris
    { lat: -15, lon: 35, rx: 50, ry: 45, opacity: 0.48 },
    // Mare Nubium
    { lat: -21, lon: -16, rx: 85, ry: 75, opacity: 0.5 },
    // Mare Humorum
    { lat: -24, lon: -38, rx: 55, ry: 50, opacity: 0.52 },
    // South Pole-Aitken Basin (Huge far side depression)
    { lat: -53, lon: -169, rx: 240, ry: 170, opacity: 0.42 },
    // Mare Moscoviense (Far side)
    { lat: 27, lon: 147, rx: 45, ry: 40, opacity: 0.45 },
  ];

  mariaList.forEach((m) => {
    const pos = toPix(m.lat, m.lon);
    const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, m.rx);
    grad.addColorStop(0, `rgba(30, 41, 59, ${m.opacity})`);
    grad.addColorStop(0.65, `rgba(45, 55, 72, ${m.opacity * 0.7})`);
    grad.addColorStop(1, 'rgba(163, 168, 178, 0)');

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, m.rx, m.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  });

  // 3. Tycho Crater & Ray System (43.3°S, 11.2°W) - bright ejecta rays
  const tycho = toPix(-43.3, -11.2);
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.2;
  const rayAngles = [0, 25, 45, 80, 110, 140, 165, 190, 220, 260, 290, 320, 345];
  rayAngles.forEach((angle) => {
    const rad = (angle * Math.PI) / 180;
    const len = Math.random() * 280 + 180;
    ctx.beginPath();
    ctx.moveTo(tycho.x, tycho.y);
    ctx.lineTo(tycho.x + Math.cos(rad) * len, tycho.y + Math.sin(rad) * len);
    ctx.stroke();
  });
  // Tycho crater bright central peak
  ctx.beginPath();
  ctx.arc(tycho.x, tycho.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  // 4. Copernicus Crater (9.6°N, 20.1°W)
  const copernicus = toPix(9.6, -20.1);
  ctx.save();
  ctx.beginPath();
  ctx.arc(copernicus.x, copernicus.y, 14, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fill();
  ctx.restore();

  return canvas;
}

export const LunarGlobe3D: React.FC<LunarGlobe3DProps> = ({
  selectedSiteId,
  onSelectSite,
  onSelectMission,
  className = '',
}) => {
  // Acknowledge optional onSelectMission callback for props compatibility
  void onSelectMission;

  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const moonGroupRef = useRef<THREE.Group | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isRotating, setIsRotating] = useState<boolean>(true);
  const isRotatingRef = useRef<boolean>(true);

  const [hoveredSite, setHoveredSite] = useState<LandingSite | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [webglError, setWebglError] = useState<boolean>(false);
  const [cameraDistance, setCameraDistance] = useState<number>(6.0);

  const sites = useMemo(() => getLandingSites(), []);
  const allMissions = useMemo(() => getMissions(), []);

  const GLOBE_RADIUS = 2.4;

  // Track dragging state for manual rotation
  const isDraggingRef = useRef(false);
  const previousPointerPositionRef = useRef({ x: 0, y: 0 });

  // Toggle rotation with ref synchronization
  const toggleRotation = () => {
    setIsRotating((prev) => {
      const next = !prev;
      isRotatingRef.current = next;
      return next;
    });
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for WebGL capability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglError(true);
        return;
      }
    } catch {
      setWebglError(true);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    camera.position.set(0, 0.5, 6.0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3.5 Starfield (Deep Space Background with authentic stars)
    const starCount = 2000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 30 + Math.random() * 45;

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const colorRand = Math.random();
      if (colorRand > 0.8) {
        // Blue-white star
        starColors[i * 3] = 0.75;
        starColors[i * 3 + 1] = 0.88;
        starColors[i * 3 + 2] = 1.0;
      } else if (colorRand > 0.4) {
        // Pure White star
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 0.95;
      } else if (colorRand > 0.15) {
        // Golden / Yellow star
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.88;
        starColors[i * 3 + 2] = 0.65;
      } else {
        // Subtle Red/Orange star
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.6;
        starColors[i * 3 + 2] = 0.5;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 4. Lighting (Simulating Sun in space)
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFF9E6, 1.4);
    sunLight.position.set(8, 4, 10);
    scene.add(sunLight);

    const backRimLight = new THREE.DirectionalLight(0x93C5FD, 0.35);
    backRimLight.position.set(-8, -2, -6);
    scene.add(backRimLight);

    // 5. Moon Group
    const moonGroup = new THREE.Group();
    moonGroupRef.current = moonGroup;
    scene.add(moonGroup);

    // Generate lunar surface canvas texture
    const moonCanvas = createProceduralMoonCanvas();
    const moonTexture = new THREE.CanvasTexture(moonCanvas);
    moonTexture.colorSpace = THREE.SRGBColorSpace;
    moonTexture.generateMipmaps = true;
    moonTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // Moon Sphere Mesh
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.88,
      metalness: 0.05,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    moonGroup.add(moonMesh);

    // 6. Landing Site Markers Group (Child of moonGroup so they rotate with the Moon!)
    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;
    moonGroup.add(markersGroup);

    // Initial slight tilt (Moon's axial tilt to ecliptic is ~1.54°, framed for good viewing)
    moonGroup.rotation.x = 0.25;
    moonGroup.rotation.y = 0.4;

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Auto-rotation when not interacting and rotation enabled via synchronized ref
      if (isRotatingRef.current && !isDraggingRef.current && moonGroupRef.current) {
        moonGroupRef.current.rotation.y += 0.12 * delta;
      }

      // Gentle starfield drift
      if (stars) {
        stars.rotation.y += 0.005 * delta;
      }

      // Animate pulsing radar sonar wave on markers
      if (markersGroupRef.current) {
        const timeFactor = currentTime * 0.003;
        markersGroupRef.current.children.forEach((child) => {
          const ring = child.getObjectByName('pulseRing') as THREE.Mesh | undefined;
          if (ring && ring.material) {
            const cycle = (timeFactor % 1);
            const scale = 1.0 + cycle * 1.8;
            ring.scale.set(scale, scale, scale);
            const mat = ring.material as THREE.MeshBasicMaterial;
            mat.opacity = Math.max(0, 0.75 * (1 - cycle));
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Window Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      moonTexture.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Markers when sites or selectedSiteId change
  useEffect(() => {
    const markersGroup = markersGroupRef.current;
    if (!markersGroup) return;

    // Clear existing markers
    while (markersGroup.children.length > 0) {
      const obj = markersGroup.children[0];
      markersGroup.remove(obj);
    }

    // Add each landing site marker with aerospace-grade aesthetics
    sites.forEach((site: LandingSite) => {
      const isSelected = site.id === selectedSiteId;
      const pos = latLonToVector3(site.coordinates.latitude, site.coordinates.longitude, GLOBE_RADIUS);

      // Determine color by status of associated missions
      const linkedMissions = allMissions.filter((m: Mission) => site.missions.includes(m.id));
      let markerColor = 0x38BDF8; // Planned Artemis (Electric Sky Blue)
      let colorHex = '#38BDF8';
      if (linkedMissions.some((m: Mission) => m.status === 'delivered')) {
        markerColor = 0x10B981; // Nominal Landed (Vibrant Emerald)
        colorHex = '#10B981';
      } else if (linkedMissions.some((m: Mission) => m.status === 'landed_anomaly')) {
        markerColor = 0xF59E0B; // Landed with telemetry anomaly (Amber Gold)
        colorHex = '#F59E0B';
      }

      const siteMarker = new THREE.Group();
      siteMarker.position.copy(pos);
      siteMarker.userData = { siteId: site.id, site };

      // Orient marker so its local +Y points outward normal to sphere surface
      siteMarker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      // 1. Precision Ground Reticle Outer Ring
      const baseOuterGeo = new THREE.RingGeometry(0.065, 0.08, 32);
      const baseOuterMat = new THREE.MeshBasicMaterial({
        color: markerColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.75,
      });
      const baseOuterMesh = new THREE.Mesh(baseOuterGeo, baseOuterMat);
      baseOuterMesh.rotation.x = Math.PI / 2;
      siteMarker.add(baseOuterMesh);

      // Inner bullseye ring
      const baseInnerGeo = new THREE.RingGeometry(0.018, 0.032, 24);
      const baseInnerMat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const baseInnerMesh = new THREE.Mesh(baseInnerGeo, baseInnerMat);
      baseInnerMesh.rotation.x = Math.PI / 2;
      siteMarker.add(baseInnerMesh);

      // 2. Crosshair tick marks on surface
      const crosshairMat = new THREE.LineBasicMaterial({
        color: markerColor,
        transparent: true,
        opacity: 0.75,
      });
      const crossPoints = [
        new THREE.Vector3(-0.11, 0.002, 0), new THREE.Vector3(-0.04, 0.002, 0),
        new THREE.Vector3(0.04, 0.002, 0), new THREE.Vector3(0.11, 0.002, 0),
        new THREE.Vector3(0, 0.002, -0.11), new THREE.Vector3(0, 0.002, -0.04),
        new THREE.Vector3(0, 0.002, 0.04), new THREE.Vector3(0, 0.002, 0.11),
      ];
      const crossGeo = new THREE.BufferGeometry().setFromPoints(crossPoints);
      const crossLine = new THREE.LineSegments(crossGeo, crosshairMat);
      siteMarker.add(crossLine);

      // 3. Telemetry Stalk Needle (Rising 0.22 units from surface)
      const stalkGeo = new THREE.CylinderGeometry(0.008, 0.012, 0.22, 8);
      stalkGeo.translate(0, 0.11, 0);
      const stalkMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xFFFFFF : 0xE2E8F0,
        emissive: isSelected ? 0x60A5FA : 0x334155,
        metalness: 0.8,
        roughness: 0.2,
      });
      const stalkMesh = new THREE.Mesh(stalkGeo, stalkMat);
      siteMarker.add(stalkMesh);

      // 4. Glowing Beacon Sensor Jewel (At Y=0.22)
      const beaconGeo = new THREE.OctahedronGeometry(isSelected ? 0.07 : 0.05, 0);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xFFFFFF : markerColor,
        emissive: markerColor,
        emissiveIntensity: isSelected ? 1.0 : 0.75,
        roughness: 0.1,
        metalness: 0.1,
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(0, 0.22, 0);
      beaconMesh.rotation.y = Math.PI / 4;
      siteMarker.add(beaconMesh);

      // 5. Pulsing radar sonar wave ring
      const pulseGeo = new THREE.RingGeometry(0.08, 0.13, 32);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xFFFFFF : markerColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.8 : 0.45,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.name = 'pulseRing';
      pulseMesh.rotation.x = Math.PI / 2;
      siteMarker.add(pulseMesh);

      // 6. Floating Holographic Mission Callout Sprite (At Y=0.36)
      const linkedMission = allMissions.find((m: Mission) => site.missions.includes(m.id));
      const tagText = linkedMission ? linkedMission.taskOrder : site.name.slice(0, 8).toUpperCase();
      const sprite = createCalloutSprite(tagText, isSelected ? '#FFFFFF' : colorHex);
      sprite.position.set(0, 0.36, 0);
      siteMarker.add(sprite);

      // 7. Raycast hit-box sphere (Invisible, generous radius for smooth clicking)
      const hitGeo = new THREE.SphereGeometry(0.28, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(0, 0.16, 0);
      hitMesh.userData = { siteId: site.id, site };
      siteMarker.add(hitMesh);

      markersGroup.add(siteMarker);
    });
  }, [sites, allMissions, selectedSiteId]);

  // Center camera on selected site when selectedSiteId changes
  useEffect(() => {
    if (!selectedSiteId || !moonGroupRef.current) return;
    const targetSite = sites.find((s: LandingSite) => s.id === selectedSiteId);
    if (!targetSite) return;

    // Pause auto-rotation when focusing on a specific site
    isRotatingRef.current = false;
    setIsRotating(false);

    // Calculate rotation angles to bring targetSite to the front (+Z)
    const latRad = (targetSite.coordinates.latitude * Math.PI) / 180;
    const lonRad = (targetSite.coordinates.longitude * Math.PI) / 180;

    // Target rotation
    const targetX = latRad;
    const targetY = -lonRad - Math.PI / 2;

    // Smooth transition
    const startX = moonGroupRef.current.rotation.x;
    const startY = moonGroupRef.current.rotation.y;
    const startTime = performance.now();
    const duration = 800;

    const animateFocus = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      if (moonGroupRef.current) {
        moonGroupRef.current.rotation.x = startX + (targetX - startX) * ease;
        moonGroupRef.current.rotation.y = startY + (targetY - startY) * ease;
      }

      if (progress < 1) {
        requestAnimationFrame(animateFocus);
      }
    };
    requestAnimationFrame(animateFocus);
  }, [selectedSiteId, sites]);

  // Mouse & Touch Orbit Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    if (isDraggingRef.current && moonGroupRef.current) {
      const deltaX = e.clientX - previousPointerPositionRef.current.x;
      const deltaY = e.clientY - previousPointerPositionRef.current.y;

      // Rotate moon around Y (horizontal drag) and X (vertical drag)
      moonGroupRef.current.rotation.y += deltaX * 0.007;
      moonGroupRef.current.rotation.x = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, moonGroupRef.current.rotation.x + deltaY * 0.007)
      );

      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Raycast for hover state when not dragging
    if (!cameraRef.current || !markersGroupRef.current) return;
    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);

    if (intersects.length > 0) {
      let hitSite: LandingSite | null = null;
      for (const hit of intersects) {
        if (hit.object.userData?.site) {
          hitSite = hit.object.userData.site as LandingSite;
          break;
        }
      }

      if (hitSite) {
        setHoveredSite(hitSite);
        setHoverPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        container.style.cursor = 'pointer';
        return;
      }
    }

    setHoveredSite(null);
    container.style.cursor = 'grab';
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore pointer release error if not captured
    }
  };

  // Click on Globe Marker
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !cameraRef.current || !markersGroupRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);

    if (intersects.length > 0) {
      for (const hit of intersects) {
        if (hit.object.userData?.siteId) {
          onSelectSite?.(hit.object.userData.siteId);
          isRotatingRef.current = false;
          setIsRotating(false);
          break;
        }
      }
    }
  };

  // Zoom wheel handler
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!cameraRef.current) return;

    const zoomSpeed = 0.003;
    const newZ = Math.max(3.6, Math.min(9.0, cameraRef.current.position.z + e.deltaY * zoomSpeed));
    cameraRef.current.position.z = newZ;
    setCameraDistance(newZ);
  };

  // Zoom control buttons
  const zoomIn = () => {
    if (!cameraRef.current) return;
    const newZ = Math.max(3.6, cameraRef.current.position.z - 0.7);
    cameraRef.current.position.z = newZ;
    setCameraDistance(newZ);
  };

  const zoomOut = () => {
    if (!cameraRef.current) return;
    const newZ = Math.min(9.0, cameraRef.current.position.z + 0.7);
    cameraRef.current.position.z = newZ;
    setCameraDistance(newZ);
  };

  // Reset to default view
  const handleResetView = () => {
    if (!moonGroupRef.current || !cameraRef.current) return;
    moonGroupRef.current.rotation.set(0.25, 0.4, 0);
    cameraRef.current.position.set(0, 0.5, 6.0);
    setCameraDistance(6.0);
    isRotatingRef.current = true;
    setIsRotating(true);
  };

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#070B14] shadow-md ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        onWheel={handleWheel}
        className="w-full aspect-[4/3] sm:aspect-[16/10] max-h-[560px] cursor-grab active:cursor-grabbing relative select-none"
        role="region"
        aria-label="Interactive 3D Moon Globe showing CLPS Landing Sites"
      />

      {/* WebGL Fallback if device has no WebGL */}
      {webglError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#070B14] text-white">
          <AlertTriangle className="w-10 h-10 text-amber-400 mb-2" />
          <h3 className="font-heading font-bold text-base">3D WebGL Acceleration Unavailable</h3>
          <p className="text-xs text-slate-300 max-w-sm mt-1">
            Your current browser environment does not support WebGL. Switch to the 2D Map or Data Table to explore landing sites.
          </p>
        </div>
      )}

      {/* Hover Site Tooltip */}
      {hoveredSite && hoverPosition && (
        <div
          style={{ left: `${hoverPosition.x + 12}px`, top: `${hoverPosition.y - 36}px` }}
          className="absolute z-20 pointer-events-none px-3 py-1.5 rounded-lg bg-black/90 border border-white/20 text-white text-xs font-mono shadow-xl backdrop-blur-sm space-y-0.5"
        >
          <div className="font-bold flex items-center gap-1.5 text-white">
            <span>{hoveredSite.name}</span>
            <span className="text-[10px] text-zinc-400">({hoveredSite.hemisphere})</span>
          </div>
          <div className="text-[10px] text-zinc-300">
            {hoveredSite.coordinates.latitude > 0 ? `${hoveredSite.coordinates.latitude}°N` : `${Math.abs(hoveredSite.coordinates.latitude)}°S`}, {' '}
            {hoveredSite.coordinates.longitude > 0 ? `${hoveredSite.coordinates.longitude}°E` : `${Math.abs(hoveredSite.coordinates.longitude)}°W`} • {hoveredSite.coordinates.elevationMeters}m
          </div>
        </div>
      )}

      {/* Top HUD Bar: Real Coordinates & Status */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-white pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-white" />
          <span className="font-bold">LUNAR 3D SELENOGRAPHY</span>
          <span className="hidden sm:inline text-zinc-400">• R = 1,737.4 KM • {cameraDistance.toFixed(1)}X ZOOM</span>
        </div>

        {/* Marker Count Badge */}
        <div className="px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
          {sites.length} Verified Surface Sites
        </div>
      </div>

      {/* Floating Control Toolbar (Bottom Left) */}
      <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2 z-10">
        {/* Play/Pause Rotation Toggle */}
        <button
          type="button"
          onClick={toggleRotation}
          aria-label={isRotating ? 'Pause rotation' : 'Resume slow rotation'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border shadow-md backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            isRotating
              ? 'bg-[#E03C31] hover:bg-[#c42d23] text-white border-transparent'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
          }`}
        >
          {isRotating ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Rotation</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Rotate Moon</span>
            </>
          )}
        </button>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={handleResetView}
          aria-label="Reset 3D camera to default view"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/85 hover:bg-white/20 text-white text-xs font-mono border border-white/20 shadow-md backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center rounded-lg bg-black/85 border border-white/20 shadow-md backdrop-blur-sm overflow-hidden">
          <button
            type="button"
            onClick={zoomIn}
            aria-label="Zoom in"
            className="p-1.5 text-white hover:bg-white/20 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={zoomOut}
            aria-label="Zoom out"
            className="p-1.5 text-white hover:bg-white/20 transition-colors border-l border-white/20"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Legend Footer (Bottom Right) */}
      <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-sm border border-white/20 text-[10px] font-mono text-white shadow-md">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>Nominal Landed</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span>Partial Tilt</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span>Planned</span>
        </span>
      </div>
    </div>
  );
};
