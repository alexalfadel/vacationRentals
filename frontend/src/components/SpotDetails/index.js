import React from 'react';
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useContext, useState } from 'react'
import { loadAllSpotsThunk, loadSpotThunk } from '../../store/spots';
import { restoreUser } from '../../store/session';
import Review from '../Review';
import ReviewFormModal from '../ReviewFormModal';
import OpenModalButton from '../OpenModalButton';
import DeleteReviewModal from '../DeleteReviewModal';
import './SpotDetails.css'





const capitalizeWords = (str) => {
    if (str.length <= 3) return str.toUpperCase();
    else {
        const splitWord = str.split(' ');
        const newWord = splitWord.map(word => {
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        })
        return newWord.join(' ')
        
    }
}

const formatRating = (num) => {
    const nums = [1, 2, 3, 4, 5];
    if (num) {
        if (nums.includes(num)) return `${num}.0`
        if (num.toString().length > 3) {
        return num.toFixed(2)
        }
    }
    
    else return num;
}

function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spotData = useSelector((state) => (state.spots));
    const userData = useSelector((state) => state.session);
    const allSpotReviews = useSelector((state) => state.spot)
    const spotDetails = spotData[spotId]

    const { user } = userData;

    

    useEffect(() => {
        dispatch(loadSpotThunk(spotId))
    }, [dispatch, spotId, spotData.Reviews])

    useEffect(() => {
        dispatch(restoreUser())
    }, [dispatch])

    // console.log(user, '---user')

    if (!spotDetails || !spotDetails.Owner) return <h2>Loading...</h2>
    

    const loggedIn = user ? true : false;

    // console.log(spotData);

    const { name, city, state, country, description, price, avgStarRating, numReviews, Owner, Reviews, SpotImages, ownerId } = spotDetails;

    const { firstName, lastName } = Owner;

    let currentOwner;
    let canPost;

    if (loggedIn) {
        currentOwner = user.id === ownerId ? true : false
        const userReview = Object.values(Reviews).find(review => review.userId === user.id)
        canPost = userReview ? false : true
    } else {
        currentOwner = false;
        canPost = false;
    }
    


    Reviews.sort((a, b) => {
        let keyA = new Date(a.createdAt);
        let keyB = new Date(b.createdAt)

        if (keyA < keyB ) return 1
        if (keyB < keyA ) return -1
        return 0;
    })

    // let showDelete;
    // if (loggedIn) {

    // }

    const reviews = Reviews.map(review => {
        let showDelete;
        if (loggedIn && user.id === review.userId) {
            showDelete = true;
        } else showDelete = false;
        return (
            <>
            <Review review={review}/>
            <div className={showDelete ? 'visible' : 'hidden'}>
                <button className='delete-review-button'><OpenModalButton textColor='white' buttonText='Delete' modalComponent={<DeleteReviewModal review={review} />} /></button>
            </div>
            </>
            
        )
    })
   
    let reviewInfo;

    const reviewInnerText = Reviews.length === 1 ? 'review' : 'reviews';

    if (!Reviews.length) {
        reviewInfo = <p><span><i className="fa-solid fa-star"></i></span> New</p>
    } else {
        reviewInfo = <p><span><i className="fa-solid fa-star"></i></span> {formatRating(avgStarRating)}  ·  {numReviews} {reviewInnerText}</p>
    }

    



    const reserveClick = () => {
        alert('Feature Coming Soon...')
    }


    return (
        <div className='spot-details-box'>
            <h2 className='spot-details-name'>{name}</h2>
            <p className='spot-details-location'>{capitalizeWords(city)}, {capitalizeWords(state)}, {capitalizeWords(country)}</p>
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
                    <p className='spot-host'>Hosted by {firstName} {lastName}</p>
                    <p>{description}</p>
                </div>
                <div className='spot-details-reserve-box'>
                    <div className='reserve-box-price-reviews'>
                        <p>${price} night</p>
                        {/* <p><span><i className="fa-solid fa-star"></i></span>{numReviews}<span><i className="fa-solid fa-circle"></i></span> {numReviews} {reviewInnerText} </p> */}
                        {reviewInfo}
                    </div>
                    <button className='reserve-button' onClick={reserveClick}>Reserve</button>
                </div>
            </div>
            <div className='reviews-header'>
                <div className='review-info'>
                {reviewInfo}
                </div>
                <div className={!currentOwner && loggedIn && canPost ? 'visible' : 'hidden'}>
                    <button className='post-review-button'><OpenModalButton textColor='white' buttonText='Post Your Review' modalComponent={<ReviewFormModal spotId={spotId} />} /></button>
                </div>
                {!Reviews.length && <p className={!currentOwner && loggedIn ? 'visible' : 'hidden'}>Be the first to post a review!</p>}
            </div>
            <div className='reviews'>
                {reviews}
            </div>
        </div>
    )
}

export default SpotDetails