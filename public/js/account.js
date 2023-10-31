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

// Check if email is SMU
function emailInvalid(email) {
    // must contain '@' and end with smu.edu.sg or xxx.smu.edu.sg
    if (email.indexOf('@') === -1) {
        errorMsg.innerHTML = "Please enter a valid SMU email address";
        errorMsg.classList.remove('d-none');
        return true;
    }

    var last = email.split("@").pop();
    var validDomains = ["smu.edu.sg"];

    // Check if the domain ends with any valid domain
    for (var i = 0; i < validDomains.length; i++) {
        if (!last.endsWith(validDomains[i])) {
            errorMsg.innerHTML = "Please enter a valid SMU email address";
            errorMsg.classList.remove('d-none');
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
        errorMsg.innerHTML = 'Passwords do not match';
        errorMsg.classList.remove('d-none');
        return true;
    } else {
        errorMsg.textContent = '';
        errorMsg.classList.add('d-none');
        return false;
    }
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
        errorMsg.textContent = 'Please fill in all fields';
        errorMsg.classList.remove('d-none');
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

    // Convert to JSON and send the request
    request.send(JSON.stringify(accountData));

    sessionStorage.setItem('userEmail', email); // Store email in session storage

    return true;
}
