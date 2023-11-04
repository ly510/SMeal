function getAllListing() {
    var request = new XMLHttpRequest();
    request.open("GET", listing_url, true);

    // This function will be called when data returns from the web API
    request.onload = function() {
        if (request.status === 200) {
            // Get all listing records into our listing_array
            listing_array = JSON.parse(request.responseText);
            listingCount = listing_array.length;
            displayListing(listing_array); // Pass the listing_array to the display function
        } else {
            // Handle errors, e.g., display an error message
            console.error('Failed to retrieve listing data');
        }
    };

    request.onerror = function() {
        // Handle network errors
        console.error('Network error while fetching listing data');
    }

    // This command starts the calling of the web API
    request.send();
}

function displayListing(listings) {

    var table = document.getElementById("listingZone");
    var message = "";

    table.innerHTML = "";

    for (var count = 0; count < listings.length; count++) {
        var title = listings[count].title;
        var description = listings[count].description;
        var restaurant = listings[count].restaurantName;

        var cell = '<div class="listing">' +
                    '<div class="listing-container">' +
                        '<div class="listing-header">' +
                            '<h5 class="listing-title">' + title + '</h5>' +
                        '</div>' +
                        '<div class="listing-body">' +
                            '<p class="listing-description">Description: ' + description + '</p>' +
                            '<p class="listing-restaurant">Restaurant: ' + restaurant + '</p>' +

                            
                        '</div>' +
                    '</div>';

        table.insertAdjacentHTML('beforeend', cell);
    }

    message = listings.length + " Listings";
    document.getElementById("summary").textContent = message;
}

function addListing(){
    sessionStorage.setItem("userID", 2);
    
    newListing = new Object();
    newListing.listingID = listingCount + 1;
    newListing.userID = parseInt(sessionStorage.getItem("userID"));
    newListing.title = document.getElementById("listing-title").value;
    newListing.description = document.getElementById("listing-desc").value;
    newListing.location = document.getElementById("user-location").value;
    newListing.restaurantName = document.getElementById("restaurant").value;
    newListing.lat = document.getElementById("lat").value;
    newListing.lng = document.getElementById("lng").value;
    newListing.paymentType = document.getElementById("payment-type").value;
    newListing.fulfillerId = null;
    newListing.status = "Awaiting Acceptance";

    var request = new XMLHttpRequest();
    request.open("POST", addlisting_url, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.send(JSON.stringify(newListing));
    document.getElementById('submitListing').addEventListener('click', function(e) {
        e.preventDefault();
        addListing();

        Swal.fire({
            icon: 'success',
            title: "New Food Listing Added",
            showConfirmButton: false,
            timer: 2300
          }).then(function() {
            window.location.href = "/my-listings.html";
          });
    });
    
}

function getNearbyRestaurants() {
    var selectedLocation = document.getElementById("user-location").value;
    var request = new XMLHttpRequest();

    request.open("POST", restaurant_url, true);
    request.setRequestHeader("Content-Type", "application/json");

    var data = {
        location: "SMU%20" + selectedLocation,
    };

    // This function will be called when data returns from the web API
    request.onload = function() {
        if (request.status === 200) {
            // Get all listing records into our listing_array
            console.log(request.responseText);
            // Decide how to display
            // To display obtained photos: https://developers.google.com/maps/documentation/places/web-service/place-photos (to rmb to check for null photos)
        } else {
            // Handle errors, e.g., display an error message
            console.error('Failed to retrieve restaurant data');
        }
    };

    request.onerror = function() {
        // Handle network errors
        console.error('Network error while fetching restaurant data');
    }

    request.send(JSON.stringify(data));
}