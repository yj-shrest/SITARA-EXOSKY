import React, { useRef, useEffect } from 'react';
import { useGlobalContext } from '../components/Context';
const SkyMap2D = () => {
  const canvasRef = useRef(null);
  const {starData} = useGlobalContext()
  // Helper function to convert RA/Dec to 2D coordinates
  const projectTo2D = (ra, dec, radius) => {
    // Convert RA and Dec to radians
    const raRad = (ra * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;

    // Simple orthographic projection
    const x = radius * Math.cos(decRad) * Math.cos(raRad);
    const y = radius * Math.cos(decRad) * Math.sin(raRad);

    return { x, y };
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
    const scale = 40; // Adjust as needed
    console.log(starData)
    // Draw stars
    starData.forEach((star) => {
      const { ra, dec, magnitude } = star;
      const { x, y } = projectTo2D(ra, dec, scale);

      // Adjust star size based on magnitude
      const size = Math.max(1, 5 - magnitude);

      ctx.beginPath();
      ctx.arc(x, -y, size, 0, 2 * Math.PI); // Invert y-axis for correct orientation
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

  return <canvas ref={canvasRef} width={800} height={800} />;
}

export default SkyMap2D;
