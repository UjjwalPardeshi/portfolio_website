import * as THREE from 'three';

// ══════════════════════════════════════════════════════════════
// LOW-POLY ROBOT HEAD – Three.js Chatbot Avatar
// ══════════════════════════════════════════════════════════════

let isTyping = false;

export function initChatbotAvatar(): void {
    const canvas = document.getElementById('chatbot-avatar-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    // ── Scene Setup ───────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.2, 4.5);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
    });
    renderer.setSize(120, 120);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ── Lighting ──────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xC5CAE9, 1.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x5C6BC0, 0.6);
    fillLight.position.set(-3, 0, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x3F51B5, 0.8, 15);
    rimLight.position.set(0, 2, -3);
    scene.add(rimLight);

    // ── Materials ─────────────────────────────────────────────
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x283593, // dark indigo
        metalness: 0.4,
        roughness: 0.5,
        flatShading: true,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
        color: 0x5C6BC0, // lighter indigo
        metalness: 0.3,
        roughness: 0.4,
        flatShading: true,
    });

    const eyeGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x80D8FF,  // bright cyan glow
    });

    const mouthMaterial = new THREE.MeshBasicMaterial({
        color: 0x5C6BC0,
        transparent: true,
        opacity: 0.8,
    });

    const antennaBallMaterial = new THREE.MeshBasicMaterial({
        color: 0x80D8FF,
    });

    // ── Robot Group (so we can rotate the whole head) ──────────
    const robot = new THREE.Group();
    scene.add(robot);

    // ── Head (Rounded Box) ────────────────────────────────────
    const headGeometry = new THREE.BoxGeometry(1.4, 1.3, 1.2, 1, 1, 1);
    // Slightly round the corners by scaling vertices
    const headPositions = headGeometry.getAttribute('position');
    for (let i = 0; i < headPositions.count; i++) {
        const x = headPositions.getX(i);
        const y = headPositions.getY(i);
        const z = headPositions.getZ(i);
        const len = Math.sqrt(x * x + y * y + z * z);
        const scale = 1.0 + 0.06 * (1.0 - len / 1.2);
        headPositions.setXYZ(i, x * scale, y * scale, z * scale);
    }
    headGeometry.computeVertexNormals();
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    robot.add(head);

    // ── Visor / Face Plate ────────────────────────────────────
    const visorGeometry = new THREE.BoxGeometry(1.2, 0.6, 0.15);
    const visorMaterial = new THREE.MeshStandardMaterial({
        color: 0x1A237E, // very dark blue
        metalness: 0.6,
        roughness: 0.3,
        flatShading: true,
    });
    const visor = new THREE.Mesh(visorGeometry, visorMaterial);
    visor.position.set(0, 0.05, 0.55);
    robot.add(visor);

    // ── Eyes ───────────────────────────────────────────────────
    const eyeGroup = new THREE.Group();
    robot.add(eyeGroup);

    const eyeGeometry = new THREE.SphereGeometry(0.12, 8, 8);

    const leftEye = new THREE.Mesh(eyeGeometry, eyeGlowMaterial);
    leftEye.position.set(-0.28, 0.08, 0.63);
    eyeGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeGlowMaterial);
    rightEye.position.set(0.28, 0.08, 0.63);
    eyeGroup.add(rightEye);

    // Eye pupils (darker centers)
    const pupilGeometry = new THREE.SphereGeometry(0.06, 6, 6);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(0, 0, 0.08);
    leftEye.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0, 0, 0.08);
    rightEye.add(rightPupil);

    // ── Mouth ─────────────────────────────────────────────────
    const mouthSegments: THREE.Mesh[] = [];
    const segmentCount = 5;
    for (let i = 0; i < segmentCount; i++) {
        const segGeo = new THREE.BoxGeometry(0.12, 0.06, 0.08);
        const seg = new THREE.Mesh(segGeo, mouthMaterial);
        seg.position.set(-0.3 + i * 0.15, -0.25, 0.6);
        robot.add(seg);
        mouthSegments.push(seg);
    }

    // ── Ears ──────────────────────────────────────────────────
    const earGeometry = new THREE.BoxGeometry(0.15, 0.35, 0.35);
    const leftEar = new THREE.Mesh(earGeometry, accentMaterial);
    leftEar.position.set(-0.78, 0.05, 0);
    robot.add(leftEar);

    const rightEar = new THREE.Mesh(earGeometry, accentMaterial);
    rightEar.position.set(0.78, 0.05, 0);
    robot.add(rightEar);

    // ── Antenna ───────────────────────────────────────────────
    const antennaStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.04, 0.45, 6),
        accentMaterial
    );
    antennaStem.position.set(0, 0.9, 0);
    robot.add(antennaStem);

    const antennaBall = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        antennaBallMaterial
    );
    antennaBall.position.set(0, 1.18, 0);
    robot.add(antennaBall);

    // ── Brow ridge ────────────────────────────────────────────
    const browGeometry = new THREE.BoxGeometry(1.0, 0.08, 0.2);
    const brow = new THREE.Mesh(browGeometry, accentMaterial);
    brow.position.set(0, 0.32, 0.52);
    robot.add(brow);

    // ── Mouse tracking ────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ── Typing state listener ─────────────────────────────────
    document.addEventListener('chatbot-typing-start', () => {
        isTyping = true;
    });
    document.addEventListener('chatbot-typing-end', () => {
        isTyping = false;
    });

    // ── Animation Loop ────────────────────────────────────────
    function animate(): void {
        requestAnimationFrame(animate);

        const time = performance.now() * 0.001;

        // ─ Idle floating / bobbing ──
        robot.position.y = Math.sin(time * 1.2) * 0.06;

        // ─ Head tilts toward mouse ──
        const targetRotY = mouseX * 0.35;
        const targetRotX = -mouseY * 0.2;
        robot.rotation.y += (targetRotY - robot.rotation.y) * 0.05;
        robot.rotation.x += (targetRotX - robot.rotation.x) * 0.05;

        // ─ Eyes follow mouse ──
        const eyeLookX = mouseX * 0.06;
        const eyeLookY = -mouseY * 0.04;
        leftPupil.position.x = eyeLookX;
        leftPupil.position.y = eyeLookY;
        rightPupil.position.x = eyeLookX;
        rightPupil.position.y = eyeLookY;

        // ─ Eye glow pulsing ──
        const eyeBrightness = isTyping
            ? 0.7 + Math.sin(time * 10) * 0.3
            : 0.85 + Math.sin(time * 2) * 0.15;
        eyeGlowMaterial.color.setHSL(0.55, 0.8, eyeBrightness * 0.5);

        // ─ Antenna behavior ──
        if (isTyping) {
            // Bouncy antenna when typing
            antennaBall.position.y = 1.18 + Math.sin(time * 12) * 0.12;
            antennaStem.scale.y = 1.0 + Math.sin(time * 12) * 0.15;
            // Antenna ball glows brighter
            antennaBallMaterial.color.setHex(0xFFFFFF);
        } else {
            // Gentle sway when idle
            antennaBall.position.y = 1.18 + Math.sin(time * 1.5) * 0.03;
            antennaBall.position.x = Math.sin(time * 0.8) * 0.02;
            antennaStem.scale.y = 1.0;
            antennaBallMaterial.color.setHex(0x80D8FF);
        }

        // ─ Mouth animation (typing = equalizer effect) ──
        mouthSegments.forEach((seg, i) => {
            if (isTyping) {
                const offset = i * 0.8;
                seg.scale.y = 1.0 + Math.abs(Math.sin(time * 8 + offset)) * 3.0;
                seg.material = antennaBallMaterial; // bright when talking
            } else {
                seg.scale.y = 1.0;
                seg.material = mouthMaterial;
            }
        });

        // ─ Ear glow when typing ──
        if (isTyping) {
            const earPulse = 0.5 + Math.sin(time * 6) * 0.5;
            (leftEar.material as THREE.MeshStandardMaterial).emissive.setHex(0x3F51B5);
            (leftEar.material as THREE.MeshStandardMaterial).emissiveIntensity = earPulse * 0.5;
            (rightEar.material as THREE.MeshStandardMaterial).emissive.setHex(0x3F51B5);
            (rightEar.material as THREE.MeshStandardMaterial).emissiveIntensity = earPulse * 0.5;
        } else {
            (leftEar.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
            (rightEar.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
        }

        renderer.render(scene, camera);
    }

    animate();
}

// Export typing state setter for use from main.ts
export function setChatbotTyping(typing: boolean): void {
    isTyping = typing;
    document.dispatchEvent(new CustomEvent(typing ? 'chatbot-typing-start' : 'chatbot-typing-end'));
}
