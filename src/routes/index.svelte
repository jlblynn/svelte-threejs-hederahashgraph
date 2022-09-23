<script>

  import { onMount } from 'svelte';

  import { connectClient } from '../index';
  import { getAccountBalance } from '../index';

  import * as THREE from 'three';



  let PRIVATE_KEY = "302e020100300506032b657004220420e4de8d58923dff3a00dffb6f0f033cb6a77615fac499d3d7926e4abc9c278549";
  let ACCOUNT_ID = "0.0.317857";

  let result;

  let connected = false;

  let balance = "";

  import {
    Canvas,
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    //BasicShadowMap,
    //PCFShadowMap,
    PCFSoftShadowMap,
    //VSMShadowMap,
    AmbientLight,
    BoxBufferGeometry,
    SphereBufferGeometry,
    PlaneBufferGeometry,
    Mesh,
    MeshStandardMaterial,
    WebGLRenderer,
    OrbitControls,
    DoubleSide,
    MathUtils,
  } from "https://unpkg.com/svelthree@latest/dist/svelthree.mjs";

  //let cubeGeometry = new BoxBufferGeometry(1, 2, 1);
  let sphereMaterial = new MeshStandardMaterial();

  

  let radius;
  let widthSegments;
  let heightSegments;

  let sphereGeometry;

  let planetColor = "";


  // let floorGeometry = new PlaneBufferGeometry(4, 4, 1);
  // let floorMaterial = new MeshStandardMaterial();

  
  let clicked = false;
  let mass;
  let diameter;
  let distance;
  let planetName;
  let planetType;
  let id = 1;

  let generated = {}

  function generate() {
    console.log("Generating planet...");
    clicked = true;
    planetColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    radius = 15;
    widthSegments = 16;
    heightSegments = 32;
    sphereGeometry = new SphereBufferGeometry(radius, widthSegments, heightSegments)

    console.log(planetColor)
    console.log(radius, heightSegments, widthSegments)

    mass = Math.floor((Math.random()*10000000000000000000000000000000000000000000000) + 100000000000000000000000);
    diameter = Math.floor((Math.random()*10000000000) + 3000);
    distance = Math.floor((Math.random()*1000000000010000000000000000000000000000000000000000000000) + 20000000);
    planetName = planetNames[Math.floor(Math.random() * planetNames.length)];
    planetType = type[Math.floor(Math.random() * type.length)];
    id = id++;

    const newPlanet = new Planet(planetName, id, distance, diameter, planetType, planetColor, mass)

    generated = newPlanet;
    console.log(generated)

    getColor(planetColor);
    
  }

  function Planet( planetName, id, distance, diameter, planetType, planetColor, mass) {
    this.planetName = planetName;
    this.id = id;
    this.distance = distance;
    this.diameter = diameter;
    this.planetType = planetType;
    this.color = planetColor;
    this.mass = mass;
  }

  let planetNames = [
    "Earth",
    "Mercury",
    "Mars",
    "Venus",
    "Jupiter",
    "Saturn",
    "Pluto",
    "Hercules",
    "Exodus",
    "Morpheus",
    "Neo",
    "Mordor",
    "Elixxir",
    "Gigantua",
    "Terraluna",
    "F6",
    "Capricorn"
  ]

  let type = [
    'terrestrial',
    'gas'
  ]


  async function getColor(planetColor) {
    let searchTerm = planetColor;
    const res = await fetch(`http://thecolorapi.com/id?hex=${searchTerm}`);
    let colorName = res.name;

    if (res.ok && thisSearchTerm == searchTerm) {
      console.log(colorName);
    }
  }



  onMount(() => {
    result = connectClient(ACCOUNT_ID, PRIVATE_KEY);


    if (result) {
      connected = true;
      balance = getAccountBalance(ACCOUNT_ID, PRIVATE_KEY)
      console.log("Balance: " + balance)
    } else {
      console.log("False")
    }

  });

</script>

<div class="container">

  {#if connected}
    <h1>Connected</h1>
    <p>{balance}</p>
    <br>
    <h2>Generate your planet</h2>
    <button on:click={generate}>Generate</button>
    <br>
    {#if clicked}
    <Canvas let:sti w={500} h={500}>

      <Scene {sti} let:scene id="scene1" props={{ background: "#000000" }}>
    
        <PerspectiveCamera {scene} id="cam1" pos={[0, 0, 300]} lookAt={[0, 0, 0]} />
        <AmbientLight {scene} intensity={1.25} />
        <DirectionalLight
          {scene}
          pos={[1, 2, 1]}
          intensity={0.8}
          shadowMapSize={512 * 8}
          castShadow />
    
        <Mesh
          {scene}
          geometry={sphereGeometry}
          material={sphereMaterial}
          mat={{ roughness: 0.5, metalness: 0.5, color: planetColor }}
          pos={[0, 0, 0]}
          rot={[0, 0, 0]}
          castShadow
          receiveShadow />

         
    
          <!-- Floor

        <Mesh
          {scene}
          geometry={floorGeometry}
          material={floorMaterial}
          mat={{ roughness: 0.5, metalness: 0.5, side: DoubleSide, color: 0xf7fafc }}
          pos={[0, -0.501, 0]}
          rot={[MathUtils.degToRad(-90), 0, 0]}
          scale={[1, 1, 1]}
          receiveShadow />

          -->
    
        <OrbitControls {scene} autoRotate enableDamping />
    
      </Scene>
    
      <WebGLRenderer
        {sti}
        sceneId="scene1"
        camId="cam1"
        config={{ antialias: true, alpha: true }}
        enableShadowMap
        shadowMapType={PCFSoftShadowMap} />
    
    </Canvas>

    <div class="planet-info">
      <ul>
        <li>Name: {generated.planetName}</li>
        <li>Type: {generated.planetType}</li>
        <li>Diameter: {generated.diameter} kms</li>
        <li>Mass: {generated.mass} tons</li>
        <li>Distance from Sun: {generated.distance} kms</li>
        <li>Colour: {generated.color}</li>
      </ul>
    </div>

  {/if}
    

  {:else}
    <h1>Not Connected</h1>
  {/if}

</div>


<style>


</style>
