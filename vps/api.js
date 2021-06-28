import express from 'express';

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

app.post("/create-profile", async (req, res) => {
	console.log('Hoi ik ben de vpn met creds: ' + res.json())
	const { exec } = require('child_process');
	exec('pritunl-client add 168.119.59.191://demo.pritunl.com/ku/rBCDSgw5', (err, stdout, stderr) => {
	if (err) {
		// node couldn't execute the command
		console.error(err)
		return;
	}

		// the *entire* stdout and stderr (buffered)
		console.log(`stdout: ${stdout}`);
	});
})

// set port, listen for requests
app.listen(8080, () => {
	console.log("Server is running on port 1337.");
});