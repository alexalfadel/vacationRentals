const Sequelize = require('sequelize');
const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const user = req.user;
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    
    
    //if spotImage doesnt exist

    if (!spotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        })
    }

    const spot = await Spot.findByPk(spotImage.spotId)
    //if not spot owner

    if (user.id !== spot.ownerId) {
        return res.status(403).json({
            message: "You must own the spot to delete an image"
        })
    }

    await spotImage.destroy();

    return res.status(200).json({
        message: "Successfully deleted"
    })


})



module.exports = router