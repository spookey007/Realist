'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Properties', [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        owner_id: 1,
        address: '123 Main Street, New York, NY 10001',
        property_type: 'Single Family Home',
        price: 750000.00,
        details: JSON.stringify({
          bedrooms: 4,
          bathrooms: 2.5,
          square_footage: 2500,
          year_built: 2010,
          features: ['Central AC', 'Fireplace', 'Garage', 'Backyard'],
          description: 'Beautiful single-family home in prime location'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        owner_id: 1,
        address: '456 Park Avenue, Los Angeles, CA 90001',
        property_type: 'Apartment',
        price: 1200000.00,
        details: JSON.stringify({
          bedrooms: 3,
          bathrooms: 2,
          square_footage: 1800,
          year_built: 2015,
          features: ['Doorman', 'Gym', 'Pool', 'Parking'],
          description: 'Luxury apartment with amazing city views'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        owner_id: 1,
        address: '789 Ocean Drive, Miami, FL 33139',
        property_type: 'Condo',
        price: 950000.00,
        details: JSON.stringify({
          bedrooms: 2,
          bathrooms: 2,
          square_footage: 1500,
          year_built: 2018,
          features: ['Ocean View', 'Balcony', 'Security', 'Beach Access'],
          description: 'Modern condo with stunning ocean views'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        owner_id: 1,
        address: '321 Lake Shore Drive, Chicago, IL 60601',
        property_type: 'Townhouse',
        price: 650000.00,
        details: JSON.stringify({
          bedrooms: 3,
          bathrooms: 2.5,
          square_footage: 2200,
          year_built: 2012,
          features: ['Lake View', 'Fireplace', 'Garage', 'Patio'],
          description: 'Spacious townhouse with lake views'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        owner_id: 1,
        address: '654 Market Street, San Francisco, CA 94103',
        property_type: 'Commercial',
        price: 2500000.00,
        details: JSON.stringify({
          square_footage: 5000,
          year_built: 2005,
          features: ['High Ceilings', 'Loading Dock', 'Security System', 'Parking'],
          description: 'Prime commercial space in downtown'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        owner_id: 1,
        address: '1000 Beach Road, Malibu, CA 90265',
        property_type: 'Luxury Villa',
        price: 3500000.00,
        details: JSON.stringify({
          bedrooms: 5,
          bathrooms: 4.5,
          square_footage: 4500,
          year_built: 2019,
          features: ['Private Beach Access', 'Infinity Pool', 'Home Theater', 'Wine Cellar', 'Smart Home'],
          description: 'Stunning oceanfront villa with panoramic views'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        owner_id: 1,
        address: '200 Park Avenue, Boston, MA 02108',
        property_type: 'Penthouse',
        price: 2800000.00,
        details: JSON.stringify({
          bedrooms: 4,
          bathrooms: 3.5,
          square_footage: 3200,
          year_built: 2020,
          features: ['Private Elevator', 'Rooftop Terrace', 'Smart Home', 'Wine Room', 'City Views'],
          description: 'Luxurious penthouse in the heart of Boston'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        owner_id: 1,
        address: '500 Tech Park, Seattle, WA 98109',
        property_type: 'Office Space',
        price: 1800000.00,
        details: JSON.stringify({
          square_footage: 4000,
          year_built: 2017,
          features: ['Open Floor Plan', 'Conference Rooms', 'Kitchen', 'Parking', 'Fiber Internet'],
          description: 'Modern office space in tech hub'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        owner_id: 1,
        address: '300 Mountain View, Aspen, CO 81611',
        property_type: 'Ski Chalet',
        price: 4200000.00,
        details: JSON.stringify({
          bedrooms: 6,
          bathrooms: 5,
          square_footage: 5000,
          year_built: 2018,
          features: ['Ski-in/Ski-out', 'Hot Tub', 'Game Room', 'Fireplace', 'Mountain Views'],
          description: 'Luxury ski chalet with direct mountain access'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440009',
        owner_id: 1,
        address: '150 Vineyard Lane, Napa Valley, CA 94558',
        property_type: 'Vineyard Estate',
        price: 8500000.00,
        details: JSON.stringify({
          bedrooms: 7,
          bathrooms: 6,
          square_footage: 8000,
          year_built: 2015,
          features: ['Vineyard', 'Wine Cellar', 'Guest House', 'Pool', 'Gardens'],
          description: 'Magnificent vineyard estate with wine production facilities'
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Properties', null, {});
  }
}; 