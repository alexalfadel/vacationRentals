const express = require('express');
const { Spot } = require('../../db/models');
const { Review, SpotImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')
const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const allUserSpots = await Spot.findAll({
        where: {
            ownerId: userId
        }
    })

    let allUserSpotsRes = {
        Spots: []
    };

    //iterating through each spot to create each spot object
    for (let i = 0; i < allUserSpots.length; i++) {
        const spot = allUserSpots[i];
        //getting all reviews associated with each spot
        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            }
        });

        //calculating average rating for each spot

        let avgRating;

        if (!reviews.length) avgRating = "No reviews yet";
        else {
            let total = 0;

            reviews.forEach(review => {
                total += review.dataValues.stars
            })
    
            avgRating = total / reviews.length;
        }

        const spotPreviewImage = await SpotImage.findAll({
            where : {
                spotId: spot.id,
                preview: true
            }
        })

        let imageUrl;

        if (spotPreviewImage[0]) {
            imageUrl = spotPreviewImage[0].dataValues.url;
        } else imageUrl = 'none'

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

        allUserSpotsRes.Spots.push(spotObj)
    }

    return res.status(200).json(allUserSpotsRes);

})

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
            imageUrl = spotPreviewImage[0].dataValues.url;
        } else imageUrl = 'none'

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

router.post('/:spotId/images', requireAuth, async (req, res,) => {
    const { url, preview } = req.body;

    const spot = await Spot.findAll( {
        where: {
            id: req.params.spotId
        }
    })

    if (!spot.length) {
    
        const err = new Error("Spot doesn't exist");
            err.message = "Spot couldn't be found";
            err.status = 404;
            throw err
    }

    if (spot[0].dataValues.ownerId !== req.user.id) {
        const err = new Error("Unauthorized");
        err.status = 403;
        err.message = "You must own the spot to add an image"
        throw err
    }

    const newSpotImage = await SpotImage.create({
        url: url,
        preview: preview,
        spotId: req.params.spotId
    })

    return res.status(200).json({
        id: newSpotImage.id,
        url: newSpotImage.url,
        preview: newSpotImage.preview
    }) 
})

router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    const { user } = req;

    const newSpot = await Spot.create( {
        ownerId: user.id,
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price,
    })

    res.status(201).json(newSpot);

})



module.exports = router;