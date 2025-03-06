module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("invites", [
      {
        invite_link: `INV-${Math.random().toString(36).substr(2, 9)}`,
        status: 1,
        email: "user1@example.com",
        expires_at: new Date(new Date().setDate(new Date().getDate() + 7)), // Expires in 7 days
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Invites", null, {});
  },
};
