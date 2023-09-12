const Sequelize = require('sequelize');
const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const user = req.user;
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);

    if (!reviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found"
        })
    }

    const review = await Review.findByPk(reviewImage.reviewId);

    if (user.id !== review.userId) {
        return res.status(403).json({
            message: "You must be the review owner to delete an image"
        })
    };

    await reviewImage.destroy();

    return res.status(200).json({
        message: "Successfully deleted"
    })
})

module.exports = router