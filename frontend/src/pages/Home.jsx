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
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  const handleSelectPlanet = (planet) => {
    setSelectedPlanet(planet)
  }
  const [textures, setTextures] = useState([]);
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
    <div className='flex flex-col'>
      <div className='flex flex-row bg-[#0C0C0C] justify-between h-[10vh]'>
        <div className='flex flex-row text-white py-3 mx-16'>
            <img src="./logo.png" alt=""  className='w-[3rem] mr-3 h-[2.6rem] justify-center items-center text-center'/>
            <p className='text-[2rem] font-semibold'>Sitara</p>
        </div>
        {/* <input type="text" className='bg-white rounded-[5rem] my-8 w-[20rem] mr-16 pl-12 text-[1rem] font-medium' placeholder='Search for Exoplanet'/> */}
        <PlanetSearch onSelectPlanet={handleSelectPlanet} />
      </div>
      <div className='flex justify-center items-center  bg-black h-[90vh]'>

      <Canvas>
        <ambientLight intensity={0.8} />
        <directionalLight position={[0,0,0]} intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={0.7} />
  <hemisphereLight skyColor={'#ffffff'} groundColor={'#000000'} intensity={0.5} />
  <spotLight position={[10, 20, 10]} angle={0.3} penumbra={0.1} intensity={1} />
  <Environment files={['/Textures/hdri.exr']} background={false}/>
  <MovingPointLight />
        {textures.length > 0 && (
          <Galaxy textures={textures} onSelectPlanet={handleSelectPlanet}/>
        )}
        <CameraController selectedPlanet={selectedPlanet}/>
      </Canvas>
      {selectedPlanet && (<div className='absolute top-[40vh] left-[7rem] w-[20rem] bg-black bg-opacity-50 flex flex-col items-center justify-center'>
        <p className='text-white text-2xl font-semibold'>{selectedPlanet.pl_name}</p>
        <p className='text-white text-lg'>{`Host Star: ${selectedPlanet.hostname}`}</p>
        <p className='text-white text-lg'>{`Distance: ${selectedPlanet.sy_dist} parsecs`}</p>
        <p className='text-white text-lg'>{`Radius: ${selectedPlanet.pl_rade} Earth Radii`}</p>
        <p className='text-white text-lg'>{`Mass: ${selectedPlanet.pl_bmasse} Earth Masses`}</p>
        <p className='text-white text-lg'>{`Orbital Period: ${selectedPlanet.pl_orbper} days`}</p>
        <p className='text-white text-lg'>{`Orbital Distance: ${selectedPlanet.pl_orbsmax} AU`}</p>
        <p className='text-white text-lg'>{`Discovery Year: ${selectedPlanet.disc_year}`}</p>
      </div>)}
      </div>
    </div>
  )
}
