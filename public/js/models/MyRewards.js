"use strict";

class MyRewards{
constructor(userId, rewardId){
    this.userId = userId;
    this.rewardId = rewardId;
}

getUserId(){
    return this.userId;
}

getRewardId(){
    return this.rewardId;
}

setUserId(userId){
    this.userId = userId;
}

setRewardId(rewardId){
    this.rewardId = rewardId;
}

}

module.exports = MyRewards;