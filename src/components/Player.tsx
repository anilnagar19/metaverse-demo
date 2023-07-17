
import { userInput } from '../hooks/userInput';
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

let walkDirection = new THREE.Vector3()
let cameraTarget = new THREE.Vector3()
let rotateAngle = new THREE.Vector3(0,1,0)
let rotateQuaternion  = new THREE.Quaternion()


const directionOffset = ({forward,backward,left,right}:{forward:any,backward:any,left:any,right:any})=>{
    var directionOffset = 0;

    if(forward){
        if(left){
            directionOffset = Math.PI /4
        }else if(right){
            directionOffset = -Math.PI /4
        }
    }else if(backward){
        if(left){
            directionOffset = Math.PI /4 + Math.PI/2
        }else if(right){
            directionOffset = -Math.PI /4 - Math.PI/2
        }else{
            directionOffset = Math.PI;
        } 
    }else if(left){
        directionOffset = Math.PI /2
    }else if(right){
        directionOffset = -Math.PI /2
    }

    return directionOffset
}

const Player = ()=>{
	const {forward,backward,left,right,jump,shift} = userInput()
	const modal = useGLTF('./models/player.glb');
	const {actions} = useAnimations(modal.animations,modal.scene)
	
	modal.scene.scale.set(.5,.5,.5)
	modal.scene.traverse((object:any)=>{
		if(object.isMesh){
			object.castShadow=true
		}
	})

	const currentAction = useRef('');
    const controlRef = useRef<typeof OrbitControls>();
    const camera = useThree((state)=>state.camera)

    const updateCameraTarget = (moveX:number,moveZ:number)=>{
        camera.position.x +=moveX;
        camera.position.z += moveZ

        cameraTarget.x = modal.scene.position.x;
        cameraTarget.y = modal.scene.position.y + 2
        cameraTarget.z = modal.scene.position.z
        if(controlRef.current) controlRef.current.target = cameraTarget
    }

	useEffect(()=>{
		let action = '';
		if(forward || backward || left || right){
			action='walking';
			if(shift){
				action = 'running'
			}
		}else if(jump){
			action = 'jump'
		}else{
			action = 'idle'
		}

		if(currentAction.current != action){
			const nextActionToPlay = actions[action];
			const current = actions[currentAction.current];
			current?.fadeOut(.2);
			nextActionToPlay?.reset().fadeIn(.2).play()
			currentAction.current = action
		}
	},[forward,backward,left,right,jump,shift])

    useFrame((state,delta)=>{
        if(currentAction.current =='walking' || currentAction.current =='running' ){
            let angleYCameraDirection = Math.atan2(
                camera.position.x - modal.scene.position.x,
                camera.position.z-modal.scene.position.z
            )
            let newDirectionOffset = directionOffset({forward,backward,left,right})
    
            rotateQuaternion.setFromAxisAngle(
                rotateAngle,
                angleYCameraDirection+newDirectionOffset);

                modal.scene.quaternion.rotateTowards(rotateQuaternion,.2)

            camera.getWorldDirection(walkDirection);
            walkDirection.y = 0;
            walkDirection.normalize();
            walkDirection.applyAxisAngle(rotateAngle,newDirectionOffset)

            const velocity = currentAction.current =='running' ? 10 : 5;

            const moveX = walkDirection.x * velocity*delta
            const moveZ = walkDirection.z * velocity*delta
            modal.scene.position.x +=moveX;
            modal.scene.position.z +=moveZ
            updateCameraTarget(moveX,moveZ)
        }

    })

	return (
        <>
            <OrbitControls ref={controlRef}/>
            <primitive object={modal.scene}/>
        </>
    )
}

export default Player;