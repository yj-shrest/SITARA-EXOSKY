import React, { useRef, useEffect } from "react";
import { Canvas, useThree, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import *  as THREE from "three"

extend({ OrbitControls });

const CustomControls = () => {
  const { camera, gl } = useThree();
  const target = new THREE.Vector3(0, 0, 0); // Set target point to look at
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    // Set custom options
    controls.enabled = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minDistance = 1;
    controls.maxDistance = Infinity;
    controls.enableKeyboardNavigation = true;
    controls.keyboardDollySpeed = 2;
    controls.keyboardPanSpeed = 10;
    controls.keyboardSpeedFactor = 3;
    controls.firstPersonRotationFactor = 0.4;
    controls.pinchPanSpeed = 1;
    controls.pinchEpsilon = 2;
    controls.pointerRotationSpeedPolar = Math.PI / 360;
    controls.pointerRotationSpeedAzimuth = Math.PI / 360;
    controls.keyboardRotationSpeedAzimuth = (10 * Math.PI) / 360;
    controls.keyboardRotationSpeedPolar = (10 * Math.PI) / 360;
    controls.minZoom = 0;
    controls.maxZoom = Infinity;

    // Add event listener for camera movement
    controls.addEventListener("change", () => {
      camera.position.set(
        controls.object.position.x,
        controls.object.position.y,
        controls.object.position.z
      );
      camera.lookAt(target);
    });

    // Clean up on component unmount
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
};

const FloatingSpheres = () => {
  const spheres = [];

  for (let i = 0; i < 10; i++) {
    const position = [
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50 + 1, // Adjusted to ensure spheres are above the plane
      (Math.random() - 0.5) * 50,
    ];
    spheres.push(
      <mesh position={position} key={i}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="white" />
        <></>
      </mesh>
    );
  }

  return <>{spheres}</>;
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Adjust the plane's position */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500, 50, 50]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      <FloatingSpheres />
    </>
  );
};

export default function Exoplanet() {
  return (
    <div className="w-full h-screen" style={{ backgroundColor: "black" }}>
      <Canvas camera={{ position: [0, 0, 1], fov: 60 }}>
        <Scene />
        <CustomControls />
      </Canvas>
    </div>
  );
}
