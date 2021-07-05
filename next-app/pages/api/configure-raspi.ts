import { exec } from 'child_process';
import fs from 'fs'

const findRaspi = () => {
    return new Promise((resolve, reject) => {
        exec('ping -c 1 greenchoicepi', (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                resolve('192.168.2.60');
            }
            if (stdout) {
                console.log('Pinged: ' + stdout)
                const r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
                const ip = stdout.match(r)
                resolve(ip)
            }

        });
    });
}

export default async (req, res) => {
    console.log('The config started!')

    const internalIP = await findRaspi()
    console.log(`Internal IP: ${internalIP}`)

    // Dit is hard-coded omdat API access bij Pritunl 70eu per maand kost
    const link = 'https://168.119.59.191/key/BerX2QrhovsM4yfQuh9SQdpVFAJLb6d8.tar'
    console.log(`Download link: ${link}`)

    await fetch(`http://${internalIP}:9876/create-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'url': link })
    }).then(console.log).catch(console.error)

    const externalIP = () => {
        let data
        try {
            data = fs.readFileSync('/usr/app/utilities/ip.json')
            console.log('Found file. Data: ' + data.toString())
            const json = JSON.parse(data.toString())
            return json.ip
        } catch (err) {
            console.log('No file found. Error: ' + err)
            console.log('Continue by fetching the IP')
            return fetch(`http://${internalIP}:9876/current-ip`)
                .then(res => res.json())
                .then(data => {
                    fs.writeFile("/usr/app/utilities/ip.json", JSON.stringify({ 'ip': data.response[0] }), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The file was saved!");
                    });
                    return data.response[0]
                })
                .catch(console.error)

        }
    }

    const exIP = await externalIP()
    console.log('External IP: ' + exIP)

    if (exIP != undefined) {
        console.log('Sending success!')
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": exIP
        }))
    } else {
        console.error('Sending error :(')
        res.send(JSON.stringify({
            "status": 502,
            "error": "Something went wrong!"
        }))
    }


}