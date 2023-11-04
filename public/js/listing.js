
function getAllListing() {
    var request = new XMLHttpRequest();
    request.open("GET", listing_url, true);

    // This function will be called when data returns from the web API
    request.onload = function() {
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

    request.onerror = function() {
        // Handle network errors
        console.error('Network error while fetching listing data');
    }

    // This command starts the calling of the web API
    request.send();
}


function getListingByNotUserID() {
    var request = new XMLHttpRequest();
    request.open("GET", foodlisting_url+sessionStorage.getItem("userId"), true);

    // This function will be called when data returns from the web API
    request.onload = function() {
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

    request.onerror = function() {
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
        var title = listings[count].title;
        var date = listings[count].datePosted;
        var date = date.substring(0, 10);

        var cell = '<div class="col-md-3 col-sm-4">' +
            '<div class="card">' +
                '<img src="img/food2.jpg" class="card-img-top" alt="Food image">' +
                '<div class="card-body">' +
                    '<h5 class="card-title">' + title + '</h5>' +
                    '<h6 class="card-subtitle mb-2 text-muted">' + date + '</h6>' +
                    '<button class="btn btn-info my-2">View More</button>' +
                    '<button class="btn btn-success mx-2 my-2 float-end">Accept</button>' +
                '</div>' +
            '</div>' +
        '</div>';

        container.insertAdjacentHTML('beforeend', cell);
    }

    message = listings.length + " Listings";
    document.getElementById("numListings").textContent = message;
}

function addListing(){
    
    newListing = new Object();

    newListing.userId = parseInt(sessionStorage.getItem("userId"));
    newListing.title = document.getElementById("listing-title").value;
    newListing.description = document.getElementById("listing-desc").value;
    newListing.location = document.getElementById("user-location").value;
    newListing.room = document.getElementById("user-room").value;
    newListing.restaurantName = document.getElementById("restaurant").value;
    newListing.lat = document.getElementById("lat").value;
    newListing.lng = document.getElementById("lng").value;
    newListing.paymentType = document.getElementById("payment-type").value;

    // // Check if any value is null
    // for (var key in newListing) {
    //     if (newListing[key] === null || newListing[key] === "") {
    //         return; // If any value is null or empty, return early and don't add the listing
    //     }
    // }

    newListing.fulfillerId = null;
    newListing.status = "Awaiting Acceptance";

    var request = new XMLHttpRequest();
    request.open("POST", addlisting_url, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.send(JSON.stringify(newListing));

    Swal.fire({
        icon: 'success',
        title: "New Food Listing Added",
        showConfirmButton: false,
        timer: 2300
        }).then(function() {
        window.location.href = "/my-listings.html";
        });
}

function getListingByUserID(){

    var request = new XMLHttpRequest();
    request.open("GET", listing_url+"/"+sessionStorage.getItem("userId"), true);

    // This function will be called when data returns from the web API
    request.onload = function() {
        if (request.status === 200) {
            // Get all listing records into our listing_array
            mylisting_array = JSON.parse(request.responseText);
            mylistingCount = mylisting_array.length;
            displayListingByUserID(mylisting_array); // Pass the listing_array to the display function
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

function getListingDetails(listingID) {
    var request = new XMLHttpRequest();
    request.open("GET", listing_url + "/" + listingID, true);

    request.onload = function() {
        if (request.status === 200) {
            var listingDetails = JSON.parse(request.responseText);
            // Do something with listingDetails
        } else {
            console.error('Failed to retrieve listing details');
        }
    };

    request.onerror = function() {
        console.error('Network error while fetching listing details');
    }

    request.send();
}

function displayListingByUserID(listings) {

    var table = document.getElementById("listingZone");
    var message = "";

    table.innerHTML = "";

    for (var count = 0; count < listings.length; count++) {
        var listingID = listings[count].listingID;
        getListingDetails(listingID);
        var title = listings[count].title;
        var description = listings[count].description;
        var restaurant = listings[count].restaurantName;
        var location = listings[count].location;
        var room = listings[count].room;
        var status = listings[count].status;
        var listingID = listings[count].listingID;

        if(status == "Awaiting Acceptance"){
            status = 1;
        }else if(status == "Listing Accepted"){
            status = 2;
        }else if (status == "On the Way"){
            status = 3;
        }else if(status == "Listing Completed"){
            status = 4;
        }else if(status == "Cancelled"){
            status = 0;
        }

        var cell = '<div class="listing px-2">' +
                '<div class="listing-container row">' +
                    '<div class="col-md-5">' +
                        '<div class="listing-header">' +
                            '<h5 class="listing-title">' + title + '</h5>' +
                        '</div>' +
                        '<div class="listing-body">' +
                            '<p class="user-room"> Room: ' + room + '</p>' +
                            '<p class="user-location" style="font-weight:bold; color: #28a745"> User Location: ' + location + '</p>' +
                            '<p class="listing-restaurant">Restaurant: ' + restaurant + '</p>' +
                            '<p class="listing-description">Description: ' + description + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-md-6">' +
                        '<br><div class="listing-status">' +
                        '<ul id="progressbar-2" class="d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2">' +
                        '<li class="step0 ' + (status >= 1 ? 'active' : '') + ' text-center" id="step1"></li>' +
                        '<li class="step0 ' + (status >= 2 ? 'active' : '') + ' text-center" id="step2"></li>' +
                        '<li class="step0 ' + (status >= 3 ? 'active' : '') + ' text-center" id="step3"></li>' +
                        '<li class="step0 ' + (status >= 4 ? 'active' : '') + ' text-muted text-end" id="step4"></li>' +
                    '</ul>' +
                    '<div class="d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2">' +
                        '<p class="text-left">Awaiting Acceptance</p>' +
                        '<p class="text-center">Listing Accepted</p>' +
                        '<p class="text-center">On the Way</p>' +
                        '<p class="text-center">Listing Completed</p>' +
                    '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-md-1 text-end">' +
                        (status == 0 ? '<button class="btn btn-secondary float-end my-2 mx-1" disabled>Cancelled</button>'+ '<button id="deleteButton" class="btn btn-danger float-end my-2 mx-1" onclick="deleteListing('+listingID+')" value="'+listingID+'"">Delete</button>' :
                        (status >= 2 ? 
                        '<form action="/api/stripe/create-checkout-session" method="POST">' +
                            '<button type="submit" class="btn btn-success payment-button paymentButton" id="checkout" value="' + listingID + '">Pay</button>' +
                        '</form>' 
                        : 
                            '<button class="btn btn-danger payment-button" id="cancelButton" onclick="cancelListing('+listingID+')" value="'+listingID+'">Cancel</button>')) +
                    '</div>' +
                    // '<div class="col-md-1 text-end">' +
                    //     (status >= 4 ? '<button class="btn btn-success delete-button" id="deleteButton" @click=deleteListing()>X</button>': '<button class="btn btn-success payment-button disabled" id="deleteButton" @click=deleteListing()>X</button>') +
                    // '</div>' +
                '</div>' +
            '</div>';

        table.insertAdjacentHTML('beforeend', cell);
        // Add event listener to cancelButton

        // Get all elements with the class "paymentButton"
        var paymentButtons = document.querySelectorAll('.paymentButton');

        // Add an event listener to each button
        paymentButtons.forEach((paymentButton) => {
            paymentButton.addEventListener('click', async (event) => {
                event.preventDefault();
                // get listing ID from button value + parse before comparing
                const listingID = parseInt(event.target.value);
                // find the listing with this listingID              
                const listing = listings.find(listing => listing.listingID === listingID);
                if (!listing) {
                    console.error('Listing not found');
                    return;
                }
                const description = listing.description;
                const response = await fetch('/api/stripe/create-checkout-session', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        description: description
                    })
                });
                const data = await response.json();
                window.location.href = data.url;
            });
        });
    }
    
    message = mylistingCount + " Listings";
    document.getElementById("summary").textContent = message;
}

function cancelListing(listingID){
    var response = confirm("Are you sure you want to cancel this request?");
    var listingID = parseInt(document.getElementById("cancelButton").value);

    var request = new XMLHttpRequest();
    request.open("PUT", listing_url+"/"+listingID, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.send();
    document.getElementById('cancelButton').addEventListener('click', function(e) {
        e.preventDefault();
        cancelListing();

        Swal.fire({
            icon: 'success',
            title: "Listing Cancelled",
            showConfirmButton: false,
            timer: 2300
          }).then(function() {
            window.location.href = "/my-listings.html";
          });
    });
}

function deleteListing(listingID){
    var response = confirm("Are you sure you want to delete this request?");
    var listingID = parseInt(document.getElementById("deleteButton").value);

    var request = new XMLHttpRequest();
    request.open("DELETE", deleteListing_url+listingID, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.send();
    document.getElementById('deleteButton').addEventListener('click', function(e) {
        e.preventDefault();
        deleteListing();

        Swal.fire({
            icon: 'success',
            title: "Listing Deleted",
            showConfirmButton: false,
            timer: 2300
          }).then(function() {
            window.location.href = "/my-listings.html";
          });
    });
}