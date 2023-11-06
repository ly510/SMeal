"use strict";

var db = require('../../../db-connection'); //reference of db-connection.js

class AccountsDB {
    
    createAccount(accountData, callback) {
        var sql = "INSERT into Accounts (name, email, password, phoneNo) VALUES(?, ?, ?, ?)";

        db.query(sql, [
            accountData.name,
            accountData.email,
            accountData.password,
            accountData.phoneNo
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

    getCurrentAccount(email, callback) {
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
            R.pointsReq AS rewardPointsReq,
            R.img AS rewardImg
        FROM 
            smeal.Accounts AS A
        LEFT JOIN 
            smeal.MyRewards AS MR ON A.id = MR.userId
        LEFT JOIN 
            smeal.Rewards AS R ON MR.rewardId = R.id
        WHERE 
            A.email = ?`;

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

    getUserPoints(userId, callback) {
        const sql = `SELECT points FROM smeal.Accounts WHERE id = ?`;
    
        db.query(sql, [userId])
            .then(([rows, fields]) => {
                if (rows.length > 0) {
                    const userPoints = rows[0].points;
                    callback(null, userPoints);
                } else {
                    callback(null, null);
                }
            })
            .catch((error) => {
                callback(error, null);
            });
    }

    updateUserPoints(pointsUpdate, callback) {
        const sql = 'UPDATE Accounts SET points = ? WHERE id = ?';
        db.query(sql, [pointsUpdate.points, pointsUpdate.id])
            .then(([rows, fields]) => {
                callback(null, rows);
            })
            .catch((error) => {
                callback(error, null);
            });
    }

    addReward(addUserReward, callback) {
        const sql = `INSERT INTO smeal.MyRewards (userId, rewardId) VALUES (?, ?)`;
    
        db.query(sql, [addUserReward.userId, addUserReward.rewardId])
            .then(([rows, fields]) => {
                callback(null, rows);
            })
            .catch((error) => {
                callback(error, null);
            });
    }
}

module.exports = AccountsDB;