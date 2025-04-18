'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Menus', [
      {
        id: 1,
        name: 'Dashboard',
        href: '/dashboard',
        icon: 'dashboard',
        parent_menu_id: null,
        status: 1,
        position: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Appointments',
        href: '/appointments',
        icon: 'calendar',
        parent_menu_id: null,
        status: 1,
        position: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Users',
        href: '/users',
        icon: 'users',
        parent_menu_id: null,
        status: 1,
        position: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Roles',
        href: '/roles',
        icon: 'shield',
        parent_menu_id: null,
        status: 1,
        position: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'Invites',
        href: '/invite',
        icon: 'envelope',
        parent_menu_id: null,
        status: 1,
        position: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        name: 'Menu Management',
        href: '/menu',
        icon: 'list',
        parent_menu_id: null,
        status: 1,
        position: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        name: 'Listings',
        href: '/listings',
        icon: 'home',
        parent_menu_id: null,
        status: 1,
        position: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        name: 'Services',
        href: '/services',
        icon: 'tools',
        parent_menu_id: null,
        status: 1,
        position: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 9,
        name: 'Service Types',
        href: '/servicetype',
        icon: 'tag',
        parent_menu_id: null,
        status: 1,
        position: 9,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 10,
        name: 'Reports',
        href: '/reports',
        icon: 'chart-bar',
        parent_menu_id: null,
        status: 1,
        position: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 11,
        name: 'User Privileges',
        href: '/userprivileges',
        icon: 'key',
        parent_menu_id: null,
        status: 1,
        position: 11,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Menus', null, {});
  }
}; 