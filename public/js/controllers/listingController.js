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
    var listing = new Listing(null, parseInt(request.body.userId), request.body.title, request.body.description, request.body.location, request.body.room, request.body.restaurantName, request.body.paymentType, request.body.lat, request.body.lng, formatDate(now), null, request.body.status);
    
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
    var tocancel = new Listing(parseInt(request.params.listingID),null, null, null, null, null, null, null, null, null, null, null, status);
    listingDB.cancelListing(tocancel, function(error, result){
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

function deleteListing(request, respond)
{
    var listingID = parseInt(request.params.listingID);


    listingDB.deleteListing(listingID, function(error, result)
    {
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

module.exports = { getAllListing, addListing, getListingByUserID, getListingNotByUserID, cancelListing, deleteListing };