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