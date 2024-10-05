import React, { useRef, useEffect } from 'react';
import { useGlobalContext } from '../components/Context';
const SkyMap2D = ({planetRa,planetDec,planetDistance}) => {
  const canvasRef = useRef(null);
  const {starData} = useGlobalContext()
  // Helper function to convert RA/Dec to 2D coordinates
  const projectTo2D = (ra, dec, radius) => {
    // console.log(ra,dec)
    // Convert RA and Dec to radians
    const theta = (90 - dec) * (Math.PI / 180); // Declination to radians
    const phi = ra * (Math.PI / 180); // Right Ascension to radians
    // console.log(theta, phi);
    // console.log(planetRa,planetDec,planetDistance)
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
    const x = (starx - planetx)* 100
    const y = (stary - planety)*100
    const z = (starz - planetz)*100
    console.log(theta,phi,radius,planettheta,planetphi,planetDistance)
    // console.log(starz,planetz,z)
    return { x, z };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Set origin to center
    ctx.translate(width / 2, height / 2);

    // Determine scaling factor based on planet distance
    // const scale = 40; // Adjust as needed
    // console.log(starData)
    // Draw stars
    starData.forEach((star) => {
      const { RightAscension, Declination, Magnitude, Distance } = star;
      const { x, z } = projectTo2D(RightAscension, Declination, Distance);

      // Adjust star size based on magnitude
      const size = Magnitude
      // console.log(x,y,size)
      ctx.beginPath();
      ctx.arc(x, -z, size, 0, 2 * Math.PI); // Invert y-axis for correct orientation
      ctx.fillStyle = 'white';
      ctx.fill();
    });

    // Draw constellations
    // constellations.forEach((constellation) => {
    //   ctx.beginPath();
    //   constellation.stars.forEach((starId, index) => {
    //     const star = stars.find((s) => s.SourceID === starId);
    //     if (star) {
    //       const { x, y } = projectTo2D(star.ra, star.dec, scale);
    //       if (index === 0) {
    //         ctx.moveTo(x, -y);
    //       } else {
    //         ctx.lineTo(x, -y);
    //       }
    //     }
    //   });
    //   ctx.strokeStyle = 'yellow';
    //   ctx.lineWidth = 1;
    //   ctx.stroke();
    // });

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [starData]);

  return (
    <div>
      <h1>Sky Map 2D</h1>
  <canvas ref={canvasRef} width={10000} height={10000} className='bg-black w-full h-full' />
    </div>
  );
}

export default SkyMap2D;
