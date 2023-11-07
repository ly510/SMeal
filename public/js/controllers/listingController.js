"use strict";

const axios = require('axios');
const ListingDB = require('../models/ListingDB');
const Listing = require('../models/Listing');

var listingDB = new ListingDB();

function getAllListing(request, respond)
{
    //Call the getAllListing() function in the ListingDB class.
    listingDB.getAllListing(function(error, result)
    {
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}
// Import the sendSMS function
const { sendSMS } = require('../notification.js');

function addListing(request, respond)
{
    var now = new Date();
    var listing = new Listing(null, parseInt(request.body.userId), request.body.title, request.body.description, request.body.location, request.body.room, request.body.restaurantName, request.body.paymentType, request.body.lat, request.body.lng, request.body.img, formatDate(now), null, request.body.status);
    var phoneNo = request.body.phoneNo;

    listingDB.addListing(listing, function(error, result)
    {
        if(error){
            respond.json(error);
        } else {

            // Define the message body
            const messageBody = 'Your listing has been created. Please wait for a fulfiller to accept your listing.';
            // Send the SMS message
            sendSMS(messageBody, phoneNo);
            respond.json(result);
        }
    });
}

function formatDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');

    var hour = date.getHours().toString().padStart(2, '0');
    var minute = date.getMinutes().toString().padStart(2, '0');
    var second = date.getSeconds().toString().padStart(2, '0');

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

function getListingByUserID(request, respond){
    var userId = parseInt(request.params.userId);

    listingDB.getListingByUserID(userId, function(error, result){
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

function getListingNotByUserID(request, respond){
    var userId = parseInt(request.params.userId);

    listingDB.getListingNotByUserID(userId, function(error, result){
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

function cancelListing(request, respond){
    var status = "Cancelled";
    var tocancel = new Listing(parseInt(request.params.listingID),null,null,null,null,null,null,null,null,null,null,null,null,status);
    var phoneNo = request.body.phoneNo;
    listingDB.cancelListing(tocancel, function(error, result){
        if(error){
            respond.json(error);
        } else {
            // Define the message body
            const messageBody = 'Your listing has been successfully cancelled.';
            // Send the SMS message
            sendSMS(messageBody, phoneNo);
            respond.json(result);
        }
    });
}

function deleteListing(request, respond)
{
    var listingID = parseInt(request.params.listingID);
    var phoneNo = request.body.phoneNo;

    listingDB.deleteListing(listingID, function(error, result)
    {
        if(error){
            respond.json(error);
        } else {
            // Define the message body
            const messageBody = 'Your listing has been deleted. Hope to see you with SMEAL again! Have a great day~';
            // Send the SMS message
            sendSMS(messageBody, phoneNo);

            respond.json(result);
        }
    });
}

async function getRestaurants(request, respond) {
    try {
        const location = request.body.location;
        const latLng = await getLatLng(location);

        const query = `https://places.googleapis.com/v1/places:searchNearby?key=` + process.env.GOOGLE_API_KEY;
        const data = {
            "includedPrimaryTypes": ["restaurant"],
            "includedTypes": ["restaurant", "fast_food_restaurant", "cafe", "bakery", "meal_takeaway", "coffee_shop"],
            "rankPreference": "DISTANCE",
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": latLng[0],
                        "longitude": latLng[1]
                    },
                    "radius": 2000.0
                }
            }
        };

        const response = await axios.post(query, data, {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-FieldMask': 'places.formattedAddress,places.location,places.displayName.text,places.currentOpeningHours.openNow,places.photos,places.takeout,places.rating'
            }
        });

        if (response.status == 200) {
            const results = response.data.places;
            const restaurants = [];
            var restaurantImg = null;
            var restaurantRating = null;

            for (let i = 0; i < results.length; i++) {
                // Check if opened and can takeout
                if (results[i].currentOpeningHours && results[i].currentOpeningHours.openNow === true && results[i].takeout == true) {
                    // Set image if any
                    if (results[i].photos && results[i].photos.length > 0) {
                        restaurantImg = await obtainImage(results[i].photos[0].name);
                    }
                    else {
                        restaurantImg = null;
                    }

                    if (results[i].rating) {
                        restaurantRating = results[i].rating;
                    } 
                    else {
                        restaurantRating = "No rating available";
                    }

                    const restaurant = {
                        name: results[i].displayName.text,
                        address: results[i].formattedAddress,
                        rating: restaurantRating,
                        lat: results[i].location.latitude,
                        lng: results[i].location.longitude,
                        photo: restaurantImg
                    };

                    restaurants.push(restaurant);
                }
            }
            respond.json(restaurants);
        }

    } catch (error) {
        console.error(error);
    }
}

async function getLatLng(location) {
    try {
        const query = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Cgeometry&input=${location}&inputtype=textquery&key=` + process.env.GOOGLE_API_KEY;
        const response = await axios.post(query, null, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.data.candidates.length >= 1) {
            const lat = response.data.candidates[0].geometry.location.lat;
            const lng = response.data.candidates[0].geometry.location.lng;
            return [lat, lng];
        }
    } catch (error) {
        console.error(error);
    }

    return;
}

async function obtainImage(imgName) {
    try {
        const query = `https://places.googleapis.com/v1/${imgName}/media?maxHeightPx=400&maxWidthPx=400&key=` + process.env.GOOGLE_API_KEY;

        const response = await axios.get(query)

        if (response.status == 200) {
            return response.request.res.responseUrl;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error(error);
    }
}

function getListingByListingId(request, respond){
    var listingID = parseInt(request.params.listingID);
    listingDB.getListingByListingId(listingID, function(error, result){
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

function changeListingStatus(request, respond) {
    var listingID = parseInt(request.params.listingID);
    var status = request.body.status;

    var fulfillerId = request.body.fulfillerId;
    var toChangeStatus = new Listing(listingID, null, null, null, null, null, null, null, null, null, null, null, fulfillerId, status, null);
    listingDB.changeListingStatus(toChangeStatus, function (error, result) {
        if (error) {
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

function getListingByFulfillerId(request, respond){
    var fulfillerId = parseInt(request.params.fulfillerId);
    listingDB.getListingByFulfillerId(fulfillerId, function(error, result){
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

function changeListingPrice(request, respond) {
    var listingID = parseInt(request.params.listingID);
    var price = request.body.price;
    var toChangePrice = new Listing(listingID, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, price);
    listingDB.changeListingPrice(toChangePrice, function (error, result) {
        if (error) {
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

function changePaymentStatus(request, respond) {
    console.log(request);
    var listingID = parseInt(request.params.listingID);
    var paymentStatus = request.body.paymentStatus;
    var toChangePayStatus = new Listing(listingID, null, null, null, null, null, null, null, null, null, null, null, null, null, paymentStatus, null, null);
    listingDB.changePaymentStatus(toChangePayStatus, function (error, result) {
        if (error) {
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}



module.exports = { getAllListing, addListing, getListingByUserID, getListingNotByUserID, cancelListing, deleteListing, getRestaurants, 
    getListingByListingId, changeListingStatus, getListingByFulfillerId, changeListingPrice, changePaymentStatus};