import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './RoomList.css'; // Make sure to include your CSS file
import Notification from '../notification/notification.js'; // Import your Notification component

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [notification, setNotification] = useState(null); // State for notifications

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await API.get('/rooms');
        setRooms(response.data);
      } catch (error) {
        setNotification({ message: 'Error fetching rooms', type: 'error' }); // Set error notification
      }
    };

    fetchRooms();
  }, []);

  function formatTime(timeString) {
    if (!timeString) return 'N/A';

    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  function AmOrPm(timeString) {
    const date = new Date(timeString);
    const hours = date.getHours();
    return hours >= 12 ? "PM" : "AM";
  }

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await API.delete(`/reservations/${reservationId}`);
      setNotification({ message: response.data.message || 'Reservation cancelled successfully!', type: 'success' }); // Success notification

      // Update local state to remove the reservation
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.reservation && room.reservation._id === reservationId
            ? { ...room, isReserved: false, reservation: null }
            : room
        )
      );
    } catch (error) {
      setNotification({ message: 'Error cancelling reservation', type: 'error' }); // Error notification
      console.error('Error cancelling reservation:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
    }
  };

  return (
    <div className="room-list">
      <h1> - Rooms List - </h1>
      
      {/* Display notification if it exists */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)} // Clear notification on close
        />
      )}

      <ul>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <li key={room._id} className={room.isReserved ? 'room-reserved' : 'room-available'}>
              <h2>Room: {room.name || 'Unnamed Room'}</h2>
              {room.isReserved ? (
                <div>
                  <p id="reserved">Reserved by: {room.reservation?.clientName || 'Unknown'}</p>
                  <p id="start">Start Time: {formatTime(room.reservation?.startTime)} {AmOrPm(room.reservation?.startTime)}</p>
                  <p id="end">End Time: {formatTime(room.reservation?.endTime)} {AmOrPm(room.reservation?.endTime)}</p>
                  <p id="attendees">Attendees: {room.reservation?.attendees || 'N/A'}</p>
                  <button className='button' onClick={() => handleCancelReservation(room.reservation._id)}>Cancel Reservation</button>
                </div>
              ) : (
                <div>
                  <p id="room-status">Room is available</p>
                  <span>{room.maxCapacity} Person</span>
                </div>
              )}
            </li>
          ))
        ) : (
          <p id="room-status">No rooms available.</p>
        )}
      </ul>
    </div>
  );
};

export default RoomList;
