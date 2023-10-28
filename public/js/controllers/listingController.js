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

module.exports = { getAllListing };