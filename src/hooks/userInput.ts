import { useEffect, useState } from "react";

export const userInput = ()=>{
    const [input,setInput] = useState({
        forward:false,
        backward:false,
        left:false,
        right:false,
        shift:false,
        jump:false
    })

    const keys:any = {
        KeyW:'forward',
        KeyS:'backward',
        KeyA:'left',
        KeyD:'right',
        ShiftLeft:'shift',
        Space:'jump'
    }

    const findKey = (key:string)=> keys[key];

    useEffect(()=>{
        const handleKeyDown=(e:any)=>{
            setInput((m)=>({...m,[findKey(e.code)]:true}))
        }

        const handleKeyUP=(e:any)=>{
            setInput((m)=>({...m,[findKey(e.code)]:false}))
        }
        
        document.addEventListener('keydown',handleKeyDown);
        document.addEventListener('keyup',handleKeyUP);

    })

    return input;
}