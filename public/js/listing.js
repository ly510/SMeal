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
    newListing.lat = sessionStorage.getItem("lat");
    newListing.lng = sessionStorage.getItem("lng");
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

    // to set proper alert here, if user did not select their current location
    if (selectedLocation == "Select your school") {
        alert("Please enter a location!");
        return;
    }

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
            restaurant_array = JSON.parse(request.responseText);
            if (restaurant_array && restaurant_array.length > 0) {
                displayRestaurants(restaurant_array);
            } else {
                // fix dont display nearbyRestaurant modal
                alert("No restaurants found in your area!"); // proper alert here
            }
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

function displayRestaurants(restaurants) {
    var displayArea = document.getElementById("nearbyRestaurants");
    displayArea.innerHTML = "";

    var full = "";

    for (var i = 0; i < restaurants.length; i++) {
        var name = restaurants[i].name;
        var address = restaurants[i].address;
        var photo = restaurants[i].photo;
        var rating = restaurants[i].rating;

        var lat = restaurants[i].lat;
        var lng = restaurants[i].lng;

        var display = `<div class="row" id="selectedRestaurant" data-lat="${lat}" data-lng="${lng}" data-bs-target="#createModal" data-bs-toggle="modal" data-bs-dismiss="modal">
                            <div class="col-md-3 py-0">
                                ${photo !== null ? `<img src="${photo}" class="img-thumbnail w-100 h-auto" id="restaurantImg">` : `<img src="/img/restaurantDefault.png" class="img-thumbnail w-100 h-auto" id="restaurantImg">`}
                            </div>
                            <div class="col-md-9">
                                <h5><b>${name}</b></h5>
                                <p><b>Address:</b> <span>${address}</span></p>
                                ${rating !== "No rating available" ? `<p><b>Rating:</b> ${rating} <i class="fa-solid fa-star" style="color: #ffeb14;"></i></p>` : `<p><b>Rating:</b> ${rating}</p>`}
                            </div>
                        </div>
                        <hr>`;

            full += display;
        }

    displayArea.innerHTML = full;
}