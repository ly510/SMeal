function getAllListing() {
    var request = new XMLHttpRequest();
    request.open("GET", listing_url, true);

    // This function will be called when data returns from the web API
    request.onload = function () {
        if (request.status === 200) {
            // Get all listing records into our listing_array
            listing_array = JSON.parse(request.responseText);
            listingCount = listing_array.length;
            // displayListing(listing_array); // Pass the listing_array to the display function
        } else {
            // Handle errors, e.g., display an error message
            console.error('Failed to retrieve listing data');
        }
    };

    request.onerror = function () {
        // Handle network errors
        console.error('Network error while fetching listing data');
    }

    // This command starts the calling of the web API
    request.send();
}

function getListingByNotUserID() {
    var request = new XMLHttpRequest();
    request.open("GET", foodlisting_url + sessionStorage.getItem("userId"), true);

    // This function will be called when data returns from the web API
    request.onload = function () {
        if (request.status === 200) {
            // Get all listing records into our listing_array
            foodlisting_array = JSON.parse(request.responseText);
            foodListingCount = foodlisting_array.length;
            displayListing(foodlisting_array);
        } else {
            // Handle errors, e.g., display an error message
            console.error('Failed to retrieve listing data');
        }
    };

    request.onerror = function () {
        // Handle network errors
        console.error('Network error while fetching listing data');
    }

    // This command starts the calling of the web API
    request.send();
}

function displayListing(listings) {
    var container = document.querySelector('.food-list-container .row');

    var message = "";

    container.innerHTML = "";

    for (var count = 0; count < listings.length; count++) {
        var listingID = listings[count].listingID
        var title = listings[count].title;
        var date = listings[count].datePosted;
        var date = date.substring(0, 10);
        var image_url = listings[count].img;

        var cell = '<div class="col-md-3 col-sm-4">' +
            '<div class="card">' +
            '<img src="' + image_url + '" class="card-img-top" alt="Food image">' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + title + '</h5>' +
            '<h6 class="card-subtitle mb-2 text-muted">' + date + '</h6>' +
            '<button class="btn btn-info my-2 viewMore" data-listing-id="' + listingID + '">View More</button>' +
            '<button class="btn btn-success mx-2 my-2 float-end accept-btn" data-listing-id="' + listingID + '">Accept</button>' +
            '</div>' +
            '</div>' +
            '</div>';

        container.insertAdjacentHTML('beforeend', cell);
    }
    message = listings.length + " Listings";
    document.getElementById("numListings").textContent = message;


    // Add click event listener to accept button
    var acceptButtons = document.querySelectorAll('.accept-btn');
    acceptButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var listingID = this.getAttribute('data-listing-id');
            // Prompt the user for confirmation
            var confirmationModal = new bootstrap.Modal(document.getElementsByName('confirmationModal')[0]);
            confirmationModal.show();
            // Set up event listener for the confirmation button
            var confirmButton = document.getElementById('confirmButton');
            confirmButton.addEventListener('click', function () {
                handleAcceptListing(listingID);
                confirmationModal.hide();
            });
        });
    });
}

