function getAllListing() {
    var request = new XMLHttpRequest();
    request.open("GET", listing_url, true);

    // This function will be called when data returns from the web API
    request.onload = function() {
        if (request.status === 200) {
            // Get all listing records into our listing_array
            listing_array = JSON.parse(request.responseText);
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
                            '<h3 class="listing-title">' + title + '</h3>' +
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
