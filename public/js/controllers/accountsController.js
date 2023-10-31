"use strict";

const Accounts = require('../models/Accounts');
const AccountsDB = require('../models/AccountsDB');

var accountsDB = new AccountsDB();

//This function authenticates by comparing the input password and pass from the database.
function authenticate(request, respond) 
{
    var input_email = request.body.email; //email from user input
    var input_password = request.body.pw;
    var msg = "";

    //Call the getLoginCredentials function from AccountsDB
    accountsDB.getLoginCredentials(input_email, function(error, result){
        if(error) {
            respond.json(error);
        } else {
            //If user can be found, result has one record
            if (result.length > 0) {
                if (input_password == result[0].password) {
                    msg = "1"; // "Success!";
                    console.log(msg);
                } else {
                    msg = "Login Fail!";
                    console.log(msg);
                }
            } else { 
            // If user not found, result has no record
                msg ="Account not found!";
            }

                respond.json(prepareMessage(msg));
        }
    });
}

//This function creates a custom message to be sent back to the client
function prepareMessage(msg) {
    var obj = {"message" : msg };

    return obj;
}

// //This function authenticates by using the database to look for the
// // requested email and password.
// function authenticateByDB(request, respond) {
//     var input_email = request.body.email;
//     var input_password = request.body.pw;
//     var msg = "";

//     accountsDB.authenticateByDB(request.body.email, request.body.pw, function(error, result){
//         if(error) {
//             respond.json(error);
//         } else {
//             //If the record can be found, the result will have one item
//             // else it will have no item.
//             if (result.length > 0) {
//                 msg = "Success";
//             } else {!
//                 msg = "Fail!";
//             }

//             respond.json(prepareMessage(msg));
//         }
//     });
// }

//This function get all users details.
function getAllAccounts(request, respond){
    //Call the getAllAccounts() function in the AccountsDB class.
    accountsDB.getAllAccounts(function(error, result){
        if(error) {
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

//This function creates a user
function createAccount(request, respond) {
    var users = new Accounts(null, request.body.name, request.body.email, request.body.password, null, null);

    accountsDB.createAccount(users, function(error, result)
    {
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

//This function updates the users details except email and password and userId
function updateAccountProfile(request, respond){
    var users = new Accounts(null, request.body.name, request.body.email, request.body.password, request.body.gender, request.body.birthday, request.body.email);

    accountsDB.updateAccountProfile(users, function(error, result)
    {
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

//This function is to delete user profile.
function deleteAccount(request, respond)
{
    var usersID = request.params.userId;
    accountsDB.deleteAccount(usersID, function(error, result){
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

module.exports = { authenticate, getAllAccounts, createAccount, updateAccountProfile, deleteAccount };