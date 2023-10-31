"use strict";

const profileController = require('../controllers/accountsController');

function routeProfile(app) {

    app.route('/user-profile')
        .get(profileController.getCurrentAccount);

    app.route('/edit-profile')
        .get(profileController.getCurrentAccount)
        .put(profileController.updateAccountProfile);
}

module.exports = { routeProfile };