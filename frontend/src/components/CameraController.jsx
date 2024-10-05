/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const CameraController = ({ selectedPlanet}) => {
  const controlsRef = useRef()
  const { camera, scene } = useThree()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetPosition, setTargetPosition] = useState(null)
  const [targetLookAt, setTargetLookAt] = useState(null)
  const previousCameraPosition = useRef(new THREE.Vector3())

  useEffect(() => {
    if (selectedPlanet && controlsRef.current) {
      const planetMesh = scene.getObjectByName(selectedPlanet.pl_name)
      if (planetMesh) {
        const planetPosition = new THREE.Vector3()
        planetMesh.getWorldPosition(planetPosition)
        setTargetLookAt(planetPosition)

        // Define an offset for the camera position relative to the planet
        const planetRadius = selectedPlanet.pl_rade || 1; // Default to 1 if radius is not available
        const offset = new THREE.Vector3(planetRadius, 0, planetRadius); // Position camera 5 times the planet's radius away
        const newCameraPosition = planetPosition.clone().add(offset)
        setTargetPosition(newCameraPosition)

        setIsTransitioning(true) // Start the transition
      }
    }
  }, [selectedPlanet, camera, scene])

  useFrame(() => {
    if (isTransitioning && targetPosition) {
      // Save the previous camera position
      previousCameraPosition.current.copy(camera.position)

      // Smoothly interpolate the camera's position towards the target position
      camera.position.lerp(targetPosition, 0.05)

      // Smoothly interpolate the controls' target towards the planet's position
      controlsRef.current.target.lerp(targetLookAt, 0.05)
      controlsRef.current.update()

      // Check if the camera's movement is small enough to stop the transition
      const movementSpeed = camera.position.distanceTo(previousCameraPosition.current)
      if (movementSpeed < 0.001) {  // If the camera is moving very slowly, stop the transition
        setIsTransitioning(false)
        setTargetPosition(null)
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableRotate={!isTransitioning} // Disable rotate during transition
      enableZoom={!isTransitioning} // Disable zoom during transition
      panSpeed={5}

      rotateSpeed={0.5}
      zoomSpeed={4}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      }}
    />
  )
}

export default CameraController
