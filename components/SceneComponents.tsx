import React from 'react';
import { ElementType, SchoolElement } from '../types';
import { Box, Cylinder, Plane, Text } from '@react-three/drei';
import { DoubleSide } from 'three';

interface ElementProps {
  data: SchoolElement;
  isSelected: boolean;
  onClick: (e: any) => void;
}

export const BuildingComponent: React.FC<ElementProps> = ({ data, isSelected, onClick }) => {
  return (
    <group position={data.position as any} rotation={data.rotation as any} scale={data.scale as any} onClick={onClick}>
       {/* Main Building Body */}
      <Box args={[1, 1, 1]} castShadow receiveShadow>
        <meshStandardMaterial color={isSelected ? "#ff5555" : data.color} />
      </Box>
      {/* Simple Windows Logic - visual texture approximation via geometry for style */}
      <Box args={[0.8, 0.8, 1.05]} position={[0,0,0]}>
         <meshStandardMaterial color="#444" />
      </Box>
      {/* Label above */}
      {isSelected && (
          <Text position={[0, 1.2, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
            {data.name}
          </Text>
      )}
    </group>
  );
};

export const RoadComponent: React.FC<ElementProps> = ({ data, isSelected, onClick }) => {
  return (
    <group position={data.position as any} rotation={data.rotation as any} scale={data.scale as any} onClick={onClick}>
      <Box args={[1, 0.05, 1]} receiveShadow>
        <meshStandardMaterial color={isSelected ? "#aaaaaa" : "#333"} />
      </Box>
      {/* Road Markings */}
      <Box args={[0.1, 0.06, 0.6]} position={[0, 0, 0]}>
         <meshStandardMaterial color="#fff" />
      </Box>
    </group>
  );
};

export const FieldComponent: React.FC<ElementProps> = ({ data, isSelected, onClick }) => {
  return (
    <group position={data.position as any} rotation={data.rotation as any} scale={data.scale as any} onClick={onClick}>
      <Box args={[1, 0.05, 1]} receiveShadow>
        <meshStandardMaterial color={isSelected ? "#66ff66" : data.color} />
      </Box>
      {/* Simple Goal lines */}
      <Box args={[0.9, 0.06, 0.9]} position={[0,0,0]}>
        <meshStandardMaterial color="white" wireframe />
      </Box>
       {isSelected && (
          <Text position={[0, 1, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
            {data.name}
          </Text>
      )}
    </group>
  );
};

export const TreeComponent: React.FC<ElementProps> = ({ data, isSelected, onClick }) => {
  return (
    <group position={data.position as any} rotation={data.rotation as any} scale={data.scale as any} onClick={onClick}>
      {/* Trunk */}
      <Cylinder args={[0.1, 0.15, 0.5, 8]} position={[0, 0.25, 0]} castShadow>
         <meshStandardMaterial color="#5D4037" />
      </Cylinder>
      {/* Leaves */}
      <Cylinder args={[0, 0.4, 0.8, 8]} position={[0, 0.8, 0]} castShadow>
         <meshStandardMaterial color={isSelected ? "#88ff88" : data.color} />
      </Cylinder>
    </group>
  );
};

export const GroundPlane: React.FC<{ textureImage: string | null }> = ({ textureImage }) => {
    // We handle the texture loading via a simple textured mesh or just color if no image
    // For a robust implementation with user uploaded base64, we rely on standard mesh materials
    
    // Note: In a real app, useTexture from @react-three/drei would handle the base64, 
    // but here we can just use a meshBasicMaterial with map created from a texture loader if needed, 
    // or simply overlay the image on a plane.
    
    const textureRef = React.useRef<any>(null);

    React.useEffect(() => {
        if(textureImage && textureRef.current) {
            const loader = new (window as any).THREE.TextureLoader();
            loader.load(textureImage, (tex: any) => {
                textureRef.current.map = tex;
                textureRef.current.needsUpdate = true;
            });
        }
    }, [textureImage]);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            {textureImage ? (
                <meshBasicMaterial ref={textureRef} toneMapped={false} side={DoubleSide} />
            ) : (
                <meshStandardMaterial color="#1f2937" /> // Dark ground default
            )}
            <gridHelper args={[200, 50]} position={[0, 0.01, 0]} rotation={[Math.PI/2, 0, 0]} />
        </mesh>
    );
};
