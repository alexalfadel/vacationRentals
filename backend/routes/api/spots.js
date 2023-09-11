const express = require('express');
const { Spot } = require('../../db/models');
const { Review, SpotImage } = require('../../db/models')
const router = express.Router();

router.get('/', async (req, res) => {
    //getting all of the spots
    const spots = await Spot.findAll();

    let allSpots = {
        Spots: []
    }


    //iterating through each spot to create each spot object
    for (let i = 0; i < spots.length; i++) {
        const spot = spots[i];
        //getting all reviews associated with each spot
        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            }
        });
        //calculating average rating for each spot
        let total = 0;

        reviews.forEach(review => {
            total += review.dataValues.stars
        })

        const avgRating = total / reviews.length;

        const spotPreviewImage = await SpotImage.findAll({
            where : {
                spotId: spot.id,
                preview: true
            }
        })

        let imageUrl;

        if (spotPreviewImage[0]) {
                // console.log('IT EXISTS!!!!!')
            imageUrl = spotPreviewImage[0].dataValues.url;
        } else imageUrl = 'none'

        console.log(spotPreviewImage[0])

        //creating each spot object
        const spotObj = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: avgRating,
            previewImage: imageUrl
        };

        //adding each spot object to the array of spot objects
        allSpots.Spots.push(spotObj);
    }

   return res.status(200).json(allSpots);

})



module.exports = router;