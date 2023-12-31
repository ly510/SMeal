const userId = sessionStorage.getItem("userId");
const userEmail = sessionStorage.getItem("userEmail");
const user_name = sessionStorage.getItem("name");
const phoneNo = sessionStorage.getItem("phoneNo");
const img_url = sessionStorage.getItem("img");

var htmlImg = ``;
if (img_url == "null"){
	htmlImg = `
	<i class="fa-regular fa-circle fa-stack-2x"></i>
	<i class="fa-solid fa-user fa-stack-1x"></i>`
}
else{
	htmlImg = `<img src="../` + img_url + `" alt="Create Listing" class="bi img-fluid">`
}

// Navigation Bar
window.addEventListener('load', function(){
	var navBar = document.getElementById("navBar");
	navBar.innerHTML = `
		<nav class="navbar navbar-expand-lg navbar-light navigation">
			<a class="navbar-brand" href="home.html">
				<img src="img/logo-black.png" alt="" style="max-height: 60px;">
			</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav ms-auto main-nav">
					<li class="nav-item">
						<a class="nav-link" href="home.html">Home</a>
					</li>
					<li class="nav-item dropdown dropdown-slide">
						<a class="nav-link dropdown-toggle" href="#!" role="button" data-bs-toggle="dropdown">
							Listings <span><i class="fa fa-angle-down"></i></span>
						</a>
		
						<!-- Dropdown list -->
						<ul class="dropdown-menu">
							<li><a class="dropdown-item" href="food-listings.html">Food Listings</a></li>
							<li><a class="dropdown-item" href="my-listings.html">My Listings</a></li>
							<li><a class="dropdown-item" href="accepted-listings.html">Accepted Listings</a></li>
						</ul>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="rewards.html">Rewards</a>
					</li>
				</ul>
				<ul class="navbar-nav ms-auto mt-2">
					<li class="nav-item">
					<li class="nav-item dropdown dropdown-slide">
						<a class="nav-link" href="#!" role="button" data-bs-toggle="dropdown">
							<span class="fa-stack">` 
							+ htmlImg + 
							`
							</span>
							`
							+ user_name +
							` <span><i class="fa fa-angle-down"></i></span>
						</a>
						<!-- Dropdown list -->
						<ul class="dropdown-menu">
							<li><a class="dropdown-item" href="user-profile.html">Profile</a></li>
							<li><a class="dropdown-item" type="button" id="logout">Logout</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</nav>			

    `;

	// Logout on click
	const logoutBtn = document.getElementById("logout");
	if (logoutBtn != null) {
        logoutBtn.addEventListener('click', function () {
            logout();
        });
    }
});

function logout() {
    console.log("Logout function called");
    sessionStorage.clear();
    window.location.href = 'index.html';
}

if (sessionStorage.getItem("userId") === null) userIdAfterCreateAcc();

function userIdAfterCreateAcc() {
    var request = new XMLHttpRequest();
    var email = sessionStorage.getItem("userEmail");
    request.open("POST", "/user-profile", true);
    request.setRequestHeader("Content-Type", "application/json");

    var data = {
        email: email,
    };

    // This function will be called when data returns from the web API
    request.onload = function () {
        if (request.status === 200) {
            // Get current profile
            result = JSON.parse(request.responseText);
            sessionStorage.setItem('userId', result[0].userId);    
        }
    }
    request.onerror = function () {
        // Handle network errors
        console.error('Network error while fetching user profile data');
    }
    // This command starts the calling of the web API
    request.send(JSON.stringify(data));
}
