'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models');

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
   await SpotImage.bulkCreate([
    {
      url: 'https://idologyasheville.com/img/Things-You-Never-Knew-About-Your-Lakehouse-Home-Floors_IDology-Asheville.jpg',
      preview: true,
      spotId: 1
    },
    {
      url: 'https://www.quickenloans.com/learnassets/QuickenLoans.com/Learning%20Center%20Images/Stock-Cabin-On-A-Lake.jpeg',
      preview: false,
      spotId: 1
    },
    {
      url: 'https://www.vertica.com/wp-content/uploads/2021/12/data-lakehouse-vertica.jpg',
      preview: false,
      spotId: 1
    },
    {
      url: 'https://www.mydomaine.com/thmb/60unR5_a3IF5lA7Ua8hCWIenv44=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/cdn.cliqueinc.com__cache__posts__261235__modern-lake-house-261235-1529620668950-image.700x0c-c7c9da91004f4e059ced312406fb9ec6.jpg',
      preview: false,
      spotId: 1
    },
    {
      url: 'https://www.southernliving.com/thmb/i2if2BdzhEhZOMpVWUcs0wcJ2KU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/2140101_richa_048-1-e7a0b1221054438b84851e9ce1a0a2e8.jpg',
      preview: false,
      spotId: 1
    },
    {
      url: 'https://www.travelandleisure.com/thmb/G3mir1WXFJ0UXObQ7MIZRFg85BE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/TAL-header-gatlinburg-tennessee-CABINS0123-ac308b389b7b4526a3eb8f5703608f6f.jpg',
      preview: true,
      spotId: 2
    },
    {
      url: 'https://www.mountainliving.com/content/uploads/2021/06/c/i/out-living-pool-hot-tub-scaled.jpg',
      preview: false,
      spotId: 2
    },
    {
      url: 'https://paradiserestored.com/wp-content/uploads/2016/03/Nimelman_009.jpg',
      preview: false,
      spotId: 2
    },
    {
      url: 'https://img.traveltriangle.com/blog/wp-content/uploads/2018/11/Rivers-of-the-World-Cover.jpg',
      preview: false,
      spotId: 2
    },
    {
      url: 'https://physicsworld.com/wp-content/uploads/2019/09/Concave-river.jpg',
      preview: false,
      spotId: 2
    },
    {
      url: 'https://thumbs.cityrealty.com/assets/smart/736x/webp/1/16/1655f4e3904fb79cb987ab7755d2b3f4b8f37f88/1-city-point.jpg',
      preview: true,
      spotId: 3
    },
    {
      url: 'https://www.glenwoodnyc.com/wp-content/uploads/2022/05/2-JSP-LOBBY-01-02-1280.jpg',
      preview: false,
      spotId: 3
    },
    {
      url: 'https://media.timeout.com/images/103376074/1920/1080/image.jpg',
      preview: false,
      spotId: 3
    },
    {
      url: 'https://travel.usnews.com/dims4/USNEWS/d40353c/2147483647/resize/976x652%5E%3E/crop/976x652/quality/85/?url=https%3A%2F%2Ftravel.usnews.com%2Fimages%2FTimes_Square_Getty.jpg',
      preview: false,
      spotId: 3
    },
    {
      url: 'https://media.timeout.com/images/106048741/1920/1080/image.jpg',
      preview: false,
      spotId: 3
    },
   ], { validate: true } )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
