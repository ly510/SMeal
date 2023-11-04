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

function addListing(request, respond)
{
    var now = new Date();
    var listing = new Listing(parseInt(request.body.listingID),parseInt(request.body.userID), request.body.title, request.body.description, request.body.location, request.body.restaurantName, request.body.paymentType, request.body.lat, request.body.lng, formatDate(now), null, request.body.status);
    
    listingDB.addListing(listing, function(error, result)
    {
        if(error){
            respond.json(error);
        } else {
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

async function getRestaurants(request, respond) {
    try {
        const location = request.body.location;
        const latLng = await getLatLng(location);

        const query = `https://places.googleapis.com/v1/places:searchNearby?key=` + process.env.GOOGLE_API_KEY;
        const data = {
            "includedPrimaryTypes": ["restaurant"],
            "rankPreference": "DISTANCE",
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": latLng[0],
                        "longitude": latLng[1]
                    },
                    "radius": 1000.0
                }
            }
        };

        const response = await axios.post(query, data, {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-FieldMask': 'places.formattedAddress,places.location,places.displayName.text,places.currentOpeningHours.openNow,places.photos,places.takeout'
            }
        });

        if (response.status == 200) {
            const results = response.data.places;
            const restaurants = [];

            for (let i = 0; i < results.length; i++) {
                // Check if opened and can takeout
                if (results[i].currentOpeningHours && results[i].currentOpeningHours.openNow === true && results[i].takeout == true) {
                    const restaurant = {
                        name: results[i].displayName.text,
                        address: results[i].formattedAddress,
                        lat: results[i].location.latitude,
                        lng: results[i].location.longitude,
                        photos: results[i].photos && results[i].photos.length > 0 ? results[i].photos[0].name : null
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
        const lat = 0;
        const lng = 0;

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

module.exports = { getAllListing, addListing, getRestaurants };