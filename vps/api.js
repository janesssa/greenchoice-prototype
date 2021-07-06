const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use((req, res, next) => {
		res.append('Access-Control-Allow-Origin', ['*']);
		res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.append('Access-Control-Allow-Headers', 'Content-Type');
		res.append('Content-Type', 'application/json')
		res.append('Access-Control-Expose-Headers', 'ETag');
		next();
});
// simple route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to the VPN server." });
});

app.use('/P1', createProxyMiddleware({ target: 'http://192.168.246.2:9876', changeOrigin: true }));


// set port, listen for requests
app.listen(8081, () => {
	console.log("Server is running on port 8081.");
});
