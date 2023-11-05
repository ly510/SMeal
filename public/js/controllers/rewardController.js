"use strict";

const RewardsDB = require('../models/RewardsDB');
const Rewards = require('../models/Rewards');

var rewardsDB = new RewardsDB();

function getAllRewards(request, respond)
{
    //Call the getAllRewards() function in the RewardsDB class.
    rewardsDB.getAllRewards(function(error, result)
    {
        if(error){
            respond.json(error);
        } else {
            respond.json(result);
        }
    });
}

module.exports = { getAllRewards };