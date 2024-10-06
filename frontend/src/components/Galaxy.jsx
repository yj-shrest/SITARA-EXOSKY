/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useState } from 'react'
import planetsData from '../planets.json'
import { TextureLoader } from 'three';
import { useEffect } from 'react';

const Planet = ({planet, position = [0, 0, 0], size = 1, texture, onSelectPlanet }) => {
    const handleClick = (event) => {
      event.stopPropagation()
      console.log(planet.pl_name)
      onSelectPlanet(planet)
    }
    
    return (
      <mesh dist={planet.sy_dist} radius={planet.pl_rade} name={planet.pl_name} position={position} onClick={handleClick}
  >
        <sphereGeometry args={[size * 0.2, 32, 32]} />
       <meshStandardMaterial map={texture} roughness={0.5} metalness={0.1} />
      </mesh>
    );
  };
  const Earth = ({ position = [0, 0, 0] }) => {
    const [earthTexture, setEarthTexture] = useState(null);
    useEffect(() => {
      const loader = new TextureLoader();
      loader.load('/Textures/earth.jpg', (loadedTexture) => {
        setEarthTexture(loadedTexture);
      });
    }, []); 
    if (!earthTexture) return null;
    return (
      <mesh position={position}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={earthTexture} emissiveIntensity={0.5} />
      </mesh>
    )
  }
function Galaxy({textures, onSelectPlanet}){
    const [planets, setPlanets] = useState(planetsData);
  
    const calculatePosition = (distance, ra, dec) => {
      // Convert RA and Dec from degrees to radians
      const raRadians = (ra * Math.PI) / 180;
      const decRadians = (dec * Math.PI) / 180;
  
      // Calculate Cartesian coordinates
      const x = distance * Math.cos(decRadians) * Math.cos(raRadians)*5;
      const y = distance * Math.cos(decRadians) * Math.sin(raRadians)*5;
      const z = distance * Math.sin(decRadians)*5;
      return [x, y, z];
  };
  
  
    const getPlanetSize = (planet) => {
      return planet.pl_rade ? planet.pl_rade / 2 : 1; // Default size if radius is missing
    };
    return (
      <group>
        <Earth />
        {planets.map((planet, index) => {
          const distance = planet.sy_dist 
          const ra = planet.ra
          const dec = planet.dec
          if (ra === undefined || dec === undefined || distance === null) return null // Skip if data is missing

          return (
            <Planet 
              planet={planet}
              key={index} 
              position={calculatePosition(distance, ra, dec)} 
              size={getPlanetSize(planet)} 
              texture={textures[index % textures.length]}
              onSelectPlanet={onSelectPlanet}
            />
          )
        })}
      </group>
    )
  }

  export default Galaxy;