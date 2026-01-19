let scene, camera, renderer, dodecahedron, directionalLight, ambientLight;
let isAnimating = true;
let rotationSpeed = 0.002;
let introAnimation = false;
let introProgress = 0;
let currentRotationX = 0;
let currentRotationY = 0;
let currentRotationZ = 0;

function resizeRenderer() {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
}

function init() {
    // Main scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('threeCanvas'),
        antialias: true, 
        alpha: true 
    });
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);

    const geometry = new THREE.DodecahedronGeometry(2.5, 0);
    const material = new THREE.MeshLambertMaterial({
        color: 0xb3b3b3,
        transparent: false,
        opacity: 0.9
    });

    dodecahedron = new THREE.Mesh(geometry, material);
    dodecahedron.castShadow = true;
    dodecahedron.receiveShadow = true;
    dodecahedron.rotation.set(0, 0, 0);
    dodecahedron.position.set(-800, 0, 0);
    
    scene.add(dodecahedron);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xf0f0f0, 1);
    directionalLight.position.set(5, 5, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    setTimeout(() => {
        startAnimations();
    }, 1000);

    animate();
}

function startAnimations() {
    introAnimation = true;
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.classList.add('visible');
}

function animate() {
    requestAnimationFrame(animate);

    // Main scene animation
    if (isAnimating && !introAnimation) {
        currentRotationX += rotationSpeed * 0.1;
        currentRotationY += rotationSpeed;
        currentRotationZ += rotationSpeed * 0.04;
    }

    if (introAnimation) {
        introProgress += 0.015;
        
        if (introProgress <= 1) {
            const easeOut = 1 - Math.pow(1 - introProgress, 3);
            
            dodecahedron.position.x = 0;
            dodecahedron.position.y = -8 + (8 * easeOut);
            dodecahedron.position.z = 0;
            
            const extraRotSpeed = (1 - easeOut) * 0.048;
            currentRotationX += (rotationSpeed + extraRotSpeed) * 0.1;
            currentRotationY += (rotationSpeed + extraRotSpeed) * 1.0;
            currentRotationZ += (rotationSpeed + extraRotSpeed) * 0.04;
            
            dodecahedron.material.opacity = easeOut * 0.9;
        } else {
            introAnimation = false;
            dodecahedron.position.set(0, 0, 0);
            dodecahedron.material.opacity = 0.9;
        }
    }
    
    dodecahedron.rotation.x = currentRotationX;
    dodecahedron.rotation.y = currentRotationY;
    dodecahedron.rotation.z = currentRotationZ;

    renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener('load', init);


