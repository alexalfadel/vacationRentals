import React from 'react';
import './AllSpots.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { loadAllSpotsThunk } from '../../store/spots';
import { Link } from 'react-router-dom'

function AllSpots () {
    const dispatch = useDispatch();
    const allSpots = useSelector((state) => Object.values(state.spots))

    useEffect(() => {
        dispatch(loadAllSpotsThunk())
    }, [dispatch])

    const loadEachSpotTile = allSpots?.map(({ id, city, state, price, avgRating, previewImage, description}) => {
        return (
            <Link id={`spot${id}`} to={`/spots/${id}`}>
                <div className='spots-square' id={id}>
                    <img src={previewImage} alt={description}></img>
                    <div>
                        <p>{city},{state}</p>
                        <p><span><i className="fa-solid fa-star"></i></span>{avgRating}</p>
                    </div>
                    <p>${price} night</p>
                </div>
            </Link>
            
        )
    })

    if (!allSpots.length) return <h2>Loading..</h2>

    return (
        <>
            {loadEachSpotTile}
        </>
    )
}

export default AllSpots