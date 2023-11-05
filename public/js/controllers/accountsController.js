"use strict";

const req = require('express/lib/request');
const Accounts = require('../models/Accounts');
const AccountsDB = require('../models/AccountsDB');

const fs = require('fs');
const path = require('path');

var accountsDB = new AccountsDB();

//This function creates a user
function createAccount(request, respond) {
    var users = new Accounts(null, request.body.name, request.body.email, request.body.password, request.body.phoneNo, null);

    accountsDB.createAccount(users, function(error, result)
    {
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

//Login function which will check if account found and password match
function login(request, respond){
    var email = request.body.email.trim().toLowerCase();
    var pw = request.body.pw;
    var msg = "";

    //check if all fields fillled
    if (email == "" || pw == ""){
        msg = "Please fill in all fields";
        console.log(msg);
        respond.json(prepMessage(msg));
    }
    
    if (email) {
        accountsDB.login(email, function(error, result){
            if(error) {
                respond.json(error);
            } else {
                if (result.length > 0){
                    if (pw == result[0].password){
                        msg = 1; // "Success!";
                        console.log(msg);
                        // Include user information in the response
                        const userInfo = {
                            id: result[0].id,
                            email: result[0].email,
                            name: result[0].name,
                            img: result[0].img,
                            phoneNo: result[0].phoneNo
                        };
                        respond.json(prepMessage(msg, userInfo));
                    } else{
                        msg = "Incorrect Password!";
                        console.log(msg);
                        respond.json(prepMessage(msg));
                    }
                } else{
                    // If user not found, result has no record
                    msg ="Account not found!";
                    respond.json(prepMessage(msg));
                }
            }
        });
    }
}

//This function creates a custom message to be sent back to the client
function prepMessage(msg, userInfo = {}) {
    var obj = {
        "message" : msg,
        data: userInfo
    };
    return obj;
}

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

//This function get the current user's details.
function getCurrentAccount(request, respond){
    var email = request.body.email;
    
    if (email) {
        accountsDB.getCurrentAccount(email, function(error, result){
            if(error) {
                respond.json(error);
            } else {
                respond.json(result);
            }
        });
    }
}

//This function updates the users details except email and password and userId
function updateAccountProfile(request, respond) {
    var userId = request.body.id;
    const updateType = request.query.type;

    // to change to check if originally no img and update to no img also
    if (updateType == "profile") {
        const imageBase64 = request.body.img;
        if (imageBase64) {
            const matches = imageBase64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const imageType = matches[1];
                const imageBuffer = Buffer.from(matches[2], 'base64');

                // Set file name
                const fileName = 'profile-pic-' + userId;
                const imagePath = path.join('public/img', `${fileName}.${imageType}`);

                // Save the image
                fs.writeFileSync(imagePath, imageBuffer, 'base64');
                console.log('Image saved successfully!');

                // Update DB
                var newProfile = new Accounts(
                    null,
                    request.body.name,
                    null,
                    null,
                    request.body.phoneNo,
                    "/img/" + fileName + "." + imageType,
                    null
                );

                accountsDB.updateAccountProfile(userId, newProfile, function (error, result) {
                    if (error) {
                        respond.json(error);
                    } else {
                        respond.json(result);
                    }
                });
            } else {
                respond.json({ error: "Invalid image data" });
            }
        } else {
            // Update DB without img
            var newProfile = new Accounts(
                null,
                request.body.name,
                null,
                null,
                request.body.phoneNo,
                null,
                null
            );

            accountsDB.updateAccountProfile(userId, newProfile, function (error, result) {
                if (error) {
                    respond.json(error);
                } else {
                    respond.json(result);
                }
            });
        }
    }
    else if (updateType == "password") {
        var newPass = new Accounts(null, null, null, request.body.password, null, null, null);

        accountsDB.updateAccountPassword(userId, newPass, function(error, result)
        {
            if(error){
                respond.json(error);
            } else {
                respond.json(result);
            }
        });
    }
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


module.exports = { createAccount, login, getAllAccounts, getCurrentAccount, updateAccountProfile, deleteAccount};