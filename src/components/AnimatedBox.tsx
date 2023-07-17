import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useHelper } from '@react-three/drei';
import { BoxHelper } from 'three';

type Props = {
	isTesting:boolean
}

const AnimatedBox:React.FC<Props> = ({isTesting})=>{
	const meshRef:any =  useRef<THREE.Mesh>(null);
	{isTesting ? useHelper(meshRef,BoxHelper,'blue'):null}

	useFrame(() => {
		if(meshRef.current){
			meshRef.current.rotation.x += .01;
            meshRef.current.rotation.y += .01;
		}
	  })
	  return (
		<mesh ref={meshRef} scale={[.5,.5,.5]}>
			<boxGeometry/>
			<meshStandardMaterial />
		</mesh>
	  )
}

export default AnimatedBox