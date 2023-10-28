"use strict";

class Rewards{
constructor(id, name, description, pointsReq){
    this.id = id;
    this.name = name;
    this.description = description;
    this.pointsReq = pointsReq;
}

getId(){
    return this.id;
}

getName(){
    return this.name;
}

getDescription(){
    return this.description;
}

getPointsReq(){
    return this.pointsReq;  
}

setId(id){
    this.id = id;
}

setName(name){
    this.name = name;
}

setDescription(description){
    this.description = description;
}

setPointsReq(pointsReq){
    this.pointsReq = pointsReq;
}

}

module.exports = Rewards;