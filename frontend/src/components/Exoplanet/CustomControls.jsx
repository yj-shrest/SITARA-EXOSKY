import React, { useRef, useEffect } from "react";
import { Canvas, useThree, extend, useLoader } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextureLoader } from "three";
import * as THREE from "three";
import  planetData  from "../../planets.json";
import { useParams } from 'react-router-dom'
import { useFrame } from "@react-three/fiber";
const CustomControls = ({disable}) => {
  const { camera, gl } = useThree();
  const target = new THREE.Vector3(0, 50, 50); // Set target point to look at
  let {planetName} = useParams()
    planetName = planetName.split("_").join(" ")
    const singlePlanetData = planetData.find(planet => planet.pl_name === planetName)
    const {ra:planetRa,dec:planetDec,sy_dist:planetDistance} = singlePlanetData
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.enabled = planetDistance < 20?false:!disable;
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 1;
    controls.maxDistance = Infinity;
    controls.enableKeyboardNavigation = true;
    controls.keyboardDollySpeed = 2;
    controls.keyboardPanSpeed = 10;
    controls.keyboardSpeedFactor = 3;
    controls.firstPersonRotationFactor = 0.4;
    controls.pinchPanSpeed = 1;
    controls.pinchEpsilon = 2;
    controls.pointerRotationSpeedPolar = Math.PI / 360;
    controls.pointerRotationSpeedAzimuth = Math.PI / 360;
    controls.keyboardRotationSpeedAzimuth = (10 * Math.PI) / 360;
    controls.keyboardRotationSpeedPolar = (10 * Math.PI) / 360;
    controls.minZoom = 0;
    controls.maxZoom = Infinity;
    controls.target = new THREE.Vector3(0,2,0)
    // Add event listener for camera movement
    controls.addEventListener("change", () => {
      camera.position.set(
        controls.object.position.x,
        controls.object.position.y,
        controls.object.position.z
      );
    });
    controls.update()

    // Clean up on component unmount
    return () => {
      controls.dispose();
    };
  }, [camera, gl, disable]);

  return (
    <mesh position={[0,-50,-50]}>
    <boxGeometry args={[10,10,10]}/>
    <meshBasicMaterial color="red"/>
    </mesh>
  );
};

export default CustomControls;
