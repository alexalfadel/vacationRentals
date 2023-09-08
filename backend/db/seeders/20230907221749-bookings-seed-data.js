'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Booking.bulkCreate([
    {
      spotId: 1,
      userId: 2,
      startDate: "2023-11-05",
      endDate: "2023-11-12",
    },
    {
      spotId: 2,
      userId: 1,
      startDate: "2023-12-04",
      endDate: "2023-12-10",
    },
    {
      spotId: 3,
      userId: 2,
      startDate: "2023-10-04",
      endDate: "2023-10-09",
    },
    {
      spotId: 3,
      userId: 1,
      startDate: "2023-10-10",
      endDate: "2023-10-15",
    },
   ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
