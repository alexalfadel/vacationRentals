import './ToolTip.css'
import { useState, useEffect } from 'react';


//main div, clear background
//second div, grey background with text
//have 4 tooltips in tile
//show tooltip depending on where hover is


function ToolTip({ name }) {
    const [ isVisible, setIsVisible ] = useState('visible');

    useEffect(() => {

    }, [isVisible])

    return (
        <div className={`tooltip ${isVisible}`} 
        // onMouseEnter={() => {
            // console.log('tooltip is hovered over and should be visible for ', {name})
            // setIsVisible('visible')}} onMouseLeave={() => {
            //     console.log('tooltip is hovered off and should be hidden for ', {name})
            //     setIsVisible('hidden')}}
                >
            <p>{name}</p>
        </div>
    )
}

export default ToolTip