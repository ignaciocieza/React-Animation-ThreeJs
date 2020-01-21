import React, { useState, useRef, useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' ;
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import * as THREE from 'three';

extend({ OrbitControls });

const SpaceShip=()=>{
  const [model, setModel] = useState();
  
  useEffect(()=>{
    new GLTFLoader().load('/scene.gltf',setModel);
  },[]);

  return (
    model ? <primitive object={model.scene} />: null
  )
}

const Controls = () => {
  const orbitRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    orbitRef.current.update();
    //orbitRef.current && orbitRef.current.update()
  });

  return (
    <orbitControls
      ref={orbitRef}
      autoRotate
      args={[camera, gl.domElement]}
    //maxPolarAngle={Math.PI/3}
    //minPolarAngle={Math.PI/3}
    />
  )
}

const Plane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} postition={[0, -0.5, 0]} receiveShadow>
    <planeBufferGeometry attach='geometry' args={[100, 100]} />
    <meshPhysicalMaterial attach='material' color="white" />
  </mesh>
)

const Box = () => {
  //const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const props = useSpring({
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: hovered ? "hotpink" : 'gray',
  });


  // useFrame(()=>{
  //   meshRef.current.rotation.y += 0.01;
  // })
  //console.log("rendea");

  return (
    <a.mesh
      //ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
      scale={props.scale}
      castShadow
    >
      <ambientLight />
      <spotLight position={[0, 5, 10]} penumbra={1} castShadow />
      <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
      <a.meshBasicMaterial attach='material' color={props.color} />
    </a.mesh>)
};

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }} onCreated={({ gl }) => {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }}>
      <fog attach='fog' args={['white', 5, 15]} />
      <Controls />
      <Box />
      {/* <Plane /> */}
      <SpaceShip/>
    </Canvas>
  );
}

export default App;
