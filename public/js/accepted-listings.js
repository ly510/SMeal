const app = Vue.createApp({
    data() {
        return {
            foodListings: [],
            foodListingsLength: 0,
            confirmationModalListingID: null,
            confirmationModalListingTitle: null,
            confirmationModalSelectedStatus: null,
        };
    },
    mounted() {
        this.fetchFoodListingsByFulfillerId();
    },
    methods: {
        async fetchFoodListingsByFulfillerId() {
            try {
                const fulfillerId = sessionStorage.getItem("userId");
                const response = await axios.get(`/foodlistingbyfulfullerId/${fulfillerId}`);
        
                this.foodListings = response.data.map(listing => ({
                    ...listing,
                    statusOptions: listing.status === "On the Way" ? ["Listing Completed"] : (listing.status === "Listing Accepted" ? ["On the Way", "Listing Completed"] : []),
                    selectedStatus: "", // You can set the initial status here if needed
                }));
                console.log(this.foodListings);
                this.foodListingsLength = this.foodListings.length;
            } catch (error) {
                // Handle fetching errors
                console.error('Error fetching food listings:', error.message);
            }
        },


        changeStatusConfirmed() {
            const fulfillerId = sessionStorage.getItem("userId");
            this.changeStatus(this.confirmationModalListingID, this.confirmationModalSelectedStatus, fulfillerId);
            const modalElement = document.getElementById('confirmationModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            window.location.reload();
        },
        

        showConfirmationModal(listingID, selectedStatus, selectedtitle) {
            if (selectedStatus !== ""){
            this.confirmationModalListingID = listingID;
            this.confirmationModalSelectedStatus = selectedStatus;
            this.confirmationModalListingTitle = selectedtitle;
                const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
                modal.show();
            }
        },

        async changeStatus(listingId, newStatus, fulfillerId) {
            try {

                const response = await axios.put(`/changeListingStatus/${listingId}`, {
                    status: newStatus,
                    fulfillerId: fulfillerId,
                });
    
                if (response.status === 200) {
                    console.log('Listing status changed successfully:', newStatus);
                } else {
                    this.error = 'Error changing listing status: ' + response.statusText;
                }
            } catch (error) {
                this.error = 'Network error while changing the listing status';
                console.error('Error changing listing status:', error.message);
            }
        },

        showDeleteConfirmationModal(listingID, selectedTitle) {
            this.confirmationModalListingID = listingID;
            this.confirmationModalListingTitle = selectedTitle;
            this.confirmationModalSelectedStatus = "Awaiting Acceptance";
            const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
            modal.show();
        },

        deleteConfirmed() {
            this.changeStatus(this.confirmationModalListingID, this.confirmationModalSelectedStatus, 123); // Unable to pass in null to update data in db to null hence use ""
            const modalElement = document.getElementById('deleteConfirmationModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            window.location.reload();
        },
    },
    
});

const vm = app.mount('#app');
