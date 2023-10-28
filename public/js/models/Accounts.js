"use strict";

class Accounts{
constructor(id, name, email, password, phoneNo, img, points){
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNo = phoneNo;
    this.img = img;
    this.points = points;
}

getId(){
    return this.id;
}

getName(){
    return this.name;
}

getEmail(){
    return this.email;
}

getPassword(){
    return this.password;
}

getPhoneNo(){
    return this.phoneNo;
}

getImg(){
    return this.img;
}

getPoints(){
    return this.points;
}

setId(id){
    this.id = id;
}

setName(name){
    this.name = name;
}

setEmail(email){
    this.email = email;
}

setPassword(password){
    this.password = password;
}

setPhoneNo(phoneNo){
    this.phoneNo = phoneNo;
}

setImg(img){
    this.img = img;
}

setPoints(points){
    this.points = points;
}

}


module.exports = Accounts;