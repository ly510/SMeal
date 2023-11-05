function load() {
    getAllRewards();
}

function getAllRewards() {
    var request = new XMLHttpRequest();
    request.open('GET', reward_url, true);

    request.onload = function () {
        if (request.status >= 200) {
            reward_array = JSON.parse(request.responseText);
            rewardCount = reward_array.length;
            displayRewards(reward_array);
        }
    };
    request.send();
}

function displayRewards(reward) {
    var container = document.querySelector(".rewards-container");

    container.innerHTML = "";

    for(var count = 0; count < reward.length; count++) {
        var rewardID = reward[count].rewardID;  
        var name = reward[count].name;
        var pointsReq = reward[count].pointsReq;
        var image_url = reward[count].img;

        var cell = `<div class="col-md-4">
                        <div class="card">
                            <img src="${image_url}" class="card-img-top" alt="Reward Image">
                            <div class="card-body">
                                <h5 class="card-title text-muted">${name}</h5>   
                                <h6 class="card-subtitle mb-2 text-muted">Points Required: ${pointsReq}</h6>
                            </div>
                        </div>
                    </div>`;             
    
        container.insertAdjacentHTML('beforeend', cell);
    }
}
