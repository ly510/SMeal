function userProfile() {
    var request = new XMLHttpRequest();
    var email = sessionStorage.getItem("userEmail");

    request.open("POST", userProfile_url, true);
    request.setRequestHeader("Content-Type", "application/json");

    var data = {
        email: email,
    };

    // This function will be called when data returns from the web API
    request.onload = function () {
        if (request.status === 200) {
            // Get current profile
            userProfile_array = processResults(JSON.parse(request.responseText));
            
            // Assign the retrieved data to the Vue app's properties
            vmProfile.name = userProfile_array[0].userName;
            vmProfile.email = userProfile_array[0].userEmail;
            vmProfile.phoneNo = userProfile_array[0].userPhone;
            
            if (userProfile_array[0].userImg != null) {
                vmProfile.img = userProfile_array[0].userImg;
            }

            vmProfile.points = userProfile_array[0].userPoints;
            
            // Check if have rewards
            if ("rewards" in userProfile_array[0]) {
                vmProfile.rewards = userProfile_array[0].rewards;
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

function processResults(result) {
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
                pointsReq: row.rewardPointsReq
            };

            userProfile[row.userId].rewards.push(reward);
        });

        const usersArray = Object.values(userProfile);

        return usersArray
    }
    // if no rewards
    return result
}

const profile = Vue.createApp({
    data() {
        return {
            // User Details
            name: "",
            email: "",
            phoneNo: "",
            img: "",
            points: 0,

            // Points History
            hasHistory: false,
            pointHistory: [
                // {
                //     fulfiller: "Winnie",
                //     dateTime: "25/09/2023 11:49AM",
                //     points: 30,
                // },
                // {
                //     fulfiller: "Li Ying",
                //     dateTime: "26/09/2023 08:13AM",
                //     points: 10,
                // },
            ],

            // Rewards redeemed
            rewards: [],
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
        userProfile();
    },
    methods: {
        methodName() {

        }
    }
});
const vmProfile = profile.mount('#app');