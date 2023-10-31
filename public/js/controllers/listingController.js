"use strict";

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



module.exports = { getAllListing, addListing };