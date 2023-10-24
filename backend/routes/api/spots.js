const express = require('express');
const Sequelize = require('sequelize');
const { Spot } = require('../../db/models');
const { Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')
const router = express.Router();
// import { Op } from '@sequelize/core';

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

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    //check if you are the owner
    const user = req.user;
    const spot = await Spot.findByPk(req.params.spotId);

    //check if spot exists
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const bookingsRes = {
        Bookings: []
    }
    //if you are the owner
    if (user.id === spot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId:  spot.id
            }
        })

        for (let i = 0; i < bookings.length; i++) {
            const booking = bookings[i].dataValues;
            let user = await User.findAll({
                where: {
                    id: booking.userId
                },
                attributes: {
                    include: ['id', 'firstName', 'lastName'],
                    exclude: ['email', 'username', 'hashedPassword', 'createdAt', 'updatedAt']
                }
            });

            user = user[0].dataValues

            const bookingObj = {
                User: user,
                ...booking
            }

            bookingsRes.Bookings.push(bookingObj);
        }

        
    } else {
        //if you are not the owner
        const bookings = await Booking.findAll({
            where: {
                spotId:  spot.id
            }
        })

        for (let i = 0; i < bookings.length; i++) {
            const booking = bookings[i].dataValues;

            const bookingsObj = {
                spotId: booking.spotId,
                startDate: booking.startDate,
                endDate: booking.endDate
            }

            bookingsRes.Bookings.push(bookingsObj)
        }

    }

    //if you are not the owner

    //if you are the owner

    return res.status(200).json(bookingsRes)
})

router.get('/:spotId/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    //if spot doesnt exist
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const reviewsData = await Review.findAll({
        where: {
            spotId: req.params.spotId
        }
    })

    const reviewsRes = {
        Reviews: []
    };

    for (let i = 0; i < reviewsData.length; i++) {
        const review = reviewsData[i].dataValues;
        const userData = await User.findAll({
            where: {
                id: review.userId
            },
            attributes: {
                include: ['id', 'firstName', 'lastName'],
                exclude: ['username', 'hashedPassword', 'createdAt', 'updatedAt']
            }
        });
        const user = userData[0].dataValues
        const reviewImages = await ReviewImage.findAll({
            where: {
                reviewId: review.id,
            },
            attributes: {
                include: ['id', 'url'],
                exclude: ['reviewId', 'createdAt', 'updatedAt']
            }
        });

        const reviewObj = {
            // id: review.id,
            // userId: review.userId,
            // review: review.review,
            // stars: review.stars,
            ...review,
            User: {
                ...user
            },
            ReviewImages: []
        };

        for (let i = 0; i < reviewImages.length; i++) {
            const reviewData = reviewImages[i].dataValues;
            const reviewImage = {...reviewData};
            reviewObj.ReviewImages.push(reviewImage);
        }

        reviewsRes.Reviews.push(reviewObj)
    };

    return res.status(200).json(reviewsRes)

})

router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const refinedSpot = spot.dataValues;


    const spotReviews = await Review.findAll({
        where: {
            spotId: spot.dataValues.id
        }
    })

    const numReviews = spotReviews.length

    let total = 0;

    spotReviews.forEach(review => {
        total += review.dataValues.stars
    })

    const avgRating = total / spotReviews.length;

    const spotRes = {
        ...refinedSpot,
        numReviews: numReviews,
        avgStarRating: avgRating,
        SpotImages: []
    }

    const spotImages = await SpotImage.findAll({
        where : {
            spotId: spot.dataValues.id,
        }
     })

     for (let i = 0; i < spotImages.length; i++) {
        let currImg = spotImages[i];
        let imgObj = {
            id: currImg.id,
            url: currImg.url,
            preview: currImg.preview
        }

        spotRes.SpotImages.push(imgObj)
     }

     const owner = await User.findByPk(spot.dataValues.ownerId)

     const refinedOwner = owner.dataValues;

     spotRes.Owner = {
        id: refinedOwner.id,
        firstName: refinedOwner.firstName,
        lastName: refinedOwner.lastName
     }
     
     
    return res.json(spotRes)
})

