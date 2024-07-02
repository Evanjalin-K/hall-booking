## Hall Booking API

1. To Creating a Room with:

   - Room Name
   - Number of seats available
   - amenities in room
   - price per hour

Using the POST method, the room is created and stored in a folder called rooms in roomData.json file.

```
{
    "roomName": "A7",
    "seats": 3,
    "amenities": ["Projector", "Whiteboard", "Ac"],
    "pricePerHour": 3000
}
```

2. Booking a room with:

   - Customer Name
   - Date
   - Start Time
   - End Time
   - Room Id

Using the POST method, rooms have been booked and stored in the existing folder bookings as bookingsData.json.

```
{
"id": 1,
"customerName": "Evan Joe",
"date": "2024-08-15",
"startTime": "10:00 AM",
"endTime": "12:00 AM",
"roomId": 6
}
```

3. List all the Rooms with Booked data:

   - Room Name
   - Booked Status
   - Customer Name
   - Date
   - Start Time
   - End Time

Using GET method we can list all the rooms with booked data.

4. List all the customer with booked data with:

   - Customer Name
   - Room Name
   - Date
   - Start Time
   - End Time

Using GET method we can list all the customer with booked data.


5. List how many times a customer has booked the room with below details:

   - Customr Name
   - Room Name
   - Date
   - Start Time
   - End Time
   - Booking ID
   - Booking Date
   - Booking Status

Using the GET method, we can get how many times a customer has booked the room with the above details.

### The task is created by using nodejs and expressjs.

### Packages Used:

   - npm init
   - npm install express
   - npm install nodemon
   - npm install dotenv

### Used Postman for GET and POST Methods





