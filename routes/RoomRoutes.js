const express = require('express');
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');
const router = express.Router();

// Get all rooms with their reservation status
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find(); // Fetch all rooms

    const roomsWithReservations = await Promise.all(
      rooms.map(async (room) => {
        const reservation = await Reservation.findOne({ 
          room: room._id, 
          endTime: { $gt: new Date() } 
        });

        const isReserved = reservation ? true : false; // Determine reservation status

        return { ...room._doc, isReserved, reservation }; 
      })
    );

    res.json(roomsWithReservations);
  } catch (err) {
    console.error('Error fetching rooms:', err); // Log any errors
    res.status(500).json({ error: 'Error fetching rooms' });
  }
});


// Add a new room
router.post('/', async (req, res) => {
  const { name, maxCapacity } = req.body;

  if (!name || !maxCapacity) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  const newRoom = new Room({
    name,
    maxCapacity
  });

  try {
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
