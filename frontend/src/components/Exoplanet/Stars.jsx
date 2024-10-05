/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react'

import axios from 'axios'
const Star = ({ position, magnitude }) => {
    return (
      <mesh position={position}>
        <sphereGeometry args={[magnitude, 16, 16]} />
        <meshBasicMaterial color={"white"} />
      </mesh>
    );
  };
const Stars = ({ra,dec,sy_dist}) => {
    
    const [stars,setStars] = useState([])
    useEffect(() => {
        const fetchStars = async () => {
            console.log("Fetching stars")
            try {
                const response = await axios.get(`http://localhost:4000/api/getStarData?ra=${ra}&dec=${dec}&searchRadius=20&magLimit=10`);
                const data = JSON.parse(response.data.data);
                setStars(data);
                console.log(data[0]);
            } catch (error) {
                console.error('Error fetching star data:', error);
            }
        };
        fetchStars();
    }, [ra, dec]);
  return (
    <mesh>
      {stars.map((star,index) => {
        const radius = star.Distance || 52;

        const theta = (90 - star.Declination) * (Math.PI / 180); // Declination to radians
        const phi = star.RightAscension * (Math.PI / 180); // Right Ascension to radians
        // console.log(theta, phi);
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi); // Should use sin(theta)
        const z = radius * Math.cos(theta); // Should use cos(theta)

        
        return (
          <Star
            key={index}
            position={[x, y, z]}
            magnitude={star.Magnitude / 50}
          />
        );
      })}
    </mesh>
  )
}

export default Stars
