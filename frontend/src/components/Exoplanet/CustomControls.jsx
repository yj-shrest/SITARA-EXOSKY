import React, { useRef, useEffect } from "react";
import { Canvas, useThree, extend, useLoader } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextureLoader } from "three";
import * as THREE from "three";

const CustomControls = ({disable}) => {
  const { camera, gl } = useThree();
  const target = new THREE.Vector3(0, 0, 0); // Set target point to look at

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    console.log(disable)
    // Set custom options
    controls.enabled = !disable;
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    controls.enableZoom = true;
    controls.enablePan = true;
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
      camera.lookAt(target); // Look at the target point
    });

    // Clean up on component unmount
    return () => {
      controls.dispose();
    };
  }, [camera, gl, disable]);

  return null;
};

export default CustomControls;
