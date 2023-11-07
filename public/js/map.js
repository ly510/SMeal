// maps.js

// const googleMapsAPIKey = process.env.GOOGLE_API_KEY;
const googleMapsAPIKey = "AIzaSyD16-5UR_uPSLvoTx6BJronXsho-r_S3Zo";

function loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}
