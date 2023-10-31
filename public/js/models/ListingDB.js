"use strict";

var db = require('../../../db-connection'); //reference of db-connection.js

class ListingDB
{
  getAllListing(callback)
  {
      var sql = "SELECT * FROM smeal.Listing";

      // This is to call the built-in query function in the database connection
      db.query(sql)
          .then(([rows, fields]) => {
            callback(null, rows);
          })
          .catch((error) => {
            callback(error, null);
          });
      }

    addListing(listing, callback)
    {
      var sql = "INSERT into Listing (listingID, userID, title, description, location, restaurantName, paymentType, lat, lng, datePosted, fulfillerId, status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";

      var values = [
        listing.getListingID(),
        listing.getUserID(),
        listing.getTitle(),
        listing.getDescription(),
        listing.getLocation(),
        listing.getRestaurantName(),
        listing.getLat(),
        listing.getLng(),
        listing.getPaymentType(),
        listing.getDatePosted(),
        listing.getFulfillerId(),
        listing.getStatus()
      ];
    
      db.query(sql, values)
      .then(([rows, fields]) => {
        callback(null, rows);
      })
      .catch((error) => {
        callback(error, null);
      });
    }

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