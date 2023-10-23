import React from 'react';
import './AllSpots.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import { loadAllSpotsThunk } from '../../store/spots';
import { Link } from 'react-router-dom'
import SpotTile from '../SpotTile';



function AllSpots () {
    const dispatch = useDispatch();
    const allSpots = useSelector((state) => Object.values(state.spots))
    const [ visible, setVisible ] = useState(false)

    useEffect(() => {
        dispatch(loadAllSpotsThunk())
    }, [dispatch])

    // let loadEachSpotTile;

    // useEffect(() => {
    //     console.log('use effect rendering')
    //     loadEachSpotTile = allSpots?.map(({ id, name, city, state, price, avgRating, previewImage, description}) => {
        
    //         return (
    //             // <div className='full-spot-box'>
    //                 <Link className='spot-tile-link' id={`spot${id}`} to={`/spots/${id}`}>
    //                     <div className='spots-square' id={id} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
    //                         <img className='spot-image' src={previewImage} alt={description}></img>
    //                         {/* <div><ToolTip name={name}/></div> */}
    //                         <div className='spot-location-reviews'>
    //                             <p>{city},{state}</p>
    //                             <p><span><i className="fa-solid fa-star"></i></span>{formatRating(avgRating)}</p>
    //                         </div>
    //                         <p className='spot-price'><span className='price'>${formatPrice(price)}</span> night</p>
    //                         <span id="tooltip" className={visible ? 'visible' : 'hidden'} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}><p>{name}</p></span>
    //                     </div>
                        
    //                 </Link>
                    
                
    //         )
    //     })
    // }, [visible, allSpots])

    

    const loadEachSpotTile = allSpots?.map((spot) => {
        return (
            <div className='spot-tile-link'>
                <SpotTile spot={spot}/>
            </div>
            
        )
    })

    if (!allSpots.length) return <h2>Loading..</h2>

    // if (!loadEachSpotTile) return <h2>Loading..</h2>

    return (
        <div className='tile-box'>
            {loadEachSpotTile}
        </div>
    )
}

export default AllSpots