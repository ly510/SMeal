function checkSession() {
    if (sessionStorage.getItem("userId") == null) {
        window.location.href = "/";
    }
}