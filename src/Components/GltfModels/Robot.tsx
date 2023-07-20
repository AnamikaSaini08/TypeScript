/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.8 scene.gltf -t
Author: Yandrack (https://sketchfab.com/Yandrack)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/cute-home-robot-7b75f204eb3e42b6babd883773e0789d
Title: Cute Home Robot
*/

import * as THREE from "three";
import React, { Ref, useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import  { resetBlocklyInstruction } from "../../utils/Slice/blocklyInstructionSlice";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useFrame } from "react-three-fiber";
import { useDispatch } from "react-redux";
import { checkIsGameWin } from "../../utils/Functions/GameEndFun";

type GLTFResult = GLTF & {
  nodes: {
    Cylinder001_M_Suelo_0: THREE.Mesh;
    Object_7: THREE.SkinnedMesh;
    Object_8: THREE.SkinnedMesh;
    Object_9: THREE.SkinnedMesh;
    Object_10: THREE.SkinnedMesh;
    _rootJoint: THREE.Bone;
  };
  materials: {
    M_Suelo: THREE.MeshStandardMaterial;
    M_Metal1: THREE.MeshStandardMaterial;
    M_Pantalla1: THREE.MeshStandardMaterial;
    M_Pantalla2: THREE.MeshStandardMaterial;
    M_Rueda: THREE.MeshStandardMaterial;
  };
};

type ActionName = "Take 001";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function Robot({
  startPos,
  endPos,
  face,
  obstaclePosition,
  boxOffset,
  filterBatteryPosition,
  batteryPosition,
  setFilterBatteryPosition,
  setDeleteCoorBattery,
  isReset,
  setIsReset,
  isNextLevel,
  setIsNextLevel
}: {
  startPos: [number,  number, number];
  endPos: [x: number, y: number, z: number];
  face: "TOP" | "BOTTOM" | "LEFT" | "RIGHT";
  obstaclePosition:[number,number][];
  boxOffset: number;
  filterBatteryPosition: [number , number][];
  batteryPosition: [number,number][];
  setFilterBatteryPosition : any;
  setDeleteCoorBattery: any;
  isReset:boolean;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  isNextLevel:boolean;
  setIsNextLevel: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  let blocklyInstruction = useSelector(
    (store: any) => store.blocklyInstruction.blockInstructionArray
  );
  let stepDistance = useSelector((store: any) => store.gameLevel.robotSpeed);
  const [rotation, setRotation] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState({
    x: startPos[0],
    y: startPos[1],
    z: startPos[2],
  });
  const [robotFace, setRobotFace] = useState(face);
  const group = useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF(
    "./Assets/robot/scene.gltf"
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const robot: any = group.current;
  const dispatch = useDispatch();


  useEffect(() => {
    actions["Take 001"]?.play();
  }, []);
  useEffect(()=>{
    if(isReset)
    {
      setCurrentIndex(0);
      setPosition({ x: startPos[0],
        y: startPos[1], 
        z: startPos[2],});
      (robotFace==="LEFT") && setRotation(3 * (Math.PI / 2));
      (robotFace==="RIGHT") && setRotation(1 * (Math.PI / 2));
      (robotFace==="BOTTOM") && setRotation(2 * (Math.PI / 2));
      
      robot.position.x = startPos[0];
      robot.position.z = startPos[2];
      robot.position.y = startPos[1];
      dispatch(resetBlocklyInstruction([]));
      setIsReset(false);
    }
  },[isReset])

  const checkBatteryPosition = (
    filterBatteryPosition:[number,number][],
    setFilterBatteryPosition:any,
    setDeleteCoorBattery:any,
    isBatteryX:number,
    isBatteryZ:number
  ) => {
    const tempfilterBatteryPosition = filterBatteryPosition.filter(([x, y]) => {
      const isDeleted =( boxOffset-x  === isBatteryX && (-boxOffset+y) === isBatteryZ);
      if (isDeleted) {
        setDeleteCoorBattery([isBatteryX, isBatteryZ]);
      }
      return !isDeleted;
    });
    setFilterBatteryPosition(tempfilterBatteryPosition);
  };

  useFrame(() => {
    let direction;
    if (currentIndex < blocklyInstruction.length) {
      if(checkIsGameWin(filterBatteryPosition))
      {
        //setIsNextLevel(true);
        console.log("Win ");
      
      }
      direction = blocklyInstruction[currentIndex];
      switch (robotFace) {
        case "TOP":
          if (direction === "BACKWARD") {
            if (
              (robot.position.z <= -(boxOffset-1)) ||
              obstaclePosition.some(([x, y]) => {
                return (
                  boxOffset - x === position.x &&
                  -boxOffset + y === position.z -1 
                );
              })
            ) {
              alert("Game End");
              return;
            }
            checkBatteryPosition(
              filterBatteryPosition,
              setFilterBatteryPosition,
              setDeleteCoorBattery,
              position.x,
              position.z-1
            );
            robot.position.z -= stepDistance;
            if (robot.position.z < position.z - 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
              setPosition({ ...position, z: position.z - 1 });
            }
          } else if (direction === "FORWARD") {
            if (
              (robot.position.z >= (boxOffset-1) ||
              obstaclePosition.some(([x, y]) => {
                return (
                  boxOffset - x === position.x &&
                  -boxOffset + y === position.z + 1
                );
              }))
            ) {
              alert("Game End");
              return;
            }
            checkBatteryPosition(
              filterBatteryPosition,
              setFilterBatteryPosition,
              setDeleteCoorBattery,
              position.x,
              position.z+1
            );
            robot.position.z += stepDistance;
            if (robot.position.z > position.z + 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
              setPosition({ ...position, z: position.z + 1 });
            }
          } else if (direction === "LEFT") {
            robot.rotation.y += stepDistance;
            if (robot.rotation.y > rotation + Math.PI / 2) {
              setRobotFace("LEFT");
              setRotation((prevRotation) => prevRotation + Math.PI / 2);
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }
          } else if (direction === "RIGHT") {
            robot.rotation.y -= stepDistance;
            if (robot.rotation.y < rotation - Math.PI / 2) {
              setRobotFace("RIGHT");
              setRotation((prevRotation) => prevRotation - Math.PI / 2);
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }
          }
          break;
        case "BOTTOM":
          if (direction === "BACKWARD") {
            if (
              (robot.position.z >= (boxOffset-1) ||
              obstaclePosition.some(([x, y]) => {
                return (
                  boxOffset - x === position.x  &&
                  -boxOffset + y === position.z + 1
                );
              }))
            ) {
              alert("Game End");
              return;
            }
            checkBatteryPosition(
              filterBatteryPosition,
              setFilterBatteryPosition,
              setDeleteCoorBattery,
              position.x,
              position.z+1
            );
            robot.position.z += stepDistance;
            if (robot.position.z > position.z + 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
              setPosition({ ...position, z: position.z + 1 });
            }
          } else if (direction === "FORWARD") {
            if (
              (robot.position.z <= -(boxOffset-1) ||
              obstaclePosition.some(([x, y]) => {
                return (
                  boxOffset - x === position.x  &&
                  -boxOffset + y === position.z -1 
                );
              }))
            ) {
              alert("Game End");
              return;
            }
            checkBatteryPosition(
              filterBatteryPosition,
              setFilterBatteryPosition,
              setDeleteCoorBattery,
              position.x,
              position.z-1
            );
            robot.position.z -= stepDistance;
            if (robot.position.z < position.z - 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
              setPosition({ ...position, z: position.z - 1 });
            }
          } else if (direction === "LEFT") {
            robot.rotation.y += stepDistance;
            if (robot.rotation.y > rotation + Math.PI / 2) {
              setRobotFace("RIGHT");
              setRotation((prevRotation) => prevRotation + Math.PI / 2);
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }
          } else if (direction === "RIGHT") {
            robot.rotation.y -= stepDistance;
            if (robot.rotation.y < rotation - Math.PI / 2) {
              setRobotFace("LEFT");
              setRotation((prevRotation) => prevRotation - Math.PI / 2);
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }
          }
          break;
        case "LEFT":
          if (direction === "BACKWARD") {
            if (
              (robot.position.x <= -(boxOffset-1)) ||
              obstaclePosition.some(([x, y]) => {
                return (
                  boxOffset - x === position.x - 1 &&
                  -boxOffset + y === position.z
                );
              })
            ) {
              alert("Game End");
              return;
            }
            checkBatteryPosition(
              filterBatteryPosition,
              setFilterBatteryPosition,
              setDeleteCoorBattery,
              position.x-1,
              position.z
            );
            robot.position.x -= stepDistance;
            if (robot.position.x < position.x - 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
              setPosition({ ...position, x: position.x - 1 });
            }
          } else if (direction === "FORWARD") {
            if (
              (robot.position.x >= boxOffset-1) ||
              obstaclePosition.some(([x, y]) => {
                return (
                  boxOffset - x === position.x + 1 &&
                  -boxOffset + y === position.z
                );
              })
            ) {
              alert("Game End");
              return;
            }
            checkBatteryPosition(
              filterBatteryPosition,
              setFilterBatteryPosition,
              setDeleteCoorBattery,
              position.x+1,
              position.z
            );
            robot.position.x += stepDistance;
            if (robot.position.x > position.x + 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
              setPosition({ ...position, x: position.x + 1 });
            }
          } else if (direction === "LEFT") {
            robot.rotation.y += stepDistance;
            if (robot.rotation.y > rotation + Math.PI / 2) {
              setRobotFace("BOTTOM");
              setRotation((prevRotation) => prevRotation + Math.PI / 2);
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }
          } else if (direction === "RIGHT") {
            robot.rotation.y -= stepDistance;
            if (robot.rotation.y < rotation - Math.PI / 2) {
              setRobotFace("TOP");
              setRotation((prevRotation) => prevRotation - Math.PI / 2);
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }
          }
          break;
        case "RIGHT":
          if (direction === "FORWARD") {
            if (
              (robot.position.x <= -(boxOffset-1)) ||
              obstaclePosition.some(([x, y]) => {
                return (
                  boxOffset - x === position.x - 1 &&
                  -boxOffset + y === position.z
                );
              })
            ) {
              alert("Game End");
              return;
            }
            checkBatteryPosition(
              filterBatteryPosition,
              setFilterBatteryPosition,
              setDeleteCoorBattery,
              position.x-1,
              position.z
            );
            robot.position.x -= stepDistance;
            if (robot.position.x < position.x - 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
              setPosition({ ...position, x: position.x - 1 });
            }
          } else if (direction === "BACKWARD") {
            if (
              (robot.position.x >= (boxOffset-1)) ||
              obstaclePosition.some(([x, y]) => {
                return (
                  boxOffset - x === position.x + 1 &&
                  -boxOffset + y === position.z
                );
              })
            ) {
              alert("Game End");
              return;
            }
            checkBatteryPosition(
              filterBatteryPosition,
              setFilterBatteryPosition,
              setDeleteCoorBattery,
              position.x+1,
              position.z
            );
            robot.position.x += stepDistance;
            if (robot.position.x > position.x + 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
              setPosition({ ...position, x: position.x + 1 });
            }
          } else if (direction === "LEFT") {
            robot.rotation.y += stepDistance;
            if (robot.rotation.y > rotation + Math.PI / 2) {
              setRobotFace("TOP");
              setRotation((prevRotation) => prevRotation + Math.PI / 2);
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }
          } else if (direction === "RIGHT") {
            robot.rotation.y -= stepDistance;
            if (robot.rotation.y < rotation - Math.PI / 2) {
              setRobotFace("BOTTOM");
              setRotation((prevRotation) => prevRotation - Math.PI / 2);
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }
          }
          break;
      }
    }
  });

  return (
    <group
      ref={group as Ref<THREE.Group>}
      dispose={null}
      position={startPos}
      rotation={[0, rotation, 0]}
    >
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.02}
        >
          <group
            name="edca9fd234644d5480a540acc91ca584fbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="Object_4">
                  <primitive object={nodes._rootJoint} />
                  <group
                    name="Object_6"
                    position={[0, 10, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  />
                  <group
                    name="Robo"
                    position={[0, 10, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  />
                  <group
                    name="Cylinder001"
                    position={[-0.121, 0, -0.603]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <mesh
                      name="Cylinder001_M_Suelo_0"
                      geometry={nodes.Cylinder001_M_Suelo_0.geometry}
                      material={materials.M_Suelo}
                    />
                  </group>
                  <skinnedMesh
                    name="Object_7"
                    geometry={nodes.Object_7.geometry}
                    material={materials.M_Metal1}
                    skeleton={nodes.Object_7.skeleton}
                  />
                  <skinnedMesh
                    name="Object_8"
                    geometry={nodes.Object_8.geometry}
                    material={materials.M_Pantalla1}
                    skeleton={nodes.Object_8.skeleton}
                  />
                  <skinnedMesh
                    name="Object_9"
                    geometry={nodes.Object_9.geometry}
                    material={materials.M_Pantalla2}
                    skeleton={nodes.Object_9.skeleton}
                  />
                  <skinnedMesh
                    name="Object_10"
                    geometry={nodes.Object_10.geometry}
                    material={materials.M_Rueda}
                    skeleton={nodes.Object_10.skeleton}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./Assets/robot/scene.gltf");
