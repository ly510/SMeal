
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
            '<button class="btn btn-info my-2" data-listing-id="' + listingID + '">View More</button>' +
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
    console.log(room);
    if (room.length === 0) {
        room = "-No Room Specified-";
        document.getElementById('modalListingRoom').style.color = 'grey';
    }
    document.getElementById('modalListingRoom').textContent = room;
    document.getElementById('modalListingTitle').textContent = details[0].title;
    document.getElementById('modalListingDesc').textContent = details[0].description;
    document.getElementById('modalListingRName').textContent = details[0].restaurantName;
    document.getElementById('modalListingLat').textContent = details[0].lat;
    document.getElementById('modalListingLng').textContent = details[0].lng;

    sessionStorage.setItem("currentListingID", details[0].listingID);

    // Display Google Map
    var lat = parseFloat(details[0].lat);
    var lng = parseFloat(details[0].lng);
    displayMap(lat, lng, details[0].restaurantName);

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


// Click on accept listing button
var acceptListingButton = document.getElementById('acceptListingButton');
if(acceptListingButton){
document.addEventListener('DOMContentLoaded', function () {
    var acceptListingButton = document.querySelector('[name="acceptListingButton"]');
    acceptListingButton.addEventListener('click', function () {
        console.log("clicked");
        // Prompt the user for confirmation
        var confirmationModal = new bootstrap.Modal(document.getElementsByName('confirmationModal')[0]);
        confirmationModal.show();

        // Set up event listener for the confirmation button
        var confirmButton = document.getElementById('confirmButton');
        confirmButton.addEventListener('click', function () {
            var listingId = sessionStorage.getItem("currentListingID");
            handleAcceptListing(listingId);
            confirmationModal.hide();
        });
    });
});
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

const listing = Vue.createApp({
    data() {
        return {
            restaurants: [],
            restaurantName: "",
            restaurantAddress: "",
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
            var resAddr = document.getElementById('resAddr');
            var restaurantAddress = document.getElementById('restaurantAddress');
            
            resAddr.setAttribute('hidden', true);
            restaurantAddress.setAttribute('hidden', true);

            this.restaurantName = "";
            this.restaurantAddress = "";
        },
        getNearbyRestaurants() {
            var restaurantList = document.getElementById("restaurantList");
            var selectedLocation = document.getElementById("user-location").value;
            var locationAlert = document.getElementById("locationAlert");
            var restaurantAlert = document.getElementById("restaurantAlert");
            var loadingDisplay = document.getElementById("loadingDisplay");

            loadingDisplay.classList.remove('d-none');
            restaurantList.classList.add('d-none');

            locationAlert.innerText = "";
            locationAlert.classList.add('d-none');

            restaurantAlert.innerText = "";
            restaurantAlert.classList.add('d-none');

            // Alert if user did not select their current location
            if (selectedLocation == "Select your school") {
                locationAlert.innerText = "Please select a delivery location!";
                locationAlert.classList.remove('d-none');
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
                        loadingDisplay.classList.add('d-none');
                        
                        restaurant_array = response.data;
                        
                        if (restaurant_array && restaurant_array.length > 0) {
                            restaurantList.classList.remove('d-none');
                            this.restaurants = restaurant_array;
                        } else {
                            restaurantAlert.innerText = "No restaurants found nearby!";
                            restaurantAlert.classList.remove('d-none');
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
            document.getElementById('resAddr').removeAttribute('hidden');
            document.getElementById('restaurantAddress').removeAttribute('hidden');

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