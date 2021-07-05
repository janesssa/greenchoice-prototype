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
                const r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
                const ip = stdout.match(r)
                resolve(ip)
            }

        });
    });
}

const createVPNProfile = () => {
    // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';
    // const creds = {"username":"pritunl","password":"7MLx97fGMPddLam"}
    // fetch("https://168.119.59.191:443/auth/session", {
    //     method: "POST",
    //     body: JSON.stringify(creds),
    //     headers: {
    //         'content-security-policy': 'upgrade-insecure-requests'
    //     }
    // }).then(res => {
    //     console.log('je moer');
    //     console.log('RES '+ JSON.stringify(res))
    // }).catch(console.error)

    return 'https://168.119.59.191/key/IUb177yD7PUWVUzL0Gt5tNirZ5pDAxUg.tar'
}

export default async (req, res) => {
    console.log('The config started!')

    const internalIP = await findRaspi()
    console.log(`Internal IP: ${internalIP}`)

    const link = createVPNProfile()
    console.log(`Download link: ${link}`)

    await fetch(`http://${internalIP}:9876/create-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'url': link })
    }).catch(console.error)

    const externalIP = () => {
        let data
        try {
            data = fs.readFileSync('/usr/app/utilities/ip.json')
        } catch (err) {
            console.log(err)
            console.log('Continuing by fetching the IP')
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

        console.log('data: ' + data.toString())
        const string = JSON.parse(data.toString())
        console.log(typeof string)
        // const ip = string.json()
        console.log('ip: ' + string)
        return string.ip
    }

    const exIP = await externalIP()
    console.log('External IP: ' + exIP)
    if (exIP === internalIP) {
        externalIP()

        if (exIP != undefined) {
            res.send(JSON.stringify({
                "status": 200,
                "error": null,
                "response": exIP
            }))
        } else {
            res.send(JSON.stringify({
                "status": 502,
                "error": "Something went wrong!"
            }))
        }

    }
}