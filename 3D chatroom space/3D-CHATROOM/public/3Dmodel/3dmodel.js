const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 750 / 500, 0.1, 1000);

const threedeeDiv = document.getElementById('threedee');

const renderer = new THREE.WebGLRenderer();

renderer.setSize(1020, 620);
threedeeDiv.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.8); 
scene.add(ambientLight);

//I don't know why we needed two, feel free to add it again<3
// const ambientLightTwo = new THREE.AmbientLight('rgb(255, 255, 255)', 0.3); 
// scene.add(ambientLightTwo);

const loader = new THREE.GLTFLoader();
let model;

loader.load('3Dmodel/untitled.glb', function (gltf) {
    model = gltf.scene;
    scene.add(model);

    //maybe we can have buttons to adjust the height of the viewpoint/
    model.position.set(0, 0, 0);
    model.scale.set(1.3, 1.3, 1.3);
    camera.position.set(1, 1, 1);

    model.traverse((child) => {
        if (child.isMesh) {
            if (child.material && child.material.map) {
                child.material = child.material;  // Use the original material (with texture)
            } else {
                child.material = new THREE.MeshStandardMaterial({
                    color: '0xffffff',
                    metalness: 0.0,
                    roughness: 1.0
                });
            }
        }
    });

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const envMap = cubeTextureLoader.load([
        'px.jpg', 'nx.jpg',
        'py.jpg', 'ny.jpg',
        'pz.jpg', 'nz.jpg'
    ]);
    scene.environment = envMap;

    animate();

}, undefined, function (error) {
    console.error(error);
});

// Keyboard movement: arrow key movements, worked from this originally https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
let velocity = new THREE.Vector3();  // Speed of movement
let speed = 0.005; // Movement speed

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp': // move forward
            moveForward = true;
            break;
        case 'ArrowDown': // move backward
            moveBackward = true;
            break;
        case 'ArrowLeft': // move left
            moveLeft = true;
            break;
        case 'ArrowRight': // move right
            moveRight = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp': 
            moveForward = false;
            break;
        case 'ArrowDown': 
            moveBackward = false;
            break;
        case 'ArrowLeft': 
            moveLeft = false;
            break;
        case 'ArrowRight': 
            moveRight = false;
            break;
    }
});

// Pointer Lock integration for mouse movement control (derived from this thing https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html)
let isUnlocked = false;
let mouseMovement = { x: 0, y: 0 };

const onPointerLockChange = () => {
    isUnlocked = document.pointerLockElement === renderer.domElement;
};

const onPointerLockError = () => {
    console.error('Pointer Lock Error');
};



document.addEventListener('pointerlockchange', onPointerLockChange, false);
document.addEventListener('pointerlockerror', onPointerLockError, false);

const requestPointerLock = () => {
    renderer.domElement.requestPointerLock();
};

// Handle mouse movement for camera control when unlocked
const onMouseMove = (event) => {
    if (isUnlocked) {
        mouseMovement.x = event.movementX || event.mozMovementX || 0;
        mouseMovement.y = event.movementY || event.mozMovementY || 0;

        // Adjust camera rotation based on mouse movement
        camera.rotation.y -= mouseMovement.x * 0.002; // Left/Right Rotation

        //This is the wooorst!
        //didn't work at all, or would flip and spin the camera when looking from the wrong angle/
        //you can still comment it in but it needs to be tweaked/

        // camera.rotation.x -= mouseMovement.y * 0.002; // Up/Down Rotation (optional if you want vertical control)
    }
};


document.addEventListener('mousemove', onMouseMove, false);
// Unlock the pointer by pressing escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isUnlocked) {
        document.exitPointerLock();
    }
});

// Request pointer lock on click
threedeeDiv.addEventListener('click', requestPointerLock, false);

// Function to calculate the forward direction of the camera
function getForwardVector() {
    const forward = new THREE.Vector3(0, 0, -1);  // Default forward direction (along Z-axis)
    // Apply camera rotation to the vector
    forward.applyQuaternion(camera.quaternion);
    return forward;
}

function collision() {
    if (camera.position.x > 5.4) {
        camera.position.x = 5.4;  // Block the camera's x position from going past 5.4
    }
    if (camera.position.x < -5.4) {
        camera.position.x = -5.4; 
    }
    if (camera.position.z > 7.6) {
        camera.position.z = 7.6;
    }
    if (camera.position.z < -3.4) {
        camera.position.z = -3.4; 
}
}

// Moving the camera
function animate() {
    requestAnimationFrame(animate);

    if (isUnlocked) {
        const forward = getForwardVector(); // Get the forward direction relative to the camera
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)); // Right direction (perpendicular to forward)

        // Set velocity based on where the camera's looking rather than just general static directions
        if (moveForward) velocity.add(forward.multiplyScalar(speed));  // Move forward
        if (moveBackward) velocity.add(forward.multiplyScalar(-speed));  // Move backward
        if (moveLeft) velocity.add(right.multiplyScalar(-speed));  // Move left
        if (moveRight) velocity.add(right.multiplyScalar(speed));  // Move right
    }

    // Update the camera position
    camera.position.add(velocity);
    velocity.set(0, 0, 0);
// I can use this when I'll do the collisions/
    // console.log(camera.position)

    collision();

    renderer.render(scene, camera);
}