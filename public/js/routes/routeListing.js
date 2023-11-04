"use strict";

const listingController = require('../controllers/listingController');

function routeListing(app) {

    //This URL will authenticate by comparing passwords
    app.route('/listing')
        .get(listingController.getAllListing);
    app.route('/foodlisting/:userId')
        .get(listingController.getListingNotByUserID);
    app.route('/listing/:userId')
        .get(listingController.getListingByUserID)
    app.route('/listing/:listingID')
        .put(listingController.cancelListing);
    app.route('/addListing')
        .post(listingController.addListing);
    app.route('/deleteListing/:listingID')
        .delete(listingController.deleteListing);
    
}

module.exports = { routeListing };