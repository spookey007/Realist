"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("RoleMenuRights", [
      {
        role_id: 1, // Admin
        menu_id: 1, // Dashboard
        privs: JSON.stringify({
          view: true,
          insert: true,
          update: true,
          delete: true,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1, // Admin
        menu_id: 2, // Users
        privs: JSON.stringify({
          view: true,
          insert: true,
          update: true,
          delete: true,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2, // Manager
        menu_id: 1, // Dashboard
        privs: JSON.stringify({
          view: true,
          insert: false,
          update: false,
          delete: false,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2, // Manager
        menu_id: 3, // Reports
        privs: JSON.stringify({
          view: true,
          insert: false,
          update: false,
          delete: false,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3, // Contractor
        menu_id: 1, // Dashboard
        privs: JSON.stringify({
          view: true,
          insert: false,
          update: false,
          delete: false,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("RoleMenuRights", null, {});
  },
};
