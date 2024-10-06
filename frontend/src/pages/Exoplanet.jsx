import React, { useEffect, useState, useRef } from "react";
import { Canvas, useThree, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three';
import {useParams} from "react-router-dom"
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useFrame } from "@react-three/fiber";
import { AxesHelper } from "three";
// import { LineCurve3 } from "three";
import { Line } from "@react-three/drei";
import { useImperativeHandle, forwardRef } from "react";
import { useGlobalContext } from "../components/Context";
import Stars from "../components/Exoplanet/Stars";
import planetData from "../planets.json"
import CustomControls from "../components/Exoplanet/CustomControls"

extend({ OrbitControls });


// Convert exoplanet RA/Dec/Distance to Cartesian coordinates
const convertToCartesian = ({ ra, dec, distance }) => {
  const theta = (90 - dec) * (Math.PI / 180); // Declination to radians
  const phi = ra * (Math.PI / 180); // Right Ascension to radians
  const x = distance * Math.sin(theta) * Math.cos(phi);
  const y = distance * Math.sin(theta) * Math.sin(phi);
  const z = distance * Math.cos(theta);
  return { x, y, z };
};

const TexturedPlane = () => {
  const texture = new THREE.TextureLoader().load(`/planets/${Math.floor(Math.random()*13)+1}.jpg`);
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
    // Calculate opacity based on pitch (up and down)
    // Invert the logic: when looking down, opacity should decrease
    // const opacity = Math.max(0, Math.min(1, (pitchDegrees - 90) / -90));// Adjust this logic
    const opacity = pitchDegrees<0?(90+pitchDegrees)/90:1;// Adjust this logic

    // Log the pitch and opacity values

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

const ConstellationLines = ({ points }) => {
  return (
    <Line
      points={points} // Array of [x, y, z] positions
      color="yellow"
      lineWidth={2}
      dashed={false}
    />
  );
};



const Scene = forwardRef((props, ref) => {
  const { drawing } = props;
  const { constellationName } = props;
  // console.log("drawing from scene", drawing)
  const { gl, scene, camera } = useThree(); // Access the WebGL context, scene, and camera
  let {planetName} = useParams()
  planetName = planetName.split("_").join(" ")
  const {selectedPoints} = useGlobalContext()
  // const groupRef = useRef()
  const singlePlanetData = planetData.find(planet => planet.pl_name === planetName)
  const {ra,dec,sy_dist} = singlePlanetData
  // Use useImperativeHandle to expose the `captureScreenshot` function to the parent
  useImperativeHandle(ref, () => ({
    captureScreenshot() {
      // Render the current scene into the WebGL canvas
      gl.render(scene, camera);

      // Convert the canvas to a data URL and download it
      const screenshot = gl.domElement.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = screenshot;
      link.download = `${constellationName}.jpg`;
      link.click();
    },
  }));

  return (
    <>
      {/* Your scene content here */}
      <group>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TexturedPlane />
      </group>
      <Stars ra={ra} dec={dec} sy_dist={sy_dist} drawing={drawing} />
      {selectedPoints.length > 0 && <ConstellationLines points={selectedPoints} />}
    </>
  );
});


export default function Exoplanet() {
  const [drawing, setDrawing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [constellationName, setConstellationName] = useState("constellation")
  const sceneRef = useRef();
  const onhandleClick = () => {
    setDrawing(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);
  const handleSaveImage = () => {
    // Call the captureScreenshot function from Scene via the ref
    if (sceneRef.current) {
      sceneRef.current.captureScreenshot();
    }
  };
  const handleConstellationName = (e) => {
    setConstellationName(e.target.value)
  }
  return (
    <div className="w-full h-screen" style={{ backgroundColor: "black" }}>
      <Canvas>
        <Scene ref={sceneRef} drawing={drawing} constellationName={constellationName}/>
        <CustomControls disable={drawing} />
      </Canvas>

      {loading && (
        <div className="w-full h-full top-0 left-0 absolute object-contain flex items-center justify-center bg-[#0a1314]">
          <img src="/loading.gif" alt="" className="h-full w-auto" />
        </div>
      )}

      <div className="absolute top-[2rem] right-[2rem] flex gap-[1rem]">
        {!drawing && (
          <button
            className="bg-blue-600 px-4 py-2 text-white rounded"
            onClick={onhandleClick}
          >
            Draw Constellation
          </button>
        )}
        {
          drawing && (
            <input
            className="bg-white px-4 py-2 text-black rounded"
            placeholder="Enter Constellation Name"
            onChange={handleConstellationName}
            />
            
          )
        }
        <button
        className="bg-blue-600 px-4 py-2 text-white rounded"
        onClick={handleSaveImage} // Trigger screenshot on button click
        >
            Save Image
        </button>
      </div>
      <button className="absolute top-[2rem] px-4 py-2 text-white left-[2rem] flex align-start rounded">
        <Link to="/">
          <IoArrowBackCircleOutline size={30} />
        </Link>
      </button>
    </div>
  );
}
