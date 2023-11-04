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

  // This function is for food listing page
  getListingByUserID(userId, callback)
  {
    var sql = "SELECT * FROM smeal.Listing WHERE userId = ?";

    db.query(sql, [userId])
    .then(([rows, fields]) => {
      callback(null, rows);
    })
    .catch((error) => {
      callback(error, null);
    });
  }

  getListingNotByUserID(userId, callback)
  {
    var sql = "SELECT * FROM smeal.Listing WHERE userId != ?";

    db.query(sql, [userId])
    .then(([rows, fields]) => {
      callback(null, rows);
    })
    .catch((error) => {
      callback(error, null);
    });
  }

  // This function is for my listing page where user creates a new listing
  addListing(listing, callback)
  {
    var sql = "INSERT into Listing (listingID, userId, title, description, location, room, restaurantName, paymentType, lat, lng, datePosted, fulfillerId, status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";

    var values = [
      listing.getListingID(),
      listing.getUserID(),
      listing.getTitle(),
      listing.getDescription(),
      listing.getLocation(),
      listing.getRoom(),
      listing.getRestaurantName(),
      listing.getLat(),
      listing.getLng(),
      listing.getPaymentType(),
      new Date(),
      listing.getFulfillerId(),
      "Awaiting Acceptance",
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
  
  deleteListing(listingID, callback)
  {
      var sql = "DELETE from Listing WHERE listingID = ?";
      
      db.query(sql, [listingID])
      .then(([rows, fields]) => {
        callback(null, rows);
      })
      .catch((error) => {
        callback(error, null);
      });
    }
  
}

module.exports = ListingDB;