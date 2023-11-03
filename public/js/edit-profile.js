function editProfile() {
    var request = new XMLHttpRequest();
    var email = sessionStorage.getItem("userEmail");

    request.open("POST", editProfile_url, true);
    request.setRequestHeader("Content-Type", "application/json");

    var data = {
        email: email,
    };

    // This function will be called when data returns from the web API
    request.onload = function () {
        if (request.status === 200) {
            // Get current profile
            editProfile_array = JSON.parse(request.responseText);

            // Assign the retrieved data to the Vue app's properties
            vmProfile.id = editProfile_array[0].userId;
            vmProfile.display = editProfile_array[0].userName;
            vmProfile.name = editProfile_array[0].userName;
            vmProfile.email = editProfile_array[0].userEmail;
            vmProfile.currPass = editProfile_array[0].userPassword;
            vmProfile.phoneNo = editProfile_array[0].userPhone;
            vmProfile.points = editProfile_array[0].userPoints;
            
            if (editProfile_array[0].userImg != null) {
                vmProfile.img = editProfile_array[0].userImg;
            }
        }
    }

    request.onerror = function () {
        // Handle network errors
        console.error('Network error while fetching user profile data');
    }

    // This command starts the calling of the web API
    request.send(JSON.stringify(data));
}

function updateProfile(event) {
    // Prevent refresh
    event.preventDefault();

    var profileAlert = document.getElementById("profileAlert");
    var successAlert = document.getElementById("successAlert");
    
    // Remove alert
    profileAlert.innerText = "";
    profileAlert.classList.add('d-none');

    successAlert.innerText = "";
    successAlert.classList.add('d-none');

    var request = new XMLHttpRequest();

    if (vmProfile.phoneNo.length != 8) {
        profileAlert.innerText = "Please enter a valid phone number!";
        profileAlert.classList.remove('d-none');
        return;
    }

    if (vmProfile.img != "" && vmProfile.img != null) {
        const maxWidth = 800;
        const maxHeight = 600;
        const quality = 0.7;

        // Compress image if exists
        compressImage(vmProfile.img, maxWidth, maxHeight, quality, function(compressedBase64) {
            if (compressedBase64) {
                initiateRequest(compressedBase64);
            } else {
                profileAlert.innerText = "Error occurred. Please try again.";
                profileAlert.classList.remove('d-none');
            }
        });
    } else {
        initiateRequest(vmProfile.img);
    }

    function initiateRequest(compressedImage) {
        var data = {
            id: vmProfile.id,
            name: vmProfile.name.trim(),
            phoneNo: vmProfile.phoneNo,
            img: vmProfile.img === '' ? null : compressedImage,
        };

        request.open("PUT", editProfile_url + "?type=profile", true);
        request.setRequestHeader("Content-Type", "application/json");

        request.onload = function () {
            if (request.status === 200) {
                vmProfile.display = vmProfile.name.trim();
                vmProfile.name = vmProfile.name.trim();

                // Display success alert
                successAlert.innerText = "Profile successfully updated!";
                successAlert.classList.remove('d-none');

                // For navbar
                sessionStorage.setItem("name", vmProfile.name.trim());
            }
        };

        request.onerror = function () {
            console.error('Network error while fetching user profile data');
        };

        request.send(JSON.stringify(data));
    }
}


// Function to compress an image
function compressImage(base64Data, maxWidth, maxHeight, quality, callback) {
    let img = new Image();

    img.onload = function () {
        let canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions based on maxWidth and maxHeight
        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
        }

        // Resize the image on the canvas
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas content to a base64 data URL
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

        // Execute the callback with the compressedBase64 data
        callback(compressedBase64);
    };

    img.onerror = function () {
        callback(null); // Indicate error by passing null to the callback
    };

    img.src = base64Data;
}

function updatePassword(event) {
    event.preventDefault();

    var passwordAlert = document.getElementById("passwordAlert");
    var successAlert = document.getElementById("successAlert");
    
    // Remove alert
    passwordAlert.innerText = "";
    passwordAlert.classList.add('d-none');

    successAlert.innerText = "";
    successAlert.classList.add('d-none');
    
    var request = new XMLHttpRequest();

    if (vmProfile.currPass === "" || vmProfile.newPass === "" || vmProfile.confirmPass === "") {
        passwordAlert.innerText = "Please fill in all the password fields!";
        passwordAlert.classList.remove('d-none');
        return;
    }
    else if (vmProfile.currPass != vmProfile.typedPass) {
        passwordAlert.innerText = "Current password is incorrect!";
        passwordAlert.classList.remove('d-none');        
        return;
    }
    else if (vmProfile.newPass != vmProfile.confirmPass) {
        passwordAlert.innerText = "New password does not match!";
        passwordAlert.classList.remove('d-none');        
        return;
    }
    else {
        var data = {
            id: vmProfile.id,
            password: vmProfile.newPass,    
        };
    
        request.open("PUT", editProfile_url + "?type=password", true);
        request.setRequestHeader("Content-Type", "application/json");
    
        // This function will be called when data returns from the web API
        request.onload = function () {
            if (request.status === 200) {
                vmProfile.currPass = vmProfile.newPass;
                vmProfile.typedPass = "";
                vmProfile.newPass = "";
                vmProfile.confirmPass = "";

                // Display success alert
                successAlert.innerText = "Password successfully updated!";
                successAlert.classList.remove('d-none');
            }
        }
    
        request.onerror = function () {
            // Handle network errors
            console.error('Network error while fetching user profile data');
        }
    
        // This command starts the calling of the web API
        request.send(JSON.stringify(data));
    }
}

const profile = Vue.createApp({
    data() {
        return {
            // User Details\
            id: "",
            display: "", // for display
            name: "",
            email: "",
            phoneNo: "",
            img: "",
            points: 0,

            // Password Check
            currPass: "", // for checking
            typedPass: "",
            newPass: "",
            confirmPass: "",
        };
    }, // data
    // computed: { 
    //     derivedProperty() {
    //         return false;
    //     }  
    // }, // computed
    // created() { 
    // },
    mounted() {
        editProfile();
    },
    methods: {
        removePicture() {
            // Remove current profile picture
            this.img = "";
        },
        handleImgUpload(event) {
            // Get uploaded file
            const file = event.target.files[0];
            if (file) {
                if (file.size > 512000) {
                    alert('File size exceeds the limit.');
                    event.target.value = '';
                }
                else {
                    const reader = new FileReader();
                    reader.onload = () => {
                        // Convert file to data URL
                        this.img = reader.result;
                    };
                    // Read the file as data URL
                    reader.readAsDataURL(file);
                }
            }
            else {
                // If cancelled
                this.img = "";
            }
        }
    }
});
const vmProfile = profile.mount('#app');