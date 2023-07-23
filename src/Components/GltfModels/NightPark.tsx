/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.5 scene.gltf -t
Author: Paul (https://sketchfab.com/paul_paul_paul)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/free-skybox-enchanted-forest-8c99faed86fd47a6ac4eb24176d3e774
Title: FREE - SkyBox Enchanted Forest
*/

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Sphere_Material_0: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

export function NightPark(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('./Assets/nightPark/scene.gltf') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group scale={0.09}>
        <mesh geometry={nodes.Sphere_Material_0.geometry} material={materials.Material} rotation={[-Math.PI / 2, 0, 0]} scale={5500000} />
      </group>
    </group>
  )
}

useGLTF.preload('./Assets/nightPark/scene.gltf')
