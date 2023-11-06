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
        console.log('rewardID:', rewardID);
        var name = reward[count].name;
        var pointsReq = reward[count].pointsReq;
        var image_url = reward[count].img;

        var cell = document.createElement('div');
        cell.className = "col-md-4";
        cell.innerHTML = `
            <div class="card">
                <img src="${image_url}" class="card-img-top" alt="Reward Image">
                <div class="card-body">
                    <h5 class="card-title text-muted">${name}</h5>   
                    <h6 class="card-subtitle mb-2 text-muted">Points Required: ${pointsReq}</h6>
                </div>
            </div>`;          
    
        (function(rewardID, name, pointsReq, image_url){
            cell.addEventListener('click', function() {
            // Open the modal and update it with the card's details
                openModal(rewardID, name, pointsReq, image_url);
            });
        })(rewardID, name, pointsReq, image_url);
        container.appendChild(cell);
    } 
}

function openModal(rewardID, name, pointsReq, image_url) {
    // Update the modal with the card's details
    document.getElementById('modal-title').textContent = name;
    document.getElementById('modal-img').src = image_url;
    document.getElementById('modal-pointsReq').textContent = `Points Required: ${pointsReq}`;

    // Fetch the user's points from the server
    var userId = sessionStorage.getItem('userId');
    var userpoint_url = `/getUserPoints/${userId}`;
    

    var request = new XMLHttpRequest();
    console.log('userId:', userId);
    request.open('GET', userpoint_url, true);

    request.onload = function () {
        if (request.status >= 200) {
            userpoints_array = JSON.parse(request.responseText);
            document.getElementById('modal-userPoints').textContent = `Your Points: ${userpoints_array.points}`;

            // Calculate as percentage
            var progress = (userpoints_array.points / pointsReq) * 100;

            // Update the progress bar
            var progressBar = document.getElementById('modal-progress');
            progressBar.value = progress;
            progressBar.max = 100;

            // Add the redeem button
            var redeemButton = document.getElementById('redeem-btn');

            if(userpoints_array.points >= pointsReq) {
                redeemButton.disabled = false;
                redeemButton.className = "btn btn-success";
                redeemButton.addEventListener('click', function() {
                    redeemReward(rewardID, userId);
                });
            } else {    
                redeemButton.disabled = true;
                redeemButton.className = "btn btn-secondary";
            }
        }
    };
    request.send();


    // Open the modal
    var modal = document.getElementById('myModal');
    modal.style.display = 'block';
}
// REDEEM REWARDS
// Only displaying for now - to add: deduct points from user's account 
function redeemReward(rewardID, userId) {
    console.log('redeemReward rewardID:', rewardID); //UNDEFINED
    // Call the server route to redeem the reward
    fetch(`/redeemReward/${userId}/${rewardID}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        // Update the user's points in the modal
        document.getElementById('modal-userPoints').textContent = `Your Points: ${userpoints_array.points}`;

        // Update the progress bar
        var progress = (data.points / pointsReq) * 100;
        var progressBar = document.getElementById('modal-progress');
        progressBar.value = progress;
    })
    .catch(error => console.error('Fetch Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('myModal').style.display = 'none';
    });
});
