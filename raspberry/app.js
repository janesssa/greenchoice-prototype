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

app.use((req, res, next) => {
	res.append('Access-Control-Allow-Origin', ['*']);
	res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.append('Access-Control-Allow-Headers', 'Content-Type');
	res.append('Content-Type', 'application/json')
	res.append('Access-Control-Expose-Headers', 'ETag');
	next();
});

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

app.get("/P1", (req, res) => {
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

app.post("/create-profile", (req, res) => {
	//console.log('Downloadlink: ' + res.json())
	const { exec } = require('child_process');
	console.log(req.body.url)
	const key = req.body.url.indexOf('key')
	const fileName = req.body.url.slice(key + 4)
	console.log(fileName)
	exec(`wget ${req.body.url} --no-check-certificate`, (err, stdout, stderr) => {
		if (err) {
			// node couldn't execute the command
			console.error(err)
			return;
		}

		// the *entire* stdout and stderr (buffered)
		console.log(`stdout: ${stdout}`);

		exec(`tar -xvf ${fileName}`, (err, stdout, stderr) => {
			if (err) {
				// node couldn't execute the command
				console.error(err)
				return;
			}

			// the *entire* stdout and stderr (buffered)
			console.log(`stdout: ${stdout}`);
			//const bash = `sh -c "echo Waterfles04! | sudo -S openvpn ${stdout}"`

			exec(`pm2 start greenchoice-prototype/raspberry/openvpn.sh -- ${stdout}`, (err, stdout, stderr) => {
				if (err) {
					// node couldn't execute the command
					console.error(err)
					return;
				}

				// the *entire* stdout and stderr (buffered)
				console.log(`stdout: ${stdout}`);
				res.json({
					"status": 200,
					"error": null,
					"response": 'Profile created'
				})
			})
		})
	});
})

app.get("/current-ip", (req, res) => {
	exec('ifconfig | grep 192', (err, stdout, stderr) => {
		if (err) {
			// node couldn't execute the command
			console.error(err)
			return;
		}

		console.log(stdout);

		res.json({
			"status": 200,
			"error": null,
			"response": `Message: ${stdout}`
		})
	
	})
}


// set port, listen for requests
app.listen(9876, () => {
	console.log("Server is running on port 9876.");
});
