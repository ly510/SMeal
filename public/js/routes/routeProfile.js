"use strict";

const profileController = require('../controllers/accountsController');

function routeProfile(app) {

    app.route('/user-profile')
        .post(profileController.getCurrentAccount);

    app.route('/edit-profile')
        .post(profileController.getCurrentAccount)
        .put(profileController.updateAccountProfile);
}

module.exports = { routeProfile };