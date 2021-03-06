const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const mariadb = require('mariadb')
const express = require("express")
const { exec } = require('child_process');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(res => {
	res.header({
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'OPTIONS, GET',
		'Content-Type': 'application/json',
		"Access-Control-Expose-Headers": "ETag"
	})
})

const raspberryPort = "/dev/ttyUSB0";

const raspberrySerialPort = new SerialPort(raspberryPort, { parity: 'even', dataBits: 7 });

const obj = {}

raspberrySerialPort.on('open', function () {
	console.log('Serial Port ' + raspberryPort + ' is opened.');
});

const pool = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'P1data'
})

pool.getConnection().then(async conn => {
	let createLive = `create table if not exists live(
		time datetime primary key,
		energy decimal(6,2) not null
		)`

	conn.query(createLive, (err) => {
		if (err) console.error(err.message)
	})

	conn.end(err => {
		if (err) console.error(err.message)
	})
}).catch(err => {
	if (err) console.error(err)
})

const saveData = async (obj) => {
	const temp = [obj.time, obj.energy]

	pool.getConnection().then(async conn => {
		conn.query(`INSERT INTO live(time, energy) VALUES (?, ?);`, temp)
			.then(rows => {
				console.log(rows);
				conn.end();
			})
			.catch(err => {
				console.error(err)
			})
	}).catch(err => {
		if (err) console.error(err)
	})

}

const sortData = (data) => {
	if (data.includes("1-0:1.7.0")) {
		obj.energy = parseFloat(data.slice(10, 17))
	}

	if (data.includes("1-0:2.7.0") && obj.energy === 0) {
		obj.energy = 0 - parseFloat(data.slice(10, 17))
	}

	if (data.includes("1-0:2.7.0") && obj.energy != 0 && obj.energy != undefined) {
		obj.energy = obj.energy - parseFloat(data.slice(10, 17))
	}

	if (obj.energy != undefined && obj.energy != 0) {
		obj.time = new Date()
		saveData(obj)
		console.log(obj)
		obj.energy = obj.time = undefined
	}
}

const parser = raspberrySerialPort.pipe(new Readline())
parser.on('data', sortData)

// simple route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to the application." });
});

app.get("/P1", async (req, res) => {
	let query = "SELECT * FROM live WHERE time > DATE_SUB( NOW(), INTERVAL 1 MINUTE )"
	pool.getConnection().then(async conn => {
		console.log("conn")
		conn.query(query).then(rows => {
			res.json({
				"status": 200,
				"error": null,
				"response": rows
			})
		}).catch(console.error)

		conn.end(console.error)
	}).catch(console.error)
})

app.get("/create-profile", async (req, res) => {
	console.log('Hoi ik ben de vpn met creds: ' + res.json())
	exec('pritunl-clienr add 168.119.59.191://demo.pritunl.com/ku/rBCDSgw5', (err, stdout, stderr) => {
		if (err) {
			// node couldn't execute the command
	 		console.error(err)
			return;
		}
		// the *entire* stdout and stderr (buffered)
		console.log(`stdout: ${stdout}`);
	});
	res.json({message: 'Profile created'})
})

// set port, listen for requests
app.listen(1337, () => {
	console.log("Server is running on port 1337.");
});
