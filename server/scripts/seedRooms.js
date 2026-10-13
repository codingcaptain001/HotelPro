/**
 * seedRooms.js — Safe, idempotent seed script for HotelPro sample rooms.
 *
 * Usage:
 *   cd server && npm run seed:rooms
 *
 * Safety guarantees:
 *   - Loads credentials from server/.env via dotenv (never hardcoded).
 *   - Reuses existing connectDB and Room model — no second connection.
 *   - Idempotent: uses the `_seedId` field as a stable unique key.
 *     Running the script multiple times will upsert (update) existing
 *     seed records instead of inserting duplicates.
 *   - NEVER deletes existing rooms, bookings, users, or payments.
 *   - Exits with code 0 on success, code 1 on any failure.
 */

'use strict';

require('dotenv').config();

const connectDB = require('../config/db');
const Room = require('../models/Room');

// ---------------------------------------------------------------------------
// Sample room data — 8 realistic rooms covering multiple types / price points
// All fields satisfy Room schema required validators.
// ---------------------------------------------------------------------------
const SEED_ROOMS = [
  {
    _seedId: 'seed-room-001',
    name: 'Ocean Breeze Deluxe Suite',
    roomNumber: '101',
    roomType: 'Deluxe Suite',
    description:
      'Perched on the top floor with panoramic Pacific Ocean views, the Ocean Breeze Deluxe Suite offers a king bed, marble bath, and private balcony. Perfect for couples seeking a luxurious coastal retreat.',
    pricePerNight: 349,
    capacity: 2,
    amenities: [
      'King Bed',
      'Ocean View Balcony',
      'High-Speed Wi-Fi',
      'Nespresso Machine',
      'Smart TV (65")',
      'Rainfall Shower',
      'Mini Bar',
      'Daily Housekeeping',
    ],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    _seedId: 'seed-room-002',
    name: 'Garden View Executive Suite',
    roomNumber: '202',
    roomType: 'Executive Suite',
    description:
      'The Garden View Executive Suite combines a spacious king bedroom with a separate sitting lounge overlooking our manicured tropical gardens. Ideal for business travellers who value both comfort and productivity.',
    pricePerNight: 279,
    capacity: 2,
    amenities: [
      'King Bed',
      'Separate Sitting Lounge',
      'Work Desk & Ergonomic Chair',
      'High-Speed Wi-Fi',
      'Smart TV',
      'Soaking Bathtub',
      'In-Room Safe',
      'Daily Housekeeping',
    ],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    _seedId: 'seed-room-003',
    name: 'Sunset Ocean Villa',
    roomNumber: '301',
    roomType: 'Ocean Villa',
    description:
      'A private beachfront villa with direct sand access, an outdoor plunge pool, and sweeping sunset views. The Sunset Ocean Villa accommodates up to 4 guests and features two bedrooms, a fully equipped kitchenette, and wraparound terrace.',
    pricePerNight: 649,
    capacity: 4,
    amenities: [
      'Two King Bedrooms',
      'Private Plunge Pool',
      'Direct Beach Access',
      'Kitchenette',
      'Wraparound Terrace',
      'High-Speed Wi-Fi',
      'Smart TV (75")',
      'Outdoor Shower',
      'Butler Service',
      'Daily Housekeeping',
    ],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    _seedId: 'seed-room-004',
    name: 'Classic Single Retreat',
    roomNumber: '105',
    roomType: 'Single Room',
    description:
      'A smartly appointed single room designed for solo travellers and business guests. Features a plush queen bed, fast Wi-Fi, and all essential amenities — everything you need at an excellent value.',
    pricePerNight: 129,
    capacity: 1,
    amenities: [
      'Queen Bed',
      'High-Speed Wi-Fi',
      'Smart TV',
      'Rainfall Shower',
      'In-Room Safe',
      'Daily Housekeeping',
      'Complimentary Breakfast',
    ],
    images: [
      'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    _seedId: 'seed-room-005',
    name: 'Family Haven Suite',
    roomNumber: '210',
    roomType: 'Family Suite',
    description:
      'The Family Haven Suite is designed for families of up to 5, featuring a master king bedroom, two twin beds in an adjoining room, a kitchenette, and a spacious lounge. Children stay free, and complimentary cribs are available on request.',
    pricePerNight: 449,
    capacity: 5,
    amenities: [
      'King Bed + Two Twin Beds',
      'Kitchenette',
      'Lounge Area',
      'High-Speed Wi-Fi',
      'Smart TV (65")',
      'Kids Welcome Kit',
      'Crib on Request',
      'In-Room Safe',
      'Daily Housekeeping',
    ],
    images: [
      'https://images.unsplash.com/photo-1586611292717-f828b167408c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    _seedId: 'seed-room-006',
    name: 'Penthouse Sky Loft',
    roomNumber: '501',
    roomType: 'Penthouse',
    description:
      'The crown jewel of HotelPro, the Sky Loft Penthouse spans the entire top floor with 360-degree ocean and city views. A private rooftop terrace, jacuzzi, dedicated concierge, and signature in-suite dining experience make this an unforgettable luxury stay.',
    pricePerNight: 1299,
    capacity: 4,
    amenities: [
      'King Bed',
      '360° Rooftop Terrace',
      'Private Jacuzzi',
      'Dedicated Concierge',
      'In-Suite Dining',
      'Home Theatre System',
      'Bose Sound System',
      'High-Speed Wi-Fi',
      'Fully Stocked Bar',
      'Luxury Bath Products',
      'Daily Housekeeping',
    ],
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    _seedId: 'seed-room-007',
    name: 'Cosy Twin Courtyard Room',
    roomNumber: '108',
    roomType: 'Twin Room',
    description:
      'A comfortably appointed twin room overlooking our tranquil courtyard garden. Ideal for friends or colleagues travelling together. Features two full beds, ample wardrobe space, and a bright en-suite bathroom.',
    pricePerNight: 179,
    capacity: 2,
    amenities: [
      'Two Full Beds',
      'Courtyard Garden View',
      'High-Speed Wi-Fi',
      'Smart TV',
      'En-suite Bathroom',
      'Wardrobe & Luggage Rack',
      'Daily Housekeeping',
    ],
    images: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    _seedId: 'seed-room-008',
    name: 'Deluxe Pool Cabana Suite',
    roomNumber: '220',
    roomType: 'Deluxe Suite',
    description:
      'Step directly from your private patio onto the infinity pool terrace. The Pool Cabana Deluxe Suite offers a king bed, poolside loungers, outdoor shower, and a chilled minibar stocked daily — resort-style living at its finest.',
    pricePerNight: 389,
    capacity: 2,
    amenities: [
      'King Bed',
      'Direct Pool Terrace Access',
      'Poolside Loungers',
      'Outdoor Shower',
      'High-Speed Wi-Fi',
      'Smart TV',
      'Mini Bar (replenished daily)',
      'Bathrobes & Slippers',
      'Daily Housekeeping',
    ],
    images: [
      'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
async function seedRooms() {
  let connection;

  try {
    // 1. Connect — reuses connectDB (guards against double connection)
    connection = await connectDB();
    console.log('\n🌱  Starting HotelPro room seed...\n');

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const roomData of SEED_ROOMS) {
      const { _seedId, ...fields } = roomData;

      // Upsert on _seedId — never touches rooms without this field
      const result = await Room.findOneAndUpdate(
        { _seedId },
        { $set: { ...fields, _seedId } },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
      );

      if (result.createdAt && result.updatedAt &&
          result.createdAt.getTime() === result.updatedAt.getTime()) {
        // Newly inserted (createdAt == updatedAt within same ms window)
        // We rely on the upserted flag via Mongoose instead
        inserted++;
        console.log(`  ✅ Inserted: ${result.name} (${_seedId})`);
      } else {
        updated++;
        console.log(`  🔄 Updated : ${result.name} (${_seedId})`);
      }
    }

    // Re-count using upsert result — more reliable approach
    // Report final counts
    const totalSeedRooms = await Room.countDocuments({ _seedId: { $exists: true } });
    const totalRooms = await Room.countDocuments({});

    console.log('\n─────────────────────────────────────────');
    console.log(`  Seed rooms in DB : ${totalSeedRooms}`);
    console.log(`  Total rooms in DB: ${totalRooms}`);
    console.log('─────────────────────────────────────────');
    console.log('\n✅  Seed completed successfully. No existing data was removed.\n');

  } catch (err) {
    console.error('\n❌  Seed script failed:', err.message || err);
    process.exit(1);
  } finally {
    // Always close the connection cleanly
    if (connection) {
      await connection.connection.close();
      console.log('🔌  MongoDB connection closed.\n');
    }
  }
}

seedRooms();
