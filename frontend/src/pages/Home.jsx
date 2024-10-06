/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Canvas } from '@react-three/fiber'
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useEffect, useState } from 'react'
import { extend, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import CameraController from '../components/CameraController';
import PlanetSearch from '../components/Planetsearch';
import Galaxy from '../components/Galaxy';
import { Environment } from '@react-three/drei'
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../components/Context';

extend({ ThreeOrbitControls })
const texturesList = ['/Textures/Alpine.png', '/Textures/Icy.png', '/Textures/Volcanic.png', '/Textures/Swamp.png', '/Textures/Martian.png', '/Textures/Tropical.png'];


const MovingPointLight = () => {
  const lightRef = useRef()
  const { camera } = useThree()  // Access the camera object

  // Update light position to follow the camera
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position)
    }
  })

  return (
    <pointLight ref={lightRef} intensity={10} distance={100} decay={0.5} />
  )
}
export default function Home() {
  const {selectedPlanet, setSelectedPlanet} = useGlobalContext()
  
    useEffect(() => {
      setTimeout(() => {
        setLoading(false);
      }, [5000]);
    }, []);

  const handleSelectPlanet = (planet) => {
    setSelectedPlanet(planet)
  }
  const [textures, setTextures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = new TextureLoader();
    const loadedTextures = texturesList.map(path => {
      const texture = loader.load(path, (texture) => {
        // console.log(`Loaded texture: ${path}`);
      }, undefined, (error) => {
        console.error(`Error loading texture: ${path}`, error);
      });
      return texture;
    });
    setTextures(loadedTextures);
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex flex-row bg-[#0C0C0C] justify-between h-[10vh]">
        <div className="flex flex-row text-white py-3 mx-16">
          <img
            src="./logo.png"
            alt=""
            className="w-[3rem] mr-3 h-[2.6rem] justify-center items-center text-center"
          />
          <p className="text-[2rem] font-semibold">Sitara</p>
        </div>
        <PlanetSearch onSelectPlanet={handleSelectPlanet} />
      </div>
      {loading && (
          <div className="w-full h-full top-[10vh] left-0 absolute object-contain flex items-center justify-center bg-[#0a1314]">
            <img src="/loading.gif" alt="" className="h-full w-auto" />
          </div>
        )}
      <div className="flex justify-center items-center  bg-black h-[90vh]">
        <Canvas>
          <ambientLight intensity={0.8} />
          <directionalLight position={[0, 0, 0]} intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={0.7} />
          <hemisphereLight
            skyColor={"#ffffff"}
            groundColor={"#000000"}
            intensity={0.5}
          />
          <spotLight
            position={[10, 20, 10]}
            angle={0.3}
            penumbra={0.1}
            intensity={1}
          />
          <Environment files={["/Textures/hdri.exr"]} background={false} />
          <MovingPointLight />
          {textures.length > 0 && (
            <Galaxy textures={textures} onSelectPlanet={handleSelectPlanet} />
          )}
          <CameraController selectedPlanet={selectedPlanet} />
        </Canvas>
        {selectedPlanet?.pl_name && (
          <div className="absolute top-[25vh] left-[3rem] w-[16rem]  bg-gray-900 bg-opacity-90 flex flex-col items-start gap-3 justify-center rounded-xl px-4 py-6">
            <p className="text-white text-2xl font-semibold self-center">
              {selectedPlanet.pl_name}
            </p>
            <p className="text-white text-sm">{`Host Star: ${selectedPlanet.hostname}`}</p>
            <p className="text-white text-sm">{`Distance: ${
              selectedPlanet.sy_dist !== null
                ? selectedPlanet.sy_dist + "parsecs"
                : "Unknown"
            }`}</p>
            <p className="text-white text-sm">{`Radius: ${
              selectedPlanet.pl_rade !== null
                ? selectedPlanet.pl_rade + " Earth Radii"
                : `Unknown`
            }`}</p>
            <p className="text-white text-sm">{`Mass: ${
              selectedPlanet.pl_bmasse !== null
                ? selectedPlanet.pl_bmasse + " Earth Masses"
                : `Unknown`
            }`}</p>
            <p className="text-white text-sm">{`Orbital Period: ${` ${
              selectedPlanet.pl_orbper !== null
                ? selectedPlanet.pl_orbper + " Days"
                : `Unknown`
            }`} `}</p>
            <p className="text-white text-sm">{`Orbital Distance: ${
              selectedPlanet.pl_orbsmax !== null
                ? selectedPlanet.pl_orbsmax + "AU"
                : "Unknown"
            } `}</p>
            <p className="text-white text-sm">{`Discovery Year: ${selectedPlanet.disc_year}`}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2 self-center">
              <Link
                to={`/exoplanet/${selectedPlanet.pl_name.split(" ").join("_")}`}
              >
                View Nightsky
              </Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
