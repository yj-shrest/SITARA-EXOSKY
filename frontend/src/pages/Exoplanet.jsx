import React, { useEffect } from "react";
import { Canvas, useThree, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three';
import Stars from "../components/Exoplanet/Stars";
import { useRef } from "react";
import { useGlobalContext } from "../components/Context";
import {useParams} from "react-router-dom"
import planetData from "../planets.json"
import CustomControls from "../components/Exoplanet/CustomControls"
extend({ OrbitControls });


// Convert exoplanet RA/Dec/Distance to Cartesian coordinates
const convertToCartesian = ({ ra, dec, distance }) => {
  const theta = (90 - dec) * (Math.PI / 180); // Declination to radians
  const phi = ra * (Math.PI / 180); // Right Ascension to radians
  const x = distance * Math.sin(theta) * Math.cos(phi);
  const y = distance * Math.sin(theta) * Math.sin(phi);
  const z = distance * Math.cos(theta);
  return { x, y, z };
};

const TexturedPlane = () => {
  // Ground or environment texture
  const texture = new THREE.TextureLoader().load("/Venusian.png");

  return (
    <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1100, 1100]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const Scene = (originShift) => {
  const {selectedPlanet} = useGlobalContext()
  // const {ra,dec,sy_dist} = selectedPlanet
  let {planetName} = useParams()
  planetName = planetName.split("_").join(" ")

  // const groupRef = useRef()
  const singlePlanetData = planetData.find(planet => planet.pl_name === planetName)
  const {ra,dec,sy_dist} = singlePlanetData
  
  // useEffect(() => {
  //   if (groupRef.current) {
  //     groupRef.current.position.set(
  //       -originShift.x,
  //       -originShift.y,
  //       -originShift.z
  //     ); // Shift the origin
  //   }
  // }, [originShift]);
  return (
    <>
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <TexturedPlane />
      </group>
      {/* <FloatingSpheres /> */}
      <Stars ra={ra} dec={dec} sy_dist = {sy_dist} />
    </>
  );
};

export default function Exoplanet() {
  const {selectedPlanet} = useGlobalContext()
  // const {ra,dec,sy_dist:distance} = selectedPlanet
  let {planetName} = useParams()
  planetName = planetName.split("_").join(" ")
  const singlePlanetData = planetData.find(planet => planet.pl_name === planetName)
  const {ra,dec,sy_dist:distance} = singlePlanetData
  const exoplanetPosition = convertToCartesian({ra, dec, distance});
  console.log(selectedPlanet)
  return (
    <div className="w-full h-screen" style={{ backgroundColor: "black" }}>
      <Canvas>
        <Scene />
        <CustomControls />
      </Canvas>
    </div>
  );
}
