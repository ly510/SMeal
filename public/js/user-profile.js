const profile = Vue.createApp({
    data() {
        return {
            // User Details
            name: "",
            email: "",
            phoneNo: "",
            img: "",
            points: 0,

            // Rewards redeemed
            rewards: [],
        };
    },
    mounted() {
        this.userProfile();
    },
    methods: {
        userProfile() {
            // Retrieving email from sessionStorage
            var email = sessionStorage.getItem("userEmail");

            // Define the data to be sent in the request
            var data = {
                email: email,
            };

            // Using axios to perform a POST request
            axios.post(userProfile_url, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                // Handle successful response
                if (response.status === 200) {
                    // Get current profile
                    userProfile_array = this.processResults(response.data);

                    // Assign the retrieved data to the Vue app's properties
                    this.name = userProfile_array[0].userName;
                    this.email = userProfile_array[0].userEmail;
                    this.phoneNo = userProfile_array[0].userPhone;

                    if (userProfile_array[0].userImg !== null) {
                        this.img = userProfile_array[0].userImg;
                    }

                    this.points = userProfile_array[0].userPoints;

                    // Check if there are rewards
                    if ("rewards" in userProfile_array[0]) {
                        this.rewards = userProfile_array[0].rewards;
                    }
                }
            })
            .catch(function (error) {
                // Handle errors
                console.error('Failed to fetch user profile data:', error);
            });
        },
        processResults(result) {
            if (result.length > 1) {
                const userProfile = {};
        
                result.forEach(row => {
                    if (!userProfile[row.userId]) {
                        userProfile[row.userId] = {
                            userId: row.userId,
                            userName: row.userName,
                            userEmail: row.userEmail,
                            userPassword: row.userPassword,
                            userPhone: row.userPhone,
                            userImg: row.userImg,
                            userPoints: row.userPoints,
                            rewards: []
                        };
                    }
        
                    const reward = {
                        id: row.rewardId,
                        name: row.rewardName,
                        description: row.rewardDesc,
                        pointsReq: row.rewardPointsReq,
                        img: row.rewardImg
                    };
        
                    userProfile[row.userId].rewards.push(reward);
                });
        
                const usersArray = Object.values(userProfile);
        
                return usersArray
            }
            // if no rewards
            return result
        },
    }
});
const vmProfile = profile.mount('#app');