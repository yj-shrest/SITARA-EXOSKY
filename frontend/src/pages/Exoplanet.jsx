import React, { useEffect } from "react";
import { Canvas, useThree, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three';
import Stars from "../components/Exoplanet/Stars";
import { useGlobalContext } from "../components/Context";
import {useParams} from "react-router-dom"
import planetData from "../planets.json"
import CustomControls from "../components/Exoplanet/CustomControls"
import SkyMap2D from "../pages/SkyMap2D"
import {useState} from "react";
extend({ OrbitControls });


// Convert exoplanet RA/Dec/Distance to Cartesian coordinates

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
    </div>
  );
}
else{
  return(
    <SkyMap2D planetRa={planetRa} planetDec={planetDec} planetDistance={planetDistance}/>
  )
}

}
