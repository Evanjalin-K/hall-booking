const express = require('express');
const { PORT } = require('./utils/config');
const fs = require('fs');

const app = require('./app')

let rooms = [];
let bookings = [];
let bookingIdCounter = 1;

rooms = readRoomDataFile();
bookings = readBookingDataFile();

bookingIdCounter = readBookingIdCounter();

app.post('/rooms', (req, res) => {
    const { roomName, seats, amenities, pricePerHour } = req.body;

    if (!roomName || !seats || !amenities || !pricePerHour) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingRoom = rooms.find(room => room.roomName === roomName);
    if (existingRoom) {
        return res.status(400).json({ error: 'Room with the same name already exists' });
    }

    const newRoom = {
        id: rooms.length + 1, 
        roomName: roomName,
        seats: seats,
        amenities: amenities,
        pricePerHour: pricePerHour
    };

    rooms.push(newRoom);

    updateRoomDataFile(rooms);

    res.status(201).json(newRoom);
});

app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;

    if (!customerName || !date || !startTime || !endTime || !roomId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const room = rooms.find(room => room.id === roomId);
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }

    const newBooking = {
        id: bookingIdCounter++, 
        customerName: customerName,
        date: date,
        startTime: startTime,
        endTime: endTime,
        roomId: roomId,
        bookingStatus: 'Booked' 
    };

    bookings.push(newBooking);

    updateBookingDataFile(bookings);

    updateBookingIdCounter(bookingIdCounter);

    res.status(201).json(newBooking);
});

app.get('/rooms', (req, res) => {
    const roomsWithBookings = rooms.map(room => {
        const bookingsForRoom = bookings.filter(booking => booking.roomId === room.id);
        if (bookingsForRoom.length > 0) {
            return {
                roomName: room.roomName,
                bookedStatus: true,
                bookings: bookingsForRoom.map(booking => ({
                    customerName: booking.customerName,
                    date: booking.date,
                    startTime: booking.startTime,
                    endTime: booking.endTime
                }))
            };
        } else {
            return {
                roomName: room.roomName,
                bookedStatus: false
            };
        }
    });

    res.json(roomsWithBookings);
});

app.get('/customers', (req, res) => {
    const customersWithBookings = bookings.map(booking => {
        const room = rooms.find(room => room.id === booking.roomId);
        if (room) {
            return {
                customerName: booking.customerName,
                roomName: room.roomName,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime
            };
        } else {
            return null; 
        }
    }).filter(customer => customer !== null);

    res.json(customersWithBookings);
});

app.get('/customerBookingCounts', (req, res) => {
    const customerBookingCounts = {};
    bookings.forEach(booking => {
        const key = `${booking.customerName}_${booking.roomId}_${booking.date}_${booking.startTime}_${booking.endTime}`;

        if (customerBookingCounts[key]) {
            customerBookingCounts[key].count++;
        } else {
            customerBookingCounts[key] = {
                customerName: booking.customerName,
                roomName: getRoomNameById(booking.roomId),
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                bookingId: booking.id,
                bookingDate: booking.date,
                bookingStatus: booking.bookingStatus,
                count: 1
            };
        }
    });

    const customerBookingCountsArray = Object.values(customerBookingCounts);

    res.json(customerBookingCountsArray);
});

function getRoomNameById(roomId) {
    const room = rooms.find(room => room.id === roomId);
    return room ? room.roomName : 'Room not found';
}

function updateRoomDataFile(roomsData) {
    const filePath = './rooms/roomData.json';
    fs.writeFile(filePath, JSON.stringify(roomsData, null, 2), err => {
        if (err) {
            console.error('Error writing to roomData.json:', err);
        } else {
            console.log('roomData.json updated successfully');
        }
    });
}

function updateBookingDataFile(bookingsData) {
    const filePath = './bookings/bookingsData.json';
    fs.writeFile(filePath, JSON.stringify(bookingsData, null, 2), err => {
        if (err) {
            console.error('Error writing to bookingsData.json:', err);
        } else {
            console.log('bookingsData.json updated successfully');
        }
    });
}

function readRoomDataFile() {
    const filePath = './rooms/roomData.json';
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading roomData.json:', err);
        return [];
    }
}

function readBookingDataFile() {
    const filePath = './bookings/bookingsData.json';
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading bookingsData.json:', err);
        return [];
    }
}

function readBookingIdCounter() {
    const filePath = './bookings/bookingIdCounter.json';
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return parseInt(data);
    } catch (err) {
        console.error('Error reading bookingIdCounter.json:', err);
        return 1; 
    }
}

function updateBookingIdCounter(counter) {
    const filePath = './bookings/bookingIdCounter.json';
    fs.writeFile(filePath, counter.toString(), err => {
        if (err) {
            console.error('Error writing to bookingIdCounter.json:', err);
        } else {
            console.log('bookingIdCounter.json updated successfully');
        }
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