router.get('/', async (req, res) => {
    //search filters
    let { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    let query = {
        where: {},
        include: []
    }
    //getting all of the spots
    // const spots = await Spot.findAll();
    //pagination
    let { page, size } = req.query;

    const error = {
        message: "Bad Request",
        errors: {}
    }

    if (page && page < 1) error.errors.page = "Page must be greater than or equal to 1"
    if (page && page > 10) error.errors.page = "Page must be less than or equal to 10"
    if (size && size < 1) error.errors.size = "Size must be greater than or equal to 1"
    if (size && size > 20) error.errors.size = "Size must be less than or equal to 20"
    if (maxLat && (maxLat > 90 || maxLat < -90)) error.errors.maxLat = "Maximum latitude is invalid"
    if (minLat && (minLat < -90 || minLat > 90)) error.errors.minLat = "Minimum latitude is invalid"
    if (maxLng && (maxLng > 180 || maxLng < -180)) error.errors.maxLng = "Maximum longitude is invalid"
    if (minLng && (minLng < -180 || minLng > 180)) error.errors.minLng = "Minimum longitude is invalid"
    if (minPrice && minPrice < 0) error.errors.minPrice = "Minimum price must be greater than or equal to 0"
    if (maxPrice && maxPrice < 0) error.errors.maxPrice = "Maximum price must be greater than or equal to 0"

    if (Object.keys(error.errors).length) {
        return res.status(400).json(error);
    }
    


    if (!Number.isNaN(page) && parseInt(page) <= 1) page = 1;
    else if (!Number.isNaN(page) && parseInt(page) >= 10) page = 10;
    else if (!Number.isNaN(page)) page = parseInt(page);
    else page = 1;

    if (!Number.isNaN(size) && parseInt(size) <= 1) size = 1;
    else if (!Number.isNaN(size) && parseInt(size) >= 20) size = 20;
    else if (!Number.isNaN(size)) size = parseInt(size);
    else size = 20;

    const pagination = {};

    if (size >= 1 && page >= 1) {
        query.limit = size;
        query.offset = size * (page - 1)
    }

    //querying

    const Op = Sequelize.Op;

    if (minLat) {
        minLat = parseFloat(minLat)
        query.where.lat = {
            [Op.gte]: minLat
        }
    }

    if (maxLat) {
        maxLat = parseFloat(maxLat);
        query.where.lat = {
            [Op.lte]: maxLat
        }
    }

    if (minLng) {
        minLng = parseFloat(minLng);
        query.where.lng = {
            [Op.gte]: minLng
        }
    }

    if (maxLng) {
        maxLng = parseFloat(maxLng);
        query.where.lng = {
            [Op.lte]: maxLng
        }
    }

    if (minPrice) {
        minPrice = parseFloat(minPrice);
        query.where.price = {
            [Op.gte]: minPrice
        }
    }

    if (maxPrice) {
        maxPrice = parseFloat(maxPrice);
        query.where.price = {
            [Op.lte]: maxPrice
        }
    }

    //
    const spots = await Spot.findAll(query);

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

    allSpots.page = page;
    allSpots.size = size;

   return res.status(200).json(allSpots);

})

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    const user = req.user;

    //check if spot exists
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    
    //check if current user owns the spot
    if (user.id === spot.ownerId) {
        return res.status(403).json({
            message: "You cannot book a booking for your own spot"
        })
    };


    const { startDate, endDate } = req.body;

    const validationError = {
        message: "Bad Request",
        errors: {}
    }

    if (!startDate) {
        validationError.errors.startDate = "Please enter a valid start date"
    }

    if (!endDate) {
        validationError.errors.endDate = "Please enter a valid end date"
    }

    if (validationError.errors.startDate || validationError.errors.endDate) {
        return res.status(400).json(validationError)
    }

    const bookingStartDate = new Date(startDate);
    const bookingEndDate = new Date(endDate);

    //error message to be sent
    const dateError = {
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {}
    };

    //check for overlap
    let Op = Sequelize.Op
    //if start date is invalid
    const currentBookingsStartDate = await Booking.findAll({
        where: {
            spotId: spot.id,
            startDate: {
                [Op.lte]: bookingStartDate
            },
            endDate: 
            {
                [Op.gte]: bookingStartDate
            }
        }
    })



    if (currentBookingsStartDate.length) {
        dateError.errors.startDate = "Start date conflicts with an existing booking"
    }

    const currentBookingsEndDate = await Booking.findAll({
        where: {
            spotId: spot.id,
            startDate: {
                [Op.lte]: bookingEndDate
            },
            endDate: 
            {
                [Op.gte]: bookingEndDate
            }
        }
    })

    if (currentBookingsEndDate.length) {
        dateError.errors.endDate = "End date conflicts with an exisiting booking"
    }

    const currentBookingsBothDates = await Booking.findAll({
        where: {
            spotId: spot.id,
            startDate: {
                [Op.gte]: bookingStartDate
                    },
            endDate: {
                [Op.lte]: bookingEndDate
                    }
            }
        })
    

    if (currentBookingsBothDates.length) {
        dateError.errors.startDate = "Start date conflicts with an existing booking";
        dateError.errors.endDate = "End date conflics wtih an existing booking"
    }

    if (dateError.errors.startDate || dateError.errors.endDate) {
        return res.status(403).json(dateError)
    }

    const newBooking = await Booking.create({
        spotId: spot.id,
        userId: user.id,
        startDate: startDate,
        endDate: endDate
    });

    return res.status(200).json(newBooking)



})

