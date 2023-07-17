import { act, Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls,Stats, useAnimations, useGLTF, useTexture } from '@react-three/drei';
import Lights from '@/src/components/Lights';
import Ground from '@/src/components/Ground';
import Trees from '@/src/components/Trees';
import Player from '../components/Player';

export default function Home() {
	const testing = true;
	return (
		<div className='container'>
			<Canvas shadows>
				{testing ? <Stats/>:null}
				{testing ? <axesHelper args={[2]}/>:null}
				{testing ? <gridHelper args={[10,10]}/>:null}
				<OrbitControls/>
				<Lights/>
				<Ground/>
				<Player/>
				<Trees boundary={100} count={100}/>
			</Canvas>
		</div>
	)
}
