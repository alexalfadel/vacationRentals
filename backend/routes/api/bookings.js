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
                exclude: ['createdAt', 'updatedAt']
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



module.exports = router;