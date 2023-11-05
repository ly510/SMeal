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
    var sql = "INSERT into Listing (userId, title, description, location, room, restaurantName, paymentType, lat, lng, img, datePosted, fulfillerId, status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";

    var values = [
      listing.getUserID(),
      listing.getTitle(),
      listing.getDescription(),
      listing.getLocation(),
      listing.getRoom(),
      listing.getRestaurantName(),
      listing.getPaymentType(),
      listing.getLat(),
      listing.getLng(),
      listing.getImg(),
      new Date(),
      listing.getFulfillerId(),
      "Awaiting Acceptance",
    ];
  
    console.log(values);
    db.query(sql, values)
    .then(([rows, fields]) => {
      callback(null, rows);
    })
    .catch((error) => {
      callback(error, null);
    });
  }

  
  cancelListing(tocancel, callback)
  {
    var sql = "UPDATE Listing SET status = ? WHERE listingID = ?";
    
    db.query(sql, [tocancel.getStatus(),tocancel.listingID])
    .then(([rows, fields]) => {
      callback(null, rows);
    })
    .catch((error) => {
      callback(error, null);
    });
  }
  
  
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