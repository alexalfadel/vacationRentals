const express = require('express');
const { Review, Spot, ReviewImage, User, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    //check if review belongs to current user
    const user = req.user

    const review = await Review.findByPk(req.params.reviewId);

    //if review doesnt exist, send error
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    const refinedReview = review.dataValues;

    if (user.id !== refinedReview.userId) {
        return res.status(400).json({
            message: "Review must belong to current user"
        })
    }

    //checking for more than 10 images per review

    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId: refinedReview.id
        }
    })

    if (reviewImages.length >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached"
        })
    }

    const { url } = req.body

    const newReviewImage = await ReviewImage.create({
        url: url,
        reviewId: refinedReview.id
    })

    return res.status(200).json({
        id: newReviewImage.id,
        url: newReviewImage.url
    })    
})

router.get('/current', requireAuth, async (req, res) => {
    const user = req.user
    const userReviews = await Review.findAll({
        where: {
            userId: user.id
        }
    })

    console.log(userReviews)

    const reviewRes = {
        Reviews: [],

    }

    for (let i = 0; i < userReviews.length; i++) {
        const review = userReviews[i].dataValues;

        const userObj = await User.findByPk(user.id)
        const refinedUser = userObj.dataValues

        const spot = await Spot.findByPk(review.spotId);
        const refinedSpot = spot.dataValues

        const spotImage = await SpotImage.findAll({
            where: {
                preview: true
            }
        })

        let imageUrl; 
        if (!spotImage.length) imageUrl = 'none'
        else imageUrl = spotImage[0].dataValues.url

        const reviewImages = await ReviewImage.findAll({
            where: {
                reviewId: review.id
            },
            attributes: {
                include: ['id', 'url'],
                exclude: ['reviewId', 'createdAt', 'updatedAt']
            }
        })

        // let allReviewImages = [];

        // for (let i = 0; i < reviewImages.length; i++) {

        // }

        // console.log(userObj)

        const reviewObj = {
            ...review,
            User: {
                id: refinedUser.id,
                firstName: refinedUser.firstName,
                lastName: refinedUser.lastName
            },
            Spot: {
                id: refinedSpot.id,
                ownerId: refinedSpot.ownerId,
                address: refinedSpot.address,
                city: refinedSpot.city,
                state: refinedSpot.state,
                country: refinedSpot.country,
                lat: refinedSpot.lat,
                lng: refinedSpot.lng,
                name: refinedSpot.name,
                price: refinedSpot.price,
                previewImage: imageUrl
            },
            ReviewImages: reviewImages
        }

        reviewRes.Reviews.push(reviewObj);

    }

    return res.status(200).json(reviewRes)
})

router.put('/:reviewId', requireAuth, async (req, res) => {
    const currReview = await Review.findByPk(req.params.reviewId);
    const user = req.user;

    //check to see if review exists
    if (!currReview) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    //check to see if review belongs to current user
    if (user.id !== currReview.userId) {
        return res.status(403).json({
            message: "You must be the review owner to edit a review"
        })
    }

    const { review, stars } = req.body

    await currReview.set( {
        review: review,
        stars: stars

    })

    await currReview.save();

    const updatedReview = await Review.findByPk(currReview.id)

    return res.status(200).json(updatedReview)
})

router.delete('/:reviewId', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);
    const user = req.user

    //check to see if review exists
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    };

    if (user.id !== review.userId) {
        return res.status(403).json({
            message: "You must own a review to delete it"
        })
    };

    await review.destroy();

    return res.status(200).json({
        message: "Successfully deleted"
    })

})


module.exports = router;