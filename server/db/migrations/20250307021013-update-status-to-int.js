module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Menus" 
      ALTER COLUMN "status" DROP DEFAULT,
      ALTER COLUMN "status" TYPE INTEGER USING ("status"::INTEGER),
      ALTER COLUMN "status" SET DEFAULT 1;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Menus" 
      ALTER COLUMN "status" DROP DEFAULT,
      ALTER COLUMN "status" TYPE BOOLEAN USING ("status"::BOOLEAN),
      ALTER COLUMN "status" SET DEFAULT TRUE;
    `);
  },
};
