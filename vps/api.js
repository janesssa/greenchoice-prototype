const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(res => {
	res.header({
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "OPTIONS, GET",
		'Content-Type': 'application/json'
	})
})

// simple route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to the VPN server." });
});

app.get("/P1", (req, res) => {

// ifconfig tun1 | grep 192 
// proxy naar 192.168.246.2 -> ip adres van raspi die met vpn verbonden is.

	res.json({ message: "Welcome to the VPN server." });
});

// set port, listen for requests
app.listen(8080, () => {
	console.log("Server is running on port 1337.");
});