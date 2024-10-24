const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    maxCapacity: { type: Number, required: true },
    isReserved: { type: Boolean, default: false },
    category: { type: String, required: true }
});

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

module.exports = Room;
