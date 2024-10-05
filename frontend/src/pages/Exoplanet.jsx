import React, { useEffect } from "react";
import { Canvas, useThree, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three';
import Stars from "../components/Exoplanet/Stars";
import { useRef } from "react";
extend({ OrbitControls });
const exoplanetData = {
  ra: 10, // Right Ascension in degrees
  dec: 40, // Declination in degrees
  distance: 21.1397, // Distance in parsecs
};

// Convert exoplanet RA/Dec/Distance to Cartesian coordinates
const convertToCartesian = ({ ra, dec, distance }) => {
  const theta = (90 - dec) * (Math.PI / 180); // Declination to radians
  const phi = ra * (Math.PI / 180); // Right Ascension to radians
  const x = distance * Math.sin(theta) * Math.cos(phi);
  const y = distance * Math.cos(theta);
  const z = distance * Math.sin(theta) * Math.sin(phi);
  return { x, y, z };
};
const CustomControls = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    // Initialize OrbitControls with a fixed camera position
    const controls = new OrbitControls(camera, gl.domElement);

    // Disable zooming and panning
    controls.enableZoom = false;
    controls.enablePan = false;

    // Allow rotation around a fixed position
    controls.enableDamping = true; 
    controls.dampingFactor = 0.1;  // Smooth rotation
    controls.rotateSpeed = 0.8;    // Control the rotation speed
    
    // Set the camera to look at a central target (e.g., 0, 0, 0)
    const target = new THREE.Vector3(0, 0, 0);
    camera.position.set(0, 10, 20); // Fixed camera position
    camera.lookAt(target);

    // Keep the camera looking at the target during rotation
    controls.addEventListener("change", () => {
      camera.lookAt(target);
    });

    // Clean up the controls on unmount
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
};

const TexturedPlane = () => {
  // Ground or environment texture
  const texture = new THREE.TextureLoader().load("/Venusian.png");

  return (
    <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const Scene = (originShift) => {
  const groupRef = useRef()
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(
        -originShift.x,
        -originShift.y,
        -originShift.z
      ); // Shift the origin
    }
  }, [originShift]);
  return (
    <>
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <TexturedPlane />
      </group>
      {/* <FloatingSpheres /> */}
      <Stars ra={10} dec={40}/>
    </>
  );
};

export default function Exoplanet() {
  const exoplanetPosition = convertToCartesian(exoplanetData);

  return (
    <div className="w-full h-screen" style={{ backgroundColor: "black" }}>
      <Canvas>
        <Scene originShift={exoplanetPosition} />
        <CustomControls />
      </Canvas>
    </div>
  );
}
