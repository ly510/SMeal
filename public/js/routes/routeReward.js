"use strict";

const rewardController = require('../controllers/rewardController');

function routeReward(app) {

    //This URL will authenticate by comparing passwords
    app.route('/rewards')
        .get(rewardController.getAllRewards);
    app.route('/getReqPoints/:id')
        .get(rewardController.getReqPoints);
    
}

module.exports = { routeReward };