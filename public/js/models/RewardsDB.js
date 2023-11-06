"use strict";

var db = require('../../../db-connection'); //reference of db-connection.js

class RewardsDB
{
  getAllRewards(callback)
  {
      var sql = "SELECT * FROM smeal.Rewards";

      // This is to call the built-in query function in the database connection
      db.query(sql)
          .then(([rows, fields]) => {
            callback(null, rows);
          })
          .catch((error) => {
            callback(error, null);
          });
      }

    // For points deduction
    getReqPoints(rewardID, callback) {
      var sql = "SELECT pointsReq FROM smeal.Rewards WHERE id = ?";

      db.query(sql, [rewardID])
          .then(([rows, fields]) => {
              callback(null, rows[0].pointsReq);
          })
          .catch((error) => {
              callback(error, null);
          });
    }

  }

module.exports = RewardsDB;