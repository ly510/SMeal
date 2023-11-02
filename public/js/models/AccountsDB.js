"use strict";

var db = require('../../../db-connection'); //reference of db-connection.js

class AccountsDB {
    
    createAccount(accountData, callback) {
        var sql = "INSERT into Accounts (email, password) VALUES(?, ?)";

        db.query(sql, [
            accountData.email,
            accountData.password
        ], callback);
    }

    login(email, callback) {
        const sql = `SELECT * FROM smeal.Accounts WHERE email = ?`;

        // Use the promise-based query method to execute the SQL query
        db.query(sql, [email])
            .then(([rows, fields]) => {
                callback(null, rows);
            })
            .catch((error) => {
                callback(error, null);
            });
    }

    updateAccountProfile(userId, newProfile, callback) {
        const sql = `UPDATE smeal.Accounts 
    SET name = ?, phoneNo = ?, img = ?
    WHERE id = ?`;

        // Values that need to be updated
        const { name, phoneNo, img } = newProfile;

        // Use the promise-based query method to execute the SQL query
        db.query(sql, [name, phoneNo, img, userId])
            .then(([rows, fields]) => {
                callback(null, rows);
            })
            .catch((error) => {
                callback(error, null);
            });
    }

    getCurrentAccount(userId, callback) {
        const sql = `SELECT 
            A.id AS userId, 
            A.name AS userName, 
            A.email AS userEmail, 
            A.password AS userPassword, 
            A.phoneno AS userPhone, 
            A.img AS userImg, 
            A.points AS userPoints, 
            R.id AS rewardId, 
            R.name AS rewardName, 
            R.description AS rewardDesc, 
            R.pointsReq AS rewardPointsReq
        FROM 
            smeal.Accounts AS A
        LEFT JOIN 
            smeal.MyRewards AS MR ON A.id = MR.userId
        LEFT JOIN 
            smeal.Rewards AS R ON MR.rewardId = R.id
        WHERE 
            A.id = ?`;

        // Use the promise-based query method to execute the SQL query
        db.query(sql, [userId])
            .then(([rows, fields]) => {
                callback(null, rows);
            })
            .catch((error) => {
                callback(error, null);
            });
    }

    updateAccountProfile(userId, newProfile, callback) {
        const sql = `UPDATE smeal.Accounts 
    SET name = ?, phoneNo = ?, img = ?
    WHERE id = ?`;

        // Values that need to be updated
        const { name, phoneNo, img } = newProfile;

        // Use the promise-based query method to execute the SQL query
        db.query(sql, [name, phoneNo, img, userId])
            .then(([rows, fields]) => {
                callback(null, rows);
            })
            .catch((error) => {
                callback(error, null);
            });
    }

    updateAccountPassword(userId, newPass, callback) {
        const sql = `UPDATE smeal.Accounts 
        SET password = ?
        WHERE id = ?`;

        // Values that need to be updated
        const { password } = newPass;

        // Use the promise-based query method to execute the SQL query
        db.query(sql, [password, userId])
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

module.exports = AccountsDB;