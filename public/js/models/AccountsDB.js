"use strict";

var db = require('../../../db-connection'); //reference of db-connection.js

class AccountsDB
{
	createAccount(accountData, callback) {
        var sql = "INSERT into Accounts (email, password) VALUES(?, ?)";

        db.query(sql, [
            accountData.email,
            accountData.password
        ], callback);
    }
}

module.exports = AccountsDB;