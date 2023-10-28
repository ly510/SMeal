"use strict";

var db = require('../../../db-connection'); //reference of db-connection.js

class ListingDB
{
    getAllListing(callback) {
        const sql = 'SELECT * FROM smeal.Listing';
      
        // Use the promise-based query method to execute the SQL query
        db.query(sql)
          .then(([rows, fields]) => {
            callback(null, rows);
          })
          .catch((error) => {
            callback(error, null);
          });
      }

    // addListing(Listing, callback)
    // {
    //     var sql = "INSERT into Listing (listingID, userID, title, description, location, restaurantName, lat, long, paymentType, datePosted, fulfillerId, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    //     db.query(sql, [
    //         Listing.getListingId(),
    //         Listing.getUserId(),
    //         Listing.getTitle(),
    //         Listing.getDescription(),
    //         Listing.getLocation(),
    //         Listing.getRestaurantName(),
    //         Listing.getLat(),
    //         Listing.getLong(),
    //         Listing.getPaymentType(),
    //         Listing.getDatePosted(),
    //         Listing.getFulfillerId(),
    //         Listing.getStatus()
    //     ], callback);
    // }

    // updateListing(Listing, callback)
    // {
    //     var sql = "UPDATE Listing SET title = ?, description = ?, location = ?, restaurantName = ?, paymentType = ?, datePosted = ? WHERE listingID = ?";

    //     return db.query(sql, [
    //         Listing.getTitle(),
    //         Listing.getDescription(),
    //         Listing.getLocation(),
    //         Listing.getRestaurantName(),
    //         Listing.getPaymentType(),
    //         Listing.getDatePosted(),
    //         Listing.getListingId()
    //     ], callback);
    // }
    
    // deleteListing(ListingID, callback)
    // {
    //     var sql = "DELETE from Listing WHERE listingID = ?";
        
    //     return db.query(sql, [ListingID], callback);
    // }
    
}

module.exports = ListingDB;