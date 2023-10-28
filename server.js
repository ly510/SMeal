"use strict";

const express = require("express");

const routeListing = require('./public/js/routes/routeListing.js');

const bodyParser = require("body-parser");
var app = express();
var host = "127.0.0.1";
var port = 5500;

var startPage = "public/index.html";

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routeListing.routeListing(app);

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
