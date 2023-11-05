const profile = Vue.createApp({
    data() {
        return {
            // User Details\
            id: "",
            display: "", // for display
            name: "",
            email: "",
            fullNum: "",
            countryCode: "",
            phoneNo: "",
            img: "",
            points: 0,

            // Password Check
            currPass: "", // for checking
            typedPass: "",
            newPass: "",
            confirmPass: "",
        };
    },
    mounted() {
        this.editProfile();
    },
    methods: {
        editProfile() {
            var email = sessionStorage.getItem("userEmail");
            var profileAlert = document.getElementById("profileAlert");
            var successAlert = document.getElementById("successAlert");

            axios.post(editProfile_url, { email }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.status === 200) {
                    var editProfile_array = response.data;

                    this.id = editProfile_array[0].userId;
                    this.display = editProfile_array[0].userName;
                    this.name = editProfile_array[0].userName;
                    this.email = editProfile_array[0].userEmail;
                    this.currPass = editProfile_array[0].userPassword;
                    this.fullNum = editProfile_array[0].userPhone;
                    this.points = editProfile_array[0].userPoints;

                    // Display phone number
                    this.countryCode = this.fullNum.substring(1, 3);
                    this.phoneNo = this.fullNum.substring(this.countryCode.length + 1);

                    const country = window.intlTelInputGlobals.getCountryData().find(country => country.dialCode === this.countryCode).iso2;

                    var input = document.getElementById('phone-number');
                    var iti = window.intlTelInput(input, {
                        separateDialCode: true,
                        initialCountry: country,
                    });

                    input.addEventListener('countrychange', function () {
                        this.countryCode = iti.getSelectedCountryData().dialCode;
                    });

                    input.addEventListener('input', function () {
                        var fullPhoneNumber = iti.getNumber().trim();
                        var isValid = iti.isValidNumber();
                        var isEmpty = !fullPhoneNumber.trim();
                        
                        if (isEmpty) isValid = false;

                        if (isValid && !isEmpty) {
                            profileAlert.innerText = "";
                            profileAlert.classList.add('d-none');
                            sessionStorage.setItem("phoneNo", fullPhoneNumber);
                        } else {
                            successAlert.innerText = "";
                            successAlert.classList.add('d-none');
                            profileAlert.innerText = "Please enter a valid phone number!";
                            profileAlert.classList.remove('d-none');
                        }
                        sessionStorage.setItem("invalidPhoneNo", isValid);
                    });

                    if (editProfile_array[0].userImg != null) {
                        this.img = editProfile_array[0].userImg;
                    }
                }
            })
            .catch(error => {
                // Handle network errors
                console.error('Network error while fetching user profile data:', error);
            });

        },
        updateProfile(event) {
            // Prevent refresh
            event.preventDefault();
        
            var profileAlert = document.getElementById("profileAlert");
            var successAlert = document.getElementById("successAlert");
            
            // Remove alert
            profileAlert.innerText = "";
            profileAlert.classList.add('d-none');
        
            successAlert.innerText = "";
            successAlert.classList.add('d-none');
                
            if (sessionStorage.getItem("invalidPhoneNo") == "false") {
                profileAlert.innerText = "Please enter a valid phone number!";
                profileAlert.classList.remove('d-none');
                return;
            }
        
            if (this.img != "" && this.img != null) {
                const maxWidth = 800;
                const maxHeight = 600;
                const quality = 0.7;
        
                // Compress image if exists
                this.compressImage(this.img, maxWidth, maxHeight, quality, (compressedBase64) => {
                    if (compressedBase64) {
                        this.initiateRequest(compressedBase64);
                    } else {
                        profileAlert.innerText = "Error occurred. Please try again.";
                        profileAlert.classList.remove('d-none');
                    }
                });
            } else {
                this.initiateRequest(this.img);
            }
        },
        compressImage(base64Data, maxWidth, maxHeight, quality, callback) {
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
        },
        initiateRequest(compressedImage) {
            var data = {
                id: this.id,
                name: this.name.trim(),
                phoneNo: sessionStorage.getItem("phoneNo"),
                img: this.img === '' ? null : compressedImage,
            };

            axios.put(editProfile_url + "?type=profile", data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.status === 200) {
                    this.display = this.name.trim();
                    this.name = this.name.trim();
                    this.phoneNo = this.phoneNo.replace(/\s/g, '');
            
                    // Display success alert
                    var successAlert = document.getElementById("successAlert");
                    successAlert.innerText = "Profile successfully updated!";
                    successAlert.classList.remove('d-none');
            
                    // For navbar
                    sessionStorage.setItem("name", this.name.trim());

                    if (this.img == "") {
                        sessionStorage.setItem("img", null);
                    } else {
                        sessionStorage.setItem("img", "/img/profile-pic-" + sessionStorage.getItem("userId") + ".jpeg");
                    }
                }
            })
            .catch(error => {
                console.error('Network error while fetching user profile data:', error);
            });            
        },
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
        },
        updatePassword(event) {
            event.preventDefault();

            var passwordAlert = document.getElementById("passwordAlert");
            var successAlert = document.getElementById("successAlert");

            // Remove alert
            passwordAlert.innerText = "";
            passwordAlert.classList.add('d-none');

            successAlert.innerText = "";
            successAlert.classList.add('d-none');

            if (this.currPass === "" || this.newPass === "" || this.confirmPass === "") {
                passwordAlert.innerText = "Please fill in all the password fields!";
                passwordAlert.classList.remove('d-none');
                return;
            } else if (this.currPass != this.typedPass) {
                passwordAlert.innerText = "Current password is incorrect!";
                passwordAlert.classList.remove('d-none');
                return;
            } else if (this.newPass != this.confirmPass) {
                passwordAlert.innerText = "New password does not match!";
                passwordAlert.classList.remove('d-none');
                return;
            } else {
                axios.put(editProfile_url + "?type=password", {
                    id: this.id,
                    password: this.newPass
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.status === 200) {
                        this.currPass = this.newPass;
                        this.typedPass = "";
                        this.newPass = "";
                        this.confirmPass = "";

                        // Display success alert
                        successAlert.innerText = "Password successfully updated!";
                        successAlert.classList.remove('d-none');
                    }
                })
                .catch(error => {
                    // Handle network errors
                    console.error('Network error while fetching user profile data', error);
                });
            }
        }
    }
});
const vmProfile = profile.mount('#app');