const express = require('express');
const { Review, Spot, ReviewImage } = require('../../db/models');
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



module.exports = router;