router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    //check for spot
    const spot = await Spot.findByPk(req.params.spotId) 

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const refinedSpot = spot.dataValues
    const user = req.user
    //check to see if there is a review by that user for that spot

    const userReviewsForSpot = await Review.findAll({
        where: {
            spotId: refinedSpot.id,
            userId: user.id
        }
    })

    if (userReviewsForSpot.length) {
        return res.status(500).json({
            message: "User already has a review for this spot"
        })
    }


    const { review, stars } = req.body

    const newReview = await Review.create({
        userId: user.id,
        spotId: req.params.spotId,
        review: review,
        stars: stars
    })

    return res.status(201).json(newReview);
})

router.post('/:spotId/images', requireAuth, async (req, res,) => {
    const { url, preview } = req.body;

    //pulling up the spot
    const spot = await Spot.findAll( {
        where: {
            id: req.params.spotId
        }
    })

    //checking to see if spot exists
    if (!spot.length) {
    
        const err = new Error("Spot doesn't exist");
            err.message = "Spot couldn't be found";
            err.status = 404;
            throw err
    }

    //checking to see if they own the spot
    if (spot[0].dataValues.ownerId !== req.user.id) {
        const err = new Error("Unauthorized");
        err.status = 403;
        err.message = "You must own the spot to add an image"
        throw err
    }

    //checking to see if there is already a preview for a spot
    if (preview === true) {
        const spotPreviewImageData = await SpotImage.findAll({
            where: {
                spotId: req.params.spotId,
                preview: true
            }
        })

        const spotPreviewImage = spotPreviewImageData[0]
    
        if (spotPreviewImage) {
            await spotPreviewImage.set({
                preview: false
            });
            await spotPreviewImage.save();
        }

        
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

router.put('/:spotId', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const refinedSpot = spot.dataValues;

    if (userId !== refinedSpot.ownerId) {
        return res.status(401).json({
            message: "You must own the spot to make an edit"
        })
    }

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    await spot.set({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    })

    await spot.save();

    const editedSpot = await Spot.findByPk(req.params.spotId);

    return res.status(200).json(editedSpot)
})

router.delete('/:spotId', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const refinedSpot = spot.dataValues;

    if (userId !== refinedSpot.ownerId) {
        return res.status(401).json({
            message: "You must own the spot to delete"
        })
    }

    await spot.destroy();

    return res.status(200).json({
        message: "Successfully deleted"
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