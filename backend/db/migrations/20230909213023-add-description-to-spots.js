'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Spots', 'description', {
      type: Sequelize.STRING,
      allowNull: false }, options)
      options.tableName = 'Spots'
      options.columnName = 'description'
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    options.tableName = 'Spots'
    options.columnName = 'description'
    await queryInterface.removeColumn(options.tableName, options.columnName)
  }
};
