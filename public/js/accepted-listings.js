const app = Vue.createApp({
    data() {
        return {
            foodListings: [],
            foodListingsLength: 0,
            confirmationModalListingID: null,
            confirmationModalListingTitle: null,
            confirmationModalSelectedStatus: null,
            dateAccepted: null,
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

        showDeleteConfirmationModal(listingID, selectedTitle, dateAccepted, status) {
            if (status == "Listing Accepted"){
                if (this.isCancellationDisabled(dateAccepted)){
                    this.confirmationModalListingID = listingID;
                    this.confirmationModalListingTitle = selectedTitle;
                    this.confirmationModalSelectedStatus = "Awaiting Acceptance";
                    this.dateAccepted = dateAccepted;
                    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
                    modal.show();
                }
            }
        },

        deleteConfirmed() {
            this.changeStatus(this.confirmationModalListingID, this.confirmationModalSelectedStatus, ""); // Unable to pass in null to update data in db to null hence use ""
            const modalElement = document.getElementById('deleteConfirmationModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            window.location.reload();
        },

        isCancellationDisabled(dateAccepted, status) {
            // Convert dateAccepted to a Date object
            const acceptedDate = new Date(dateAccepted);
            // Get the current date
            const currentDate = new Date();
            // Calculate the difference in milliseconds
            const timeDifference = currentDate - acceptedDate;
            // Check if the difference is greater than 1 minute
            if (timeDifference > 60000){
                return !(timeDifference > 60000);
            }
            if (status == 'Listing Accepted'){
                return true;
            }
            
        },

             
    },
    
});

const vm = app.mount('#app');
