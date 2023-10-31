"use strict";

const accountsController = require('../controllers/accountsController');

function routeAccount(app) {

    app.route('/createAccount')
        .post(accountsController.createAccount);
}

module.exports = { routeAccount };