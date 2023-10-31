function editProfile() {
    var request = new XMLHttpRequest();
    request.open("GET", editProfile_url, true);

    // This function will be called when data returns from the web API
    request.onload = function () {
        if (request.status === 200) {
            // Get current profile
            editProfile_array = JSON.parse(request.responseText);

            // Assign the retrieved data to the Vue app's properties
            vmProfile.display = editProfile_array[0].userName;
            vmProfile.name = editProfile_array[0].userName;
            vmProfile.email = editProfile_array[0].userEmail;
            vmProfile.currPass = editProfile_array[0].userPassword;
            vmProfile.phoneNo = editProfile_array[0].userPhone;
            vmProfile.points = editProfile_array[0].userPoints;
            
            if (editProfile_array[0].userImg != null) {
                vmProfile.hasProfilePic = true;
                vmProfile.img = editProfile_array[0].userImg;
            }
            else
                vmProfile.hasProfilePic = false;
        }
    }

    request.onerror = function () {
        // Handle network errors
        console.error('Network error while fetching user profile data');
    }

    // This command starts the calling of the web API
    request.send();
}

function updateProfile() {
    var request = new XMLHttpRequest();

    var data = {
        name: vmProfile.name.trim(),
        phoneNo: vmProfile.phoneNo,
        img: vmProfile.img === '' ? null : vmProfile.img,
    };

    request.open("PUT", editProfile_url + "?type=profile", true);
    request.setRequestHeader("Content-Type", "application/json");

    // This function will be called when data returns from the web API
    request.onload = function () {
        if (request.status === 200) {
            vmProfile.display = vmProfile.name.trim();
            vmProfile.name = vmProfile.name.trim();
            alert("Profile successfully updated!");
        }
    }

    request.onerror = function () {
        // Handle network errors
        console.error('Network error while fetching user profile data');
    }

    // This command starts the calling of the web API
    request.send(JSON.stringify(data));
}

function updatePassword() {
    var request = new XMLHttpRequest();

    if (vmProfile.currPass === "" || vmProfile.newPass === "" || vmProfile.confirmPass === "") {
        alert("Please fill in all the password fields!");
        return;
    }
    else if (vmProfile.currPass != vmProfile.typedPass) {
        alert("Current password is incorrect!");
        return;
    }
    else if (vmProfile.newPass != vmProfile.confirmPass) {
        alert("New password does not match!");
        return;
    }
    else {
        var data = {
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
                alert("Password successfully updated!");
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
            // User Details
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
        handleImgUpload(event) {
            // Get uploaded file
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    // Convert file to data URL
                    this.img = reader.result;
                };
                // Read the file as data URL
                reader.readAsDataURL(file);
            }
            else {
                // If cancelled
                this.img = "";
            }
        }
    }
});
const vmProfile = profile.mount('#app');