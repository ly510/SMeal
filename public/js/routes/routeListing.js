"use strict";

const listingController = require('../controllers/listingController');

function routeListing(app) {

    //This URL will authenticate by comparing passwords
    app.route('/listing')
        .get(listingController.getAllListing)
    app.route('/addListing')
        .post(listingController.addListing);
}

module.exports = { routeListing };