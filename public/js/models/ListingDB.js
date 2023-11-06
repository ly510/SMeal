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
    // Check if not userid not the creator of listing and the status is "Awaiting Acceptance"
    var sql = "SELECT * FROM smeal.Listing WHERE userId != ? AND status = 'Awaiting Acceptance'";

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


  getListingByListingId(listingId, callback) {
    var sql = `
      SELECT l.*, a.name
      FROM smeal.Listing l
      JOIN smeal.Accounts a ON l.userId = a.id
      WHERE l.listingId = ?
    `;

    db.query(sql, [listingId])
      .then(([rows, fields]) => {
        callback(null, rows);
      })
      .catch((error) => {
        callback(error, null);
      });
  }

changeListingStatus(listing, callback) {
    var sql;
    if (listing.getStatus() === "Listing Accepted"){
        const currentDate = new Date();
        sql = "UPDATE Listing SET status = ?, dateAccepted = ? ,fulfillerId = ? WHERE listingID = ?";
        db.query(sql, [listing.getStatus(), currentDate, listing.getFulfillerId(), listing.listingID])
        .then(([rows, fields]) => {
            callback(null, rows);
        })
        .catch((error) => {
            callback(error, null);
        });
    }
    else if (listing.getStatus() === "Awaiting Acceptance"){
        sql = "UPDATE Listing SET status = ?, dateAccepted = null, fulfillerId = ? WHERE listingID = ?";
        db.query(sql, [listing.getStatus(), listing.getFulfillerId(), listing.listingID])
        .then(([rows, fields]) => {
            callback(null, rows);
        })
        .catch((error) => {
            callback(error, null);
        });
    }
    else{
        sql = "UPDATE Listing SET status = ?, fulfillerId = ? WHERE listingID = ?";
        db.query(sql, [listing.getStatus(), listing.getFulfillerId(), listing.listingID])
        .then(([rows, fields]) => {
            callback(null, rows);
        })
        .catch((error) => {
            callback(error, null);
        });
    }

    // // Check if the status is "Listing Accepted"
    // if (listing.getStatus() === "Listing Accepted" || listing.getStatus() === "Awaiting Acceptance") {
    //     sql = "UPDATE Listing SET status = ?, fulfillerId = ? WHERE listingID = ?";

    //     db.query(sql, [listing.getStatus(), listing.getFulfillerId(), listing.listingID])
    //     .then(([rows, fields]) => {
    //         callback(null, rows);
    //     })
    //     .catch((error) => {
    //         callback(error, null);
    //     });
    // } else {
    //     sql = "UPDATE Listing SET status = ? WHERE listingID = ?;";

    //     db.query(sql, [listing.getStatus(), listing.listingID])
    //     .then(([rows, fields]) => {
    //         callback(null, rows);
    //     })
    //     .catch((error) => {
    //         callback(error, null);
    //     });
    // }
}

getListingByFulfillerId(fulfillerId, callback) {
  var sql = `
    SELECT l.*, a.name
    FROM smeal.Listing l
    JOIN smeal.Accounts a ON l.fulfillerId = a.id
    WHERE l.fulfillerId = ?
  `;

  db.query(sql, [fulfillerId])
    .then(([rows, fields]) => {
      callback(null, rows);
    })
    .catch((error) => {
      callback(error, null);
    });
}


}
  
  

module.exports = ListingDB;