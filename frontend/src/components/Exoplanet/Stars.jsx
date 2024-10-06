/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import planetData from '../../planets.json'
import { useGlobalContext } from '../Context'
import earthStars from "../../earth_stars.json"




const Star = ({ position, magnitude, drawing }) => {
  const {setSelectedPoints} = useGlobalContext()
  // console.log("Drawing from star", drawing)
  const handleStarClick = () => {
    console.log("Drawing", drawing)
    if(drawing){
      setSelectedPoints((prevPoints) => [...prevPoints, position]);
      console.log(position)
    }
  }
  return (
      <mesh position={position} onClick={handleStarClick}>
        <sphereGeometry args={[magnitude, 16, 16]} />
        <meshBasicMaterial color={"white"} />
      </mesh>
    );
  };
const Stars = ({ra,dec,sy_dist,drawing}) => {
  // console.log("Drawing from starsss", drawing)
  
    const [stars,setStars] = useState([])
    const {setStarData} = useGlobalContext()
    let {planetName} = useParams()
    planetName = planetName.split("_").join(" ")
    const singlePlanetData = planetData.find(planet => planet.pl_name === planetName)
    const {ra:planetRa,dec:planetDec,sy_dist:planetDistance} = singlePlanetData

    useEffect(() => {
        const fetchStars = async () => {
            console.log("Fetching stars");
            try {
                const response = await axios.get(`http://localhost:4000/api/getStarData`,{
                  params:{
                    ra:ra,
                    dec:dec,
                    searchRadius:planetDistance<20?90:20,
                    magLimit:10,
                    dist:sy_dist,
                    plusminus:80
                  }
                });
                console.log(response.data.total)
                // Directly use response.data, assuming the data is already in JSON format
                // console.log(response.data.data)
                const data = response.data.data;
                // console.log(data[0])
                const [ab , ...data2] = data
                // console.log(data2[0])
                // console.log(earthStars)
                // setStars((previous)=>[...data2, ...previous]);
                // setStarData([...earthStars, ...data2]);
                setStars(data2)
                setStarData(data2)
                // console.log(data);
            } catch (error) {
                console.error('Error fetching star data:', error);
            }
        };
        fetchStars();
    }, [ra, dec]);
  return (
    <mesh>
      {stars.map((star,index) => {
        const radius = star.Distance;
        if(radius === null){
            return null
        }
        // console.log(star)
        const theta = (90 - star.Declination) * (Math.PI / 180); // Declination to radians
        const phi = star.RightAscension * (Math.PI / 180); // Right Ascension to radians
        // console.log(theta, phi);
        const starx = radius * Math.sin(theta) * Math.cos(phi);
        const stary = radius * Math.sin(theta) * Math.sin(phi); // Should use sin(theta)
        const starz = radius * Math.cos(theta); // Should use cos(theta)

        const planettheta = (90 - planetDec) * (Math.PI / 180); // Declination to radians
        const planetphi = planetRa * (Math.PI / 180); // Right Ascension to radians
        const planetx = planetDistance * Math.sin(planettheta) * Math.cos(planetphi);
        const planety = planetDistance * Math.sin(planettheta) * Math.sin(planetphi); // Should use sin(theta)
        const planetz = planetDistance * Math.cos(planettheta); // Should use cos(theta)
        // console.log(star.SourceID.toString().slice(0,10))
        // if (star.SourceID.toString().slice(0,10) === "4472832130")
        // {
        //     console.log(star.SourceID).
        // }
        // console.log(radius, planetDistance )
        const x = starx - planetx
        const y = stary - planety
        const z = starz - planetz
        const distance = Math.sqrt(x*x + y*y + z*z)
        if(distance < 10){
            return null
        }
        // console.log(theta,phi,planettheta,planetphi)
        // console.log(x,y,z)
        if(star)
        return (
          <Star
            key={index}
            position={[20*x, 20*y, 20*z]}
            magnitude={star.Magnitude / 10}
            drawing={drawing}
          />
        );
      })}
    </mesh>
  )
}

export default Stars
