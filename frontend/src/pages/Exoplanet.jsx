import React, { useEffect, useState, useRef } from "react";
import { Canvas, useThree, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three';
import Stars from "../components/Exoplanet/Stars";
import { useGlobalContext } from "../components/Context";
import {useParams} from "react-router-dom"
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useFrame } from "@react-three/fiber";
import { AxesHelper } from "three";



import { useGlobalContext } from "../components/Context";
import Stars from "../components/Exoplanet/Stars";
import planetData from "../planets.json"
import CustomControls from "../components/Exoplanet/CustomControls"
import SkyMap2D from "../pages/SkyMap2D"
import {useState} from "react";


extend({ OrbitControls });


// Convert exoplanet RA/Dec/Distance to Cartesian coordinates

const TexturedPlane = () => {
  const texture = new THREE.TextureLoader().load("/Venusian.png");
  const materialRef = useRef();
  const { camera } = useThree();

   useFrame(() => {
    // Get the camera's direction vector
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    // Calculate the pitch based on the y component of the direction vector
    const pitch = Math.asin(direction.y); // Get the pitch angle in radians

    // Convert to degrees
    const pitchDegrees = THREE.MathUtils.radToDeg(pitch);
    console.log(pitchDegrees)
    // Calculate opacity based on pitch (up and down)
    // Invert the logic: when looking down, opacity should decrease
    // const opacity = Math.max(0, Math.min(1, (pitchDegrees - 90) / -90));// Adjust this logic
    const opacity = pitchDegrees<0?(90+pitchDegrees)/90:1;// Adjust this logic

    // Log the pitch and opacity values
    console.log("Pitch in degrees:", pitchDegrees, "Opacity:", opacity);

    // Update the material's opacity
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1100, 1100]} />
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        transparent={true} // Enable transparency for opacity to work
        opacity={1} // Set initial opacity to 1
      />
    </mesh>
  );
};

const Scene = () => {
  // const {ra,dec,sy_dist} = selectedPlanet
  let {planetName} = useParams()
  planetName = planetName.split("_").join(" ")

  // const groupRef = useRef()
  const singlePlanetData = planetData.find(planet => planet.pl_name === planetName)
  const {ra,dec,sy_dist} = singlePlanetData
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
  const [skymap2d, setSkymap2d] = useState(false)
  // const {selectedPlanet, setSelectedPlanet} = useGlobalContext()
  // // const {ra,dec,sy_dist:distance} = selectedPlanet
  let {planetName} = useParams()
  planetName = planetName.split("_").join(" ")
  const singlePlanetData = planetData.find(planet => planet.pl_name === planetName)
  const {ra:planetRa,dec:planetDec,sy_dist:planetDistance} = singlePlanetData
  // const exoplanetPosition = convertToCartesian({ra, dec, distance});
  // console.log(selectedPlanet)
  const handleOnclick = () => {
    setSkymap2d(true)
  }
  if(!skymap2d){
  return (
    <div className="w-full h-screen" style={{ backgroundColor: "black" }}>
      <Canvas>
        <Scene />
        <CustomControls />
      </Canvas>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2 self-center" onClick={()=>handleOnclick()}>
        Draw Constellation
            </button>
      <button className="absolute top-[2rem] px-4 py-2 text-white left-[2rem] flex align-start rounded">
        <Link to ="/">
        <IoArrowBackCircleOutline size = {30} />
        </Link>
          
            
      </button>
    </div>
  );
}
else{
  return(
    <SkyMap2D planetRa={planetRa} planetDec={planetDec} planetDistance={planetDistance}/>
  )
}

}
