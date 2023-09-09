'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

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
   await Spot.bulkCreate([
    {
      ownerId: 1,
      address: '22 Lake Way',
      city: 'Jonestown',
      state: 'CA',
      country: 'US',
      lat: 45.32,
      lng: 112.96,
      name: 'Relaxing lakehouse',
      description: 'Cozy cabin by the lake, just 10 minutes away from downtown',
      price: 157,
    },
    {
      ownerId: 2,
      address: '33 River Road',
      city: 'Capetown',
      state: 'CT',
      country: 'US',
      lat: 67.22,
      lng: 164.26,
      name: 'Scenic Cabin on the River',
      description: 'Cabin on the river, perfect for rafting',
      price: 253,
    },
    {
      ownerId: 3,
      address: '44 City Ct',
      city: 'New York',
      state: 'NY',
      country: 'US',
      lat: 82.29,
      lng: 114.98,
      name: 'City Condo right by Downtown',
      description: 'Upscale condo in NYC, perfect for a weekend trip',
      price: 350,
    }
   ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Relaxing lakehouse', 'Scenic Cabin on the River', 'City Condo right by Downtown']}
    }, {} );
  }
};
