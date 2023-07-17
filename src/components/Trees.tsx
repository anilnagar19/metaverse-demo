import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber'
import React, { useEffect, useState } from 'react';

type treeType={
	position:{x:number,y:number,z:number};
	box:number
}

type props = {
	boundary:number,
	count:number
}


const Trees:React.FC<props> = ({boundary,count})=>{
	const modal = useLoader(GLTFLoader,'./models/tree.glb')
	const [trees,setTrees] = useState([])

	modal.scene.traverse((object:any)=>{
		if(object.isMesh){
			object.castShadow=true
		}
	})

	const newPosition = (box:number,boundary:number)=>{
		return (
			boundary/2 - 
			box/2 - 
			(boundary-box)*(Math.round(Math.random()*100)/100)
		)
	}

	const updatePosition = (treeArray:treeType[],boundary:number)=>{
		treeArray.forEach((tree,index)=>{
			tree.position.x = newPosition(tree.box,boundary)
			tree.position.z =newPosition(tree.box,boundary)
		});
		setTrees(treeArray)
	}

	useEffect(()=>{
		const tempTree:treeType[] = [];
		for(let i=0;i<count;i++){
			tempTree.push({
				position:{
				x:0,
				y:0,
				z:0	
			},
			box:1
		})
		}
		updatePosition(tempTree,boundary)
	},[boundary,count])

	return (
		<group rotation={[0,4,0]}>
			{trees.map((tree:any,index)=>{
				return(
					<object3D key={index}
					position={[tree.position.x,0,tree.position.z]}
					>
						<mesh scale={[tree.box,tree.box,tree.box]}>
							<boxGeometry/>
							<meshBasicMaterial color={'blue'} wireframe/>
						</mesh>
						<primitive object={modal.scene.clone()}/>
					</object3D>
				)
			})}
		</group>
	)
}
export default Trees