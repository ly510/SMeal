"use strict";

const rewardController = require('../controllers/rewardController');

function routeReward(app) {

    //This URL will authenticate by comparing passwords
    app.route('/rewards')
        .get(rewardController.getAllRewards);
}

module.exports = { routeReward };