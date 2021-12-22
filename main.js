import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Light } from 'three';


// ******************************************************** SCENE SETUP ******************************************************************************
const scene = new THREE.Scene(); // container for threejs objects

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); // fov, aspect ratio, view frustrum

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(40);

// ******************************************************** LIGHTING ******************************************************************************

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(30, 20, 20);
pointLight.castShadow = true;
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(pointLight, ambientLight);

pointLight.shadow.mapSize.width = 512; // default
pointLight.shadow.mapSize.height = 512; // default
pointLight.shadow.camera.near = 0.5; // default
pointLight.shadow.camera.far = 200; // default

// ********************************************************* CUBE ******************************************************************************
const geometry  = new THREE.BoxGeometry(10, 10, 10);
const texture = new THREE.TextureLoader().load("./cubeTexture.png");
const normalTexture = new THREE.TextureLoader().load("./cubeNormalMap.png");

const material = new THREE.MeshStandardMaterial({map:texture, normalMap: normalTexture, metalness: 0.2}); 
const shape = new THREE.Mesh(geometry, material);
shape.castShadow = true;
shape.receiveShadow = true;
scene.add(shape);

// ********************************************************* TORUS ******************************************************************************
const torusGeometry = new THREE.TorusGeometry(11, 1, 16, 100);
const loader = new THREE.CubeTextureLoader();
const cubeTexture = loader.load( [ './px.png', './nx.png', './py.png', './ny.png', './pz.png', './nz.png' ] );
cubeTexture.encoding = THREE.sRGBEncoding;

const torusMaterial = new THREE.MeshStandardMaterial( {envMap:cubeTexture, roughness: 0, metalness: 1} );
const torusShape = new THREE.Mesh(torusGeometry, torusMaterial);
torusShape.castShadow = true;
torusShape.receiveShadow = false;
scene.add(torusShape);

// ********************************************************* MOUNTAINS ******************************************************************************
const mountainGeometry = new THREE.PlaneBufferGeometry(400, 300, 64, 64);
const mountainTexture = new THREE.TextureLoader().load("./mountain.jpg");
const mountainHeight = new THREE.TextureLoader().load("./mountainHeight.png");

const mountainMaterial = new THREE.MeshStandardMaterial({
  color:"gray",
  map: mountainTexture,
  displacementMap: mountainHeight,
  displacementScale: 35,
})
const mountainShape = new THREE.Mesh(mountainGeometry, mountainMaterial);
mountainShape.position.y = -50;
mountainShape.position.z = -30;
mountainShape.rotation.x = 181;
scene.add(mountainShape);

// ******************************************************** HELPERS ******************************************************************************

// const axesHelper = new THREE.AxesHelper(1000);
// axesHelper.setColors(0xffffff, 0xffffff, 0xffffff);
// scene.add( axesHelper );

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );

const controls = new OrbitControls(camera, renderer.domElement); // listens to dom events on mouse and updates camera position accordingly



// ******************************************************** BACKGROUND OBJECTS ******************************************************************************

// function addStar() {
//   const geometry = new THREE.OctahedronGeometry(1);
//   const material = new THREE.MeshStandardMaterial({color:0xffffff});
//   const star = new THREE.Mesh(geometry, material);

//   const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(150)); // get 3 random positional values
//   star.position.set(x, y, z);
//   scene.add(star);
// }

// Array(100).fill().forEach(addStar); // call addStar function 200 times


// ******************************************************** ANIMATION LOOP ******************************************************************************

function animate() {
  requestAnimationFrame(animate);

  shape.rotation.x += 0.005;
  shape.rotation.y += 0.005;
  shape.rotation.z += 0.005;

  torusShape.rotation.x -= 0.007;
  torusShape.rotation.y -= 0.007;
  torusShape.rotation.z -= 0.007;

  controls.update();
  renderer.render(scene, camera);
}

animate()