// Click on one of the listings to open a modal
document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('.food-list-container .row');
    var modal = new bootstrap.Modal(document.getElementById('listingModal'));

    container.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-info')) {
            var listingId = event.target.getAttribute('data-listing-id');

            // Call the function to fetch more details based on listingId
            fetchMoreDetails(listingId)
                .then(function (details) {
                    // Update modal content with details
                    updateModalContent(details);
                    // Show the modal
                    modal.show();
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    });
});
function fetchMoreDetails(listingId) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', `/foodlistingbylistingId/${listingId}`, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
            if (request.status === 200) {
                var details = JSON.parse(request.responseText);
                resolve(details);
            } else {
                reject('Network response was not ok');
            }
        };
        request.onerror = function () {
            reject('Error fetching more details');
        };
        request.send();
    });
}
function updateModalContent(details) {
    document.getElementById('modalListingImage').src = details[0].img;
    document.getElementById('modalListingName').textContent = details[0].name;
    document.getElementById('modalListingUserLocation').textContent = details[0].location;
    var room = details[0].room;
    if (room.length === 0) {
        room = "-No Room Specified-";accept
        document.getElementById('modalListingRoom').style.color = 'grey';
    }
    document.getElementById('modalListingRoom').textContent = room;
    document.getElementById('modalListingTitle').textContent = details[0].title;
    document.getElementById('modalListingDesc').textContent = details[0].description;
    document.getElementById('modalListingRName').textContent = details[0].restaurantName;
    // document.getElementById('modalListingLat').textContent = details[0].lat;
    // document.getElementById('modalListingLng').textContent = details[0].lng;

    sessionStorage.setItem("currentListingID", details[0].listingID);

    // Display Google Map
    var lat = parseFloat(details[0].lat);
    var lng = parseFloat(details[0].lng);
    displayMap(lat, lng, details[0].restaurantName);

}


// Add click event listener to elements with the "viewMore" class
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('viewMore')) {
        var listingId = event.target.getAttribute('data-listing-id');
        sessionStorage.setItem("selectedListId", listingId);
    }
});

document.addEventListener('click', function(event){
    var listingId = sessionStorage.getItem("selectedListId");
    if (event.target.id === 'confirmButton') {
        handleAcceptListingInModal(listingId);
    }
});


function handleAcceptListingInModal(listingId) {
    try {
        var fulfillerId = sessionStorage.getItem("userId");
        var request = new XMLHttpRequest();
        request.open("PUT", `/changeListingStatus/${listingId}`, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
            if (request.status === 200) {
                window.location.href = 'accepted-listings.html';
            } else {
                console.error('Error accepting the listing:', request.statusText);
                // Handle the error, show an alert, or perform other actions
            }
        };
        request.onerror = function () {
            console.error('Network error while accepting the listing');
            // Handle network errors
        };
        request.send(JSON.stringify({ status: 'Listing Accepted', fulfillerId }));

    } catch (error) {
        console.error('Error accepting the listing:', error.message);
        // Handle the error, show an alert, or perform other actions
    }
}

function displayMap(lat, lng, name) {
    const myLatlng = { lat: lat, lng: lng };
    const map = new google.maps.Map(document.getElementById("modalMap"), {
        zoom: 15,
        center: myLatlng,
    });
    // Create a marker on the map with a name
    const marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: name, // Add the name to the marker
    });
    // Create an InfoWindow with the details
    const infoWindow = new google.maps.InfoWindow({
        position: myLatlng,
        content: `Restraunt: ${name}`, // Display the name in the content
    });
    // Open the InfoWindow
    infoWindow.open(map);
}

function handleAcceptListing(listingId) {
    try {
        var fulfillerId = sessionStorage.getItem("userId");
        var request = new XMLHttpRequest();
        request.open("PUT", `/changeListingStatus/${listingId}`, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
            if (request.status === 200) {
                // Close the modal
                var modal = new bootstrap.Modal(document.getElementById('listingModal'));
                modal.hide();
                // Redirect to accepted-listings.html
                window.location.href = 'accepted-listings.html';
            } else {
                console.error('Error accepting the listing:', request.statusText);
                // Handle the error, show an alert, or perform other actions
            }
        };
        request.onerror = function () {
            console.error('Network error while accepting the listing');
            // Handle network errors
        };
        request.send(JSON.stringify({ status: 'Listing Accepted', fulfillerId }));

    } catch (error) {
        console.error('Error accepting the listing:', error.message);
        // Handle the error, show an alert, or perform other actions
    }
}

 
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment');
    const listingID = urlParams.get('listingID');
    console.log('Payment Success:', paymentSuccess);
    console.log('Listing ID:', listingID);
    sessionStorage.setItem("paymentStatus",paymentSuccess);
    sessionStorage.setItem("paymentListingId",listingID);
});
