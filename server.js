"use strict";

const express = require("express");

const routeListing = require('./public/js/routes/routeListing.js');
const routeProfile = require('./public/js/routes/routeProfile.js');
const routeAccount = require('./public/js/routes/routeAccount.js');
const routeReward = require('./public/js/routes/routeReward.js');
const stripe = require('./public/js/routes/stripe.js');

const bodyParser = require("body-parser");
var app = express();
var host = "0.0.0.0";
var port = 5500;

require("dotenv").config();

var startPage = "public/index.html";

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/stripe", stripe);

routeListing.routeListing(app);
routeProfile.routeProfile(app);
routeAccount.routeAccount(app);
routeReward.routeReward(app);

function gotoIndex(req, res) {
    console.log(req.params);
    res.sendFile(__dirname + "/" + startPage);
}

app.get("/", gotoIndex);

app.route("/");

var server = app.listen(port, host, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});