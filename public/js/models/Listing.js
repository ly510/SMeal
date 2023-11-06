"use strict";

class Listing{
constructor(listingID, userId, title, description, location, room, restaurantName, paymentType, lat, lng, img, datePosted, fulfillerId, status, paymentStatus, dateAccepted, price){
    this.listingID = listingID;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.location = location;
    this.room = room;
    this.restaurantName = restaurantName;
    this.paymentType = paymentType;
    this.lat = lat;
    this.lng = lng;
    this.img = img;
    this.datePosted = datePosted;
    this.fulfillerId = fulfillerId;
    this.status = status;
    this.paymentStatus = paymentStatus;
    this.dateAccepted = dateAccepted;
    this.price = price;
}

getListingID(){
    return this.listingID;
}

getUserID(){
    return this.userId; 
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

getRoom(){
    return this.room;
}

getRestaurantName(){
    return this.restaurantName;
}

getLat(){
    return this.lat;
}

getLng(){
    return this.lng;
}

getImg(){
    return this.img;
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

getPaymentStatus(){
    return this.paymentStatus;
}

getDateAccepted(){
    return this.dateAccepted;
}

getPrice(){
    return this.price;
}

setListingID(listingID){
    this.listingID = listingID;
}

setUserID(userId){
    this.userId = userId;
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

setRoom(room){
    this.room = room;
}

setRestaurantName(restaurantName){
    this.restaurantName = restaurantName;
}

setLat(lat){
    this.lat = lat;
}

setLng(lng){
    this.lng = lng;
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

setPaymentStatus(paymentStatus){
    this.paymentStatus = this.paymentStatus;
}

setDateAccepted(dateAccepted){
    this.dateAccepted = dateAccepted;
}

setPrice(price){
    this.price = price;
}


}

module.exports = Listing;