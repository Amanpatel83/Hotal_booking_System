document.addEventListener("DOMContentLoaded", fetchRooms);

async function fetchRooms() {
    try {
        const response = await fetch('rooms.json');
        const rooms = await response.json();

        populateRoomTypes(rooms);
    } catch (error) {
        console.error("Error fetching room data:", error);
    }
}

function populateRoomTypes(rooms) {
    const roomTypeSelect = document.getElementById('room-type');
    roomTypeSelect.innerHTML = ''; // Clear previous options

    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.type;
        option.textContent = `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} - ${room.price}Rs per night`;
        roomTypeSelect.appendChild(option);
    });
}

document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const checkinDate = document.getElementById('checkin').value;
    const checkoutDate = document.getElementById('checkout').value;
    const roomType = document.getElementById('room-type').value;
    const adults = document.getElementById('adults').value;
    const children = document.getElementById('children').value;

    calculatePrice(checkinDate, checkoutDate, roomType, adults, children);
});

async function calculatePrice(checkinDate, checkoutDate, roomType, adults, children) {
    const response = await fetch('rooms.json');
    const rooms = await response.json();
    const selectedRoom = rooms.find(room => room.type === roomType);

    if (!selectedRoom) {
        alert("Room type not available.");
        return;
    }

    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const nights = (checkout - checkin) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
        alert("Checkout date must be later than check-in date.");
        return;
    }

    const roomPrice = selectedRoom.price * nights;
    const totalPrice = roomPrice * adults + (children * 50 * nights);
    displayPriceSummary(roomType, nights, totalPrice);
}

function displayPriceSummary(roomType, nights, totalPrice) {
    const summary = document.getElementById('summary');
    summary.innerHTML = `
        <p>Room Type: ${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room</p>
        <p>Number of Nights: ${nights}</p>
        <p>Total Price: ${totalPrice}Rs</p>
    `;
}