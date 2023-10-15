import React from 'react';
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react'
import { loadSpotThunk } from '../../store/spots';
import { restoreUser } from '../../store/session';
import Review from '../Review';

const capitalizeWords = (word) => {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

const capitalizeAbbrevs = (str) => {
    return str.toUpperCase();
}

const formatRating = (num) => {
    const nums = [1, 2, 3, 4, 5];
    if (nums.includes(num)) return `${num}.0`
    else return num;
}

function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spotData = useSelector((state) => (state.spots));
    const userData = useSelector((state) => state.session)
    const spotDetails = spotData[spotId]

    const { user } = userData;

    useEffect(() => {
        dispatch(loadSpotThunk(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        dispatch(restoreUser())
    }, [dispatch])

    // console.log(user, '---user')

    if (!spotDetails || !spotDetails.Owner) return <h2>Loading...</h2>

    const loggedIn = user ? true : false;

    // console.log(spotData);

    const { name, city, state, country, description, price, avgStarRating, numReviews, Owner, Reviews, SpotImages, ownerId } = spotDetails;

    const { firstName, lastName } = Owner;
    
    const currentOwner = user.id === ownerId ? true : false

    const reviews = Reviews.map(review => {
        return <Review review={review}/>
    })
   
    let reviewInfo;

    const reviewInnerText = Reviews.length === 1 ? 'review' : 'reviews';

    if (!Reviews.length) {
        reviewInfo = <p><span><i className="fa-solid fa-star"></i></span> New</p>
    } else {
        reviewInfo = <p><span><i className="fa-solid fa-star"></i></span> {formatRating(avgStarRating)} 
            <span> <i className="fa-solid fa-circle"></i></span> {numReviews} {reviewInnerText}</p>
    }


    const reserveClick = () => {
        alert('Feature Coming Soon...')
    }

    return (
        <>
            <h2>{name}</h2>
            <p>{capitalizeWords(city)}, {capitalizeAbbrevs(state)}, {capitalizeAbbrevs(country)}</p>
            <div className='spot-images-holder'>
                {SpotImages[0] && <img id='large-image' src={SpotImages[0].url} alt={`Image of ${name}`}></img>}
                <div id='small-images'>
                    {SpotImages[1] && <img className='small-image' src={SpotImages[1].url} alt={`Image of ${name}`}></img>}
                    {SpotImages[2] && <img className='small-image' src={SpotImages[2].url} alt={`Image of ${name}`}></img>}
                    {SpotImages[3] && <img className='small-image' src={SpotImages[3].url} alt={`Image of ${name}`}></img>}
                    {SpotImages[4] && <img className='small-image' src={SpotImages[4].url} alt={`Image of ${name}`}></img>}
                </div>
            </div>
            <div className='spot-details-info'>
                <div className='spot-details-description'>
                    <p>Hosted by {firstName} {lastName}</p>
                    <p>{description}</p>
                </div>
                <div className='spot-details-reserve-box'>
                    <div>
                        <p>${price} night</p>
                        <p><span><i className="fa-solid fa-star"></i></span>{formatRating(avgStarRating)} <span><i className="fa-solid fa-circle"></i></span> {numReviews} {reviewInnerText} </p>
                    </div>
                    <button className='reserve-button' onClick={reserveClick}>Reserve</button>
                </div>
            </div>
            <div className='reviews-header'>
                {reviewInfo}
                <button className={loggedIn ? 'visible' : 'hidden'}>Post Your Review</button>
                {!Reviews.length && <p className={!currentOwner ? 'visible' : 'hidden'}>Be the first to post a review!</p>}
            </div>
            <div className='reviews'>
                {reviews}
            </div>
        </>
    )
}

export default SpotDetails