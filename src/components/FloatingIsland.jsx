import * as THREE from 'three'
import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Clone, Float as FloatImpl } from '@react-three/drei'

function Cylinder3d(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
        <mesh
          {...props}
          ref={ref}
          scale={clicked ? 1.5 : 1}
          onClick={(event) => click(!clicked)}
          onPointerOver={(event) => hover(true)}
          onPointerOut={(event) => hover(false)}
        >
          <cylinderGeometry args={[1, 1, .1]} />
          <meshStandardMaterial
            wireframe={props.wireframe}
            color={hovered ? "blue" : "red"}
          />
        </mesh>
  );
}

const Float = ({ object, intensity = 300, rotation = 1, ...props }) => (
  <FloatImpl floatIntensity={intensity} rotationIntensity={rotation} speed={2}>
    <Clone object={object} {...props} />
  </FloatImpl>
)

export default Cylinder3d;