"use strict";

const accountsController = require('../controllers/accountsController');

function routeAccount(app) {

    app.route('/createAccount')
        .post(accountsController.createAccount);

    app.route('/login')
    .post(accountsController.login);

    app.route('/getUserPoints/:id')
    .get(accountsController.getUserPoints);
}

module.exports = { routeAccount };