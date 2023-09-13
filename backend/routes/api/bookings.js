const Sequelize = require('sequelize');
const express = require('express');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const user = req.user;
    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        }
    });

    const bookingsRes = {
        Bookings: []
    }

    for (let i = 0; i < bookings.length; i++) {
        const booking = bookings[i].dataValues;
        let spot = await Spot.findAll({
            where: {
                id: booking.spotId
            },
            attributes: {
                include: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                exclude: ['description','createdAt', 'updatedAt']
            }
        })
        spot = spot[0].dataValues;

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

        const bookingObj = {
            id: booking.id,
            spotId: booking.spotId,
            Spot: {
                ...spot,
                previewImage: imageUrl
            },
            userId: user.id,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };

        bookingsRes.Bookings.push(bookingObj);
    }

    return res.status(200).json(bookingsRes)
})

router.put('/:bookingId', requireAuth, async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    const { startDate, endDate } = req.body;
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    

    const user = req.user
    //if booking doesnt exist
    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }

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

    const spot = await Spot.findByPk(booking.spotId)
    //if you don't own the booking;
    if (booking.userId !== user.id) {
        return res.status(403).json({
            message: "You must be the owner of a booking to edit the booking"
        })
    }

    //if todays date is past the booking end date
    const today = new Date();

    if (today > booking.endDate) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        })    
    };

    //if trying to change start date but its already past start date
    if (today >= newStartDate && newStartDate > booking.startDate) {
        return res.status(403).json({
            message: "Start dates cannot be modified if booking has already begun"
        })
    }

    //booking conflict


    // const bookingStartDate = new Date(startDate);
    // const bookingEndDate = new Date(endDate);

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
                [Op.lte]: newStartDate
            },
            endDate: 
            {
                [Op.gte]: newStartDate
            }
        }
    })

    // console.log(currentBookingsStartDate, '!!!currentBookignsStartDate')

    if (newEndDate < today) {
        dateError.message = 'Sorry, you cannot book for the past'
        dateError.errors.booking = 'New booking cannot be in the past'
    }

    if (currentBookingsStartDate.length && !dateError.errors.booking) {
        dateError.errors.startDate = "Start date conflicts with an existing booking"
    }

    const currentBookingsEndDate = await Booking.findAll({
        where: {
            spotId: spot.id,
            startDate: {
                [Op.lte]: newEndDate
            },
            endDate: 
            {
                [Op.gte]: newEndDate
            }
        }
    })

    if (currentBookingsEndDate.length && !dateError.errors.booking) {
        dateError.errors.endDate = "End date conflicts with an exisiting booking"
    }

    if (dateError.errors.startDate || dateError.errors.endDate || dateError.errors.booking) {
        return res.status(403).json(dateError)
    }

    //if everything is fine
    await booking.set({
        startDate: startDate,
        endDate: endDate
    });

    booking.save();

    const updatedBooking = await Booking.findByPk(booking.id);

    return res.status(200).json(updatedBooking)
})

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const user = req.user;
    const booking = await Booking.findByPk(req.params.bookingId);
    
    //if booking doesn't exist
    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    };

    const spot = await Spot.findByPk(booking.spotId)
    //if not booking owner

    if ((user.id !== booking.userId) && (user.id !== spot.ownerId)) {
        return res.status(403).json({
            message: "You must own the booking or spot to delete the booking"
        })
    }

    //if bookings have already started
    const today = new Date();

    if (today >= booking.startDate) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        })
    }

    //delete the booking

    await booking.destroy();

    return res.status(200).json({
        message: "Successfully deleted"
    })

})


module.exports = router;