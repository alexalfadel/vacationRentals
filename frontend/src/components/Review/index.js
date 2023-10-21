import React from 'react';
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import DeleteReviewModal from '../DeleteReviewModal';
import OpenModalButton from '../OpenModalButton';
import './Review.css'

const formatDate = (string) => {
    const splitDate = string.split('-');
    const monthNumeric = Number(splitDate[1]);
    const year = splitDate[0];

    const months = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    let month;

    for (let i = 0; i < months.length; i++) {
        if (i + 1 === monthNumeric) month = months[i]
    }

    return month + ' ' + year;
}

function Review({ review }) {
    const { stars, createdAt, User} = review;
    const { firstName } = User;
    const reviewText = review.review;
    const currentUser = useSelector((state) => state.session.user)
    const date = formatDate(createdAt);




    return (
        <div className='review-box'>
            <h2>{firstName}</h2>
            <p className='date'>{date}</p>
            <p className='reviewText'>{reviewText}</p>
        </div>
    )
}

export default Review