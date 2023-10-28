"use strict";

const listingController = require('../controllers/listingController');

function routeListing(app) {

    //This URL will authenticate by comparing passwords
    app.route('/listing')
        .get(listingController.getAllListing);

        
}

module.exports = { routeListing };