"use strict";

class Listing{
constructor(listingID, userID, title, description, location, restaurantName, lat, long, paymentType, datePosted, fulfillerId, status){
    this.listingID = listingID;
    this.userID = userID;
    this.title = title;
    this.description = description;
    this.location = location;
    this.restaurantName = restaurantName;
    this.lat = lat;
    this.long = long;
    this.paymentType = paymentType;
    this.datePosted = datePosted;
    this.fulfillerId = fulfillerId;
    this.status = status;
}

getListingID(){
    return this.listingID;
}

getUserID(){
    return this.userID;
}

getTitle(){
    return this.title;
}

getDescription(){
    return this.description;
}

getLocation(){
    return this.location;
}

getRestaurantName(){
    return this.restaurantName;
}

getLat(){
    return this.lat;
}

getLong(){
    return this.long;
}

getPaymentType(){
    return this.paymentType;
}

getDatePosted(){
    return this.datePosted;
}

getFulfillerId(){
    return this.fulfillerId;
}

getStatus(){
    return this.status;
}

setListingID(listingID){
    this.listingID = listingID;
}

setUserID(userID){
    this.userID = userID;
}


setTitle(title){
    this.title = title;
}

setDescription(description){
    this.description = description;
}

setLocation(location){
    this.location = location;
}

setRestaurantName(restaurantName){
    this.restaurantName = restaurantName;
}

setLat(lat){
    this.lat = lat;
}

setLong(long){
    this.long = long;
}

setPaymentType(paymentType){
    this.paymentType = paymentType;
}

setDatePosted(datePosted){
    this.datePosted = datePosted;
}

setFulfillerId(fulfillerId){
    this.fulfillerId = fulfillerId;
}

setStatus(status){
    this.status = status;
}

}

module.exports = Listing;