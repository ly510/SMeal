// Displaying the signup and login modal on click
function initializeModals() {
    var openSignupModel = document.getElementsByName('openSignupModel');
    var openLoginModel = document.getElementsByName('openLoginModel');

    openSignupModel.forEach(function (element) {
        element.addEventListener('click', function () {
            var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.hide();
            var signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
            signupModal.show();
        });
    });

    openLoginModel.forEach(function (element) {
        element.addEventListener('click', function () {
            var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
            var signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
            signupModal.hide();
        });
    });
}

// Create an account
function createAccount() {
    const createAccount_url = '/createAccount';
    var request = new XMLHttpRequest();
    request.open('POST', createAccount_url, true);
    request.setRequestHeader('Content-Type', 'application/json');

    // Get values from the form
    var email = document.getElementById('r_email').value;
    var r_pwd = document.getElementById('r_pwd').value;
    var r_c_pwd = document.getElementById('r_c_pwd').value;

    // Check if empty
    if (email == "" || r_pwd == "" || r_c_pwd == "") {
        r_errorMsg.textContent = 'Please fill in all fields';
        r_errorMsg.classList.remove('d-none');
        return;
    }
    
    // Check if email is valid
    if (emailInvalid(email)) return;

    // Check if passwords match
    if (passwordNotMatch(r_pwd, r_c_pwd)) return;

    var accountData = {
        email: email,
        password: r_pwd
    };

    request.onload = function () {
        if (request.status === 200) {
            console.log('Account created successfully:', request.responseText);
        } else {
            console.error('Failed to create account:', request.responseText);
        }
    };

    request.onerror = function () {
        console.error('Network error while creating account');
    };

    request.send(JSON.stringify(accountData)); // Convert to JSON and send the request

    sessionStorage.setItem('userEmail', email); // Store email in session storage

    return true;
}

// Check if email is SMU
function emailInvalid(email) {
    // must contain '@' and end with smu.edu.sg or xxx.smu.edu.sg
    if (email.indexOf('@') === -1) {
        r_errorMsg.innerHTML = "Please enter a valid SMU email address";
        r_errorMsg.classList.remove('d-none');
        return true;
    }

    var last = email.split("@").pop();
    var validDomains = ["smu.edu.sg"];

    // Check if the domain ends with any valid domain
    for (var i = 0; i < validDomains.length; i++) {
        if (!last.endsWith(validDomains[i])) {
            r_errorMsg.innerHTML = "Please enter a valid SMU email address";
            r_errorMsg.classList.remove('d-none');
            return true;
        }
        else{
            return false
        }
    }
}

// Check if passwords match
function passwordNotMatch(password, password_cfm) {
    if (password !== password_cfm) {
        r_errorMsg.innerHTML = 'Passwords do not match';
        r_errorMsg.classList.remove('d-none');
        return true;
    } else {
        r_errorMsg.textContent = '';
        r_errorMsg.classList.add('d-none');
        return false;
    }
}

function login(){
    const login_url = '/login';
    var request = new XMLHttpRequest();
    request.open('POST', login_url, true);
    request.setRequestHeader('Content-Type', 'application/json');

    // // Get values from the form
    var email = document.getElementById('l_email').value;
    var l_pwd = document.getElementById('l_pwd').value;

    var data = {
        email: email,
        pw: l_pwd,
    };

    return new Promise((resolve, reject) => {
        request.onload = function () {
            if (request.status === 200) {
                var response = JSON.parse(request.responseText);
                if (response.message == 1) {
                    l_errorMsg.innerHTML = "";
                    l_errorMsg.classList.add('d-none');

                    resolve(response.data); // Resolve the Promise with user data
                } else {
                    l_errorMsg.innerHTML = response.message;
                    l_errorMsg.classList.remove('d-none');
                    reject(response.message); // Reject the Promise with an error message
                }
            }
        };

        request.onerror = function () {
            console.error('Network error while trying to login');
            reject('Network error'); // Reject the Promise with a network error message
        };

        request.send(JSON.stringify(data));
    });
}

// Logout on click
window.addEventListener('load', function () {
    const logoutBtn = document.getElementById("logout");
    logoutBtn.addEventListener('click', function () {
        logout();
    });
});

function logout() {
    console.log("Logout function called");
    sessionStorage.clear();
    window.location.href = 'index.html';
}

var userId = sessionStorage.getItem("userId");
var userEmail = sessionStorage.getItem("userEmail");
console.log("userId:", userId);
console.log("userEmail:", userEmail);
