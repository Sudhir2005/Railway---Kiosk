// Initialize and add the map with Leaflet.js
let map; // Global map variable to update it later
let marker; // Global marker variable

// Define the area bounding coordinates (roughly covers Egmore Railway Station)
const bounds = [
    [13.0745, 80.2590], // Southwest coordinates
    [13.0837, 80.2658]  // Northeast coordinates
];

// Define locations for quick access
const locations = {
    restroom: [13.0785, 80.2610], // Example coordinates for Restroom
    platform: [13.0790, 80.2620], // Example coordinates for Platform
    foodCourt: [13.0780, 80.2625], // Example coordinates for Food Court
    ticketCounter: [13.0795, 80.2615] // Example coordinates for Ticket Counter
};

function initMap() {
    // Create the map and set initial view (central point)
    map = L.map('map').fitBounds(bounds);

    // Use OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at Egmore Railway Station
    marker = L.marker([13.0791, 80.2619]).addTo(map)
        .bindPopup('Egmore Railway Station, Chennai')
        .openPopup();
}

// Function to search for location using Nominatim API
function searchLocation(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;

                // Update the map to the searched location
                map.setView([lat, lon], 16);

                // Remove the previous marker (if any)
                if (marker) {
                    map.removeLayer(marker);
                }

                // Add a new marker for the searched location
                marker = L.marker([lat, lon]).addTo(map)
                    .bindPopup(`Searched location: ${query}`)
                    .openPopup();
            } else {
                alert("Location not found. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while searching for the location.");
        });
}

// Search bar functionality
document.getElementById('search-btn').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-bar').value;
    if (searchTerm) {
        searchLocation(searchTerm);
    } else {
        alert("Please enter a location to search.");
    }
});

// Accessibility settings toggle
document.getElementById('accessibility-btn').addEventListener('click', () => {
    alert("Opening accessibility settings...");
});

// Emergency button click
document.getElementById('emergency-btn').addEventListener('click', () => {
    alert("Contacting emergency assistance...");
});

// Quick access buttons functionality
const quickAccessButtons = document.querySelectorAll('.quick-btn');
quickAccessButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.textContent.toLowerCase().replace(' ', '');
        if (locations[type]) {
            const [lat, lon] = locations[type];
            map.setView([lat, lon], 17); // Zoom in to the selected location
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([lat, lon]).addTo(map)
                .bindPopup(`Navigating to ${button.textContent}`)
                .openPopup();
        } else {
            alert(`Location for ${button.textContent} not found.`);
        }
    });
});

// Function to change the language
function changeLanguage(lang) {
    const translations = {
        en: {
            headerTitle: "Railway Station Navigation",
            searchPlaceholder: "Search for location...",
            searchButton: "Search",
            nearestRestroom: "Nearest Restroom",
            platforms: "Platforms",
            foodCourt: "Food Court",
            ticketCounter: "Ticket Counter",
            accessibilityButton: "Accessibility Settings",
            emergencyButton: "Emergency Assistance"
        },
        hi: {
            headerTitle: "रेलवे स्टेशन नेविगेशन",
            searchPlaceholder: "स्थान खोजें...",
            searchButton: "खोजें",
            nearestRestroom: "निकटतम शौचालय",
            platforms: "प्लेटफ़ॉर्म",
            foodCourt: "फूड कोर्ट",
            ticketCounter: "टिकट काउंटर",
            accessibilityButton: "सुगमता सेटिंग्स",
            emergencyButton: "आपातकालीन सहायता"
        },
        ta: {
            headerTitle: "ரயில்வே நிலையம் வழிகாட்டி",
            searchPlaceholder: "இடத்தைத் தேடவும்...",
            searchButton: "தேடவும்",
            nearestRestroom: "அடுத்த சிறுசெயலி",
            platforms: "தண்டவாளங்கள்",
            foodCourt: "உணவு கூடம்",
            ticketCounter: "டிக்கெட் அவசரத்திற்கான",
            accessibilityButton: "அணுகுமுறை அமைப்புகள்",
            emergencyButton: "அவசர உதவி"
        }
    };
    
    const translation = translations[lang];
    if (translation) {
        document.querySelector('header h1').textContent = translation.headerTitle;
        document.getElementById('search-bar').placeholder = translation.searchPlaceholder;
        document.getElementById('search-btn').textContent = translation.searchButton;
        
        const buttons = document.querySelectorAll('.quick-btn');
        buttons[0].textContent = translation.nearestRestroom;
        buttons[1].textContent = translation.platforms;
        buttons[2].textContent = translation.foodCourt;
        buttons[3].textContent = translation.ticketCounter;
        
        document.getElementById('accessibility-btn').textContent = translation.accessibilityButton;
        document.getElementById('emergency-btn').textContent = translation.emergencyButton;
    }
}

// Event listener for language selection
document.getElementById('language').addEventListener('change', function() {
    const selectedLanguage = this.value;
    changeLanguage(selectedLanguage);
});

// Call initMap when the page loads
window.onload = initMap;
