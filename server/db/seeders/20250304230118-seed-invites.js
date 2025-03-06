module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Invites", [
      {
        email: "user1@example.com",
        status: 1, // Pending
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "user2@example.com",
        status: 2, // Joined
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "user3@example.com",
        status: 1, // Pending
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Invites", null, {});
  },
};
