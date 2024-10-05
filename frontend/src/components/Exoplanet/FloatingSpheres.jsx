/* eslint-disable react/no-unknown-property */
import React, { useRef, useEffect } from "react";
import { Canvas, useThree, extend, useLoader } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextureLoader } from "three";
import * as THREE from "three";

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
      </mesh>
    );
  }

  return <>{spheres}</>;
};


export default FloatingSpheres