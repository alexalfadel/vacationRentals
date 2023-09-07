'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
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

    await User.bulkCreate([
      {
        username: 'johnsmith22',
        firstName: 'John',
        lastName: 'Smith',
        email: 'johnsmith22@gmail.com',
        hashedPassword: bcrypt.hashSync('johnspassword')
      },
      {
        username: 'sarabeth33',
        firstName: 'Sarah',
        lastName: 'Beth',
        email: 'sarahbeth33@gmail.com',
        hashedPassword: bcrypt.hashSync('sarahspassword')
      },
      {
        username: 'jakeperson44',
        firstName: 'Jake',
        lastName: 'Person',
        email: 'jakeperson44@gmail.com',
        hashedPassword: bcrypt.hashSync('jakespassword')
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
