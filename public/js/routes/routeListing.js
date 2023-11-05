"use strict";
require('dotenv').config();

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
    app.route('/restaurant')
        .post(listingController.getRestaurants);
    app.route('/foodlistingbylistingId/:listingID')
        .get(listingController.getListingByListingId);
    app.route('/changeListingStatus/:listingID')
        .put(listingController.changeListingStatus);
    
}

const googleMapsAPIKey = process.env.GOOGLE_API_KEY;
// const googleMapsAPIKey = "AIzaSyD16-5UR_uPSLvoTx6BJronXsho-r_S3Zo";
console.log(googleMapsAPIKey);

function loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

module.exports = { routeListing, loadGoogleMapsScript};