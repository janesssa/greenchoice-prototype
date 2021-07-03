import { exec } from 'child_process';

const findRaspi = () => {
    return new Promise((resolve, reject) => {
        exec('ping -c 1 greenchoicepi', (error, stdout, stderr) => {
            if (error) {
                console.error(error);
            }
            if (stdout) {
                const r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
                const ip = stdout.match(r)
                resolve(ip)
            }

            resolve('0.0.0.0');
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

    return 'https://168.119.59.191/key/QOTrtHEw5SoU1pmL8sIFFPrkLTvNu7hp.tar'
}

export default async (req, res) => {
    console.log('The config started!')

    const internalIP = await findRaspi()
    console.log(`Internal IP: ${internalIP}`)
    
    const link = createVPNProfile()
    console.log(`Download link: ${link}`)
    
    await fetch(`http://${internalIP}:9876/create-profile`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 'url': link })
        }).catch(console.error)
    
    const externalIP = await fetch(`http://${internalIP}:9876/current-ip`)
        .then(res => res.json())
        .catch(console.error)
    console.log('External IP: ' + externalIP.response[0])

    res.send(JSON.stringify({
        "status": 200,
        "error": null,
        "response": externalIP.response[0]
    }))
}