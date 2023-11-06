const rewards = Vue.createApp({
    data() {
        return {
            rewards: [],
            selectedReward: null,
            userPoints: null,
            showModal: false,
        };
    },
    methods: {
        async getAllRewards() {
            const response = await fetch(reward_url);
            if (response.ok) {
                this.rewards = await response.json();
            }
        },
        async openModal(reward) {
            this.selectedReward = reward;
            const userId = sessionStorage.getItem('userId');
            const response = await fetch(`/getUserPoints/${userId}`);
            if (response.ok) {
                const userpoints_array = await response.json();
                this.userPoints = userpoints_array.points;
                this.showModal = true;
            }
        },
        closeModal() {
            this.showModal = false;
        },
        async updateUserPoints() {
            if (this.userPoints >= this.selectedReward.pointsReq) {
                const updatedPoints = this.userPoints - this.selectedReward.pointsReq;
                const userId = sessionStorage.getItem('userId');
                const response = await fetch(`/updateUserPoints/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ updatedPoints }),
                });
                if (response.ok) {
                    await this.addReward(userId, this.selectedReward.id);
                    this.userPoints = updatedPoints;
                    Swal.fire({
                        icon: 'success',
                        title: "Redeemed!",
                        showConfirmButton: false,
                        timer: 2300
                    }).then(function () {
                        window.location.href = "/rewards.html";
                    });
                }
            }
        },
        async addReward(userId, rewardId) {
            const response = await fetch(`/addReward/${userId}/${rewardId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                console.log("Reward Added");
            }
        },
    },
    mounted() {
        this.getAllRewards();
    },
    computed: {
        progress() {
            return (this.userPoints / this.selectedReward.pointsReq) * 100;
        }
    }
});

vmRewards = rewards.mount('#rewardsApp');