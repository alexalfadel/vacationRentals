import React from 'react';
import './AllSpots.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import { loadAllSpotsThunk } from '../../store/spots';
import { Link } from 'react-router-dom'



const formatRating = (num) => {
    const nums = [1, 2, 3, 4, 5];
    if (num) {
        if (nums.includes(num)) return `${num}.0`
        if (num.toString().length > 3) {
        return Number(num).toFixed(2)
        }
    }
    
    else return num;
}

const formatPrice = (price) => {
    console.log(typeof price)
    let priceString = price.toString();
    console.log(priceString)
    if (!priceString.includes('.')) priceString += '.00'
    return priceString
}


function AllSpots () {
    const dispatch = useDispatch();
    const allSpots = useSelector((state) => Object.values(state.spots))
    const [ visible, setVisible ] = useState(false)
    // const [ hidden, setHidden ] = useState(false)

    useEffect(() => {
        dispatch(loadAllSpotsThunk())
    }, [dispatch])

    const loadEachSpotTile = allSpots?.map(({ id, name, city, state, price, avgRating, previewImage, description}) => {
        
        return (
            <Link className='spot-tile-link' id={`spot${id}`} to={`/spots/${id}`}>
                <div className='spots-square' id={id} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
                    <img className='spot-image' src={previewImage} alt={description}></img>
                    <p  className={ visible ? 'visible' : 'hidden'} >{name}</p>
                    <div className='spot-location-reviews'>
                        <p>{city},{state}</p>
                        <p><span><i className="fa-solid fa-star"></i></span>{formatRating(avgRating)}</p>
                    </div>
                    <p className='spot-price'><span className='price'>${formatPrice(price)}</span> night</p>
                </div>
            </Link>
            
        )
    })

    if (!allSpots.length) return <h2>Loading..</h2>

    return (
        <div className='tile-box'>
            {loadEachSpotTile}
        </div>
    )
}

export default AllSpots