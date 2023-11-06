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

function addListing() {

    newListing = new Object();

    newListing.userId = parseInt(sessionStorage.getItem("userId"));
    newListing.title = document.getElementById("listing-title").value;
    newListing.description = document.getElementById("listing-desc").value;
    newListing.location = document.getElementById("user-location").value;
    newListing.room = document.getElementById("user-room").value;
    newListing.restaurantName = document.getElementById("restaurant").value;
    newListing.lat = sessionStorage.getItem("lat");
    newListing.lng = sessionStorage.getItem("lng");
    newListing.img = sessionStorage.getItem("restaurantImg");
    newListing.paymentType = document.getElementById("payment-type").value;
    newListing.phoneNo = sessionStorage.getItem("phoneNo");

    // Check if any value is null
    for (var key in newListing) {
        if (newListing[key] === null || newListing[key] === "") {
            alert('All fields must be filled out');
            return;
        }
    }

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
    }).then(function () {
        window.location.href = "/my-listings.html";
    });
}

function getListingByUserID() {

    var request = new XMLHttpRequest();
    request.open("GET", listing_url + "/" + sessionStorage.getItem("userId"), true);

    // This function will be called when data returns from the web API
    request.onload = function () {
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

    request.onerror = function () {
        // Handle network errors
        console.error('Network error while fetching listing data');
    }

    // This command starts the calling of the web API
    request.send();
}

function getListingDetails(listingID) {
    var request = new XMLHttpRequest();
    request.open("GET", listing_url + "/" + listingID, true);

    request.onload = function () {
        if (request.status === 200) {
            var listingDetails = JSON.parse(request.responseText);
            // Do something with listingDetails
        } else {
            console.error('Failed to retrieve listing details');
        }
    };

    request.onerror = function () {
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

        if (status == "Awaiting Acceptance") {
            status = 1;
        } else if (status == "Listing Accepted") {
            status = 2;
        } else if (status == "On the Way") {
            status = 3;
        } else if (status == "Listing Completed") {
            status = 4;
        } else if (status == "Cancelled") {
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
                            (sessionStorage.getItem("paymentStatus") == "success" && sessionStorage.getItem("paymentListingId") == listingID
                            ? '<button type="submit" class="btn btn-success payment-button paymentButton" disabled id="checkout" value="' + listingID + '">Paid</button>'
                            : '<button type="submit" class="btn btn-success payment-button paymentButton" id="checkout" value="' + listingID + '">Pay</button>') +
                        '</form>'
                        : 
                            '<button class="btn btn-danger cancel-button float-end my-2 mx-1" id="cancelButton" onclick="cancelListing('+listingID+')" value="'+listingID+'">Cancel</button>')) +
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
                        description: description,
                        listingID: listingID
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

function cancelListing(listingID) {
    var response = confirm("Are you sure you want to cancel this request?");

    if (response) {
        // User clicked OK, proceed with the operation
    } else {
        // User clicked Cancel, do not proceed
        return;
    }
    
    tocancel = new Object();
    tocancel.phoneNo = sessionStorage.getItem("phoneNo");

    var request = new XMLHttpRequest();
    request.open("PUT", listing_url + "/" + listingID, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.send(JSON.stringify(tocancel));
    
    Swal.fire({
        icon: 'success',
        title: "Listing Cancelled",
        showConfirmButton: false,
        timer: 2300
    }).then(function () {
        window.location.href = "/my-listings.html";
    });
}

function deleteListing(listingID) {
    var response = confirm("Are you sure you want to delete this request?");

    if (response) {
        // User clicked OK, proceed with the operation
    } else {
        // User clicked Cancel, do not proceed
        return;
    }

    todelete = new Object();
    todelete.phoneNo = sessionStorage.getItem("phoneNo");

    var request = new XMLHttpRequest();
    request.open("DELETE", deleteListing_url + listingID, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.send(JSON.stringify(todelete));
    
    Swal.fire({
        icon: 'success',
        title: "Listing Deleted",
        showConfirmButton: false,
        timer: 2300
    }).then(function () {
        window.location.href = "/my-listings.html";
    });
}



const listing = Vue.createApp({
    data() {
        return {
            restaurants: [],
            restaurantName: "",
            restaurantAddress: "",

            // alerts
            loadingDisplay: false,
            showRestaurantList: false,
            locationAlert: {
                text: '',
                isVisible: false
            },
            restaurantAlert: {
                text: '',
                isVisible: false
            },
            showResAddr: false,
        };
    }, // data
    // computed: { 
    //     derivedProperty() {
    //         return false;
    //     }  
    // }, // computed
    // created() { 
    // },
    // mounted() { 
    // },
    methods: {
        clearRestaurant() {            
            this.showResAddr = false;

            this.restaurantName = "";
            this.restaurantAddress = "";
        },
        getNearbyRestaurants() {
            var selectedLocation = document.getElementById("user-location").value;

            this.loadingDisplay = true;
            this.showRestaurantList = false;

            this.locationAlert.text = "";
            this.locationAlert.isVisible = false;

            this.restaurantAlert.text = "";
            this.restaurantAlert.isVisible = false;

            // Alert if user did not select their current location
            if (selectedLocation == "Select your school") {
                this.locationAlert.text = "Please select a delivery location!";
                this.locationAlert.isVisible = true;
                return;
            }
            else {
                if (selectedLocation.includes('/')) {
                    selectedLocation = selectedLocation.split('/')[0];
                }

                var data = {
                    location: "SMU%20" + selectedLocation,
                };

                axios.post(restaurant_url, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.status === 200) {
                        // Stop displaying loading
                        this.loadingDisplay = false;
                        restaurant_array = response.data;                        
                        if (restaurant_array && restaurant_array.length > 0) {
                            this.showRestaurantList = true;
                            this.restaurants = restaurant_array;
                        } else {
                            this.restaurantAlert.text = "No restaurants found nearby!";
                            this.restaurantAlert.isVisible = true;
                        }
                    }
                })
                .catch(function (error) {
                    console.error('Failed to retrieve restaurant data:', error);
                });

                // Hide first modal and display second
                var createModal = bootstrap.Modal.getInstance(document.getElementById('createModal'));
                createModal.hide();

                var restaurantModal = new bootstrap.Modal(document.getElementById('nearbyRestaurantModal'));
                restaurantModal.show();
            }
        },
        selectedRestaurant(restaurant) {
            // Store into vue data
            this.restaurantName = restaurant.name;
            this.restaurantAddress = restaurant.address;

            // Display address after selection
            this.showResAddr = true;

            // Store to add listing
            sessionStorage.setItem('lat', restaurant.lat);
            sessionStorage.setItem('lng', restaurant.lng);
            if (restaurant.photo !== null) {
                sessionStorage.setItem('restaurantImg', restaurant.photo);
            }
            else {
                sessionStorage.setItem('restaurantImg', '/img/restaurantDefault.png');
            }
        },
    } // methods
});
const vmListing = listing.mount('#app');