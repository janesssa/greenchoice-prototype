// Raspberry vinden over netwerk
// Verbinden met de VPS
// Stuurt ovpn/downloadlink terug (?)
// ovpn/link doorsturen naar raspi
// ifconfig tun1 | grep 192
// ip adres opslaan in context

import { exec } from 'child_process';

const findRaspi = () => {
    // Deze ip is nodig voor createVPNProfile 
    // Om de downloadlink/ovpn doortesturen
    // TODO: endpoint maken die dit ontvangt

    return new Promise((resolve, reject) => {
        exec('ping -c 1 raspberrypi', (error, stdout, stderr) => {
            if (error) {
                console.error(error);
            }
            if (stdout) {
                const index = stdout.indexOf('192')
                const ip = stdout.slice(index, index + 14)
                resolve(ip)
            }

            resolve(stderr);
        });
    });
}

const createVPNProfile = () => {
    // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';
    // const creds = {"username":"pritunl","password":"7MLx97fGMPddLam"}
    // const session = fetch("https://168.119.59.191:443/auth/session", {
    //     method: "POST",
    //     body: JSON.stringify(creds),
    //     headers: {
    //         'content-security-policy': 'upgrade-insecure-requests'
    //     }
    // }).then(res => {
    //     console.log(res)
    //     res.json()
    // }).then(console.log).catch(console.error)

    return 'pritunl://168.119.59.191/ku/xjX7QsHr'
}

const findExternalIP = () => {
    return new Promise((resolve, reject) => {
        exec('ifconfig tun1 | grep 192', (error, stdout, stderr) => {
            if (error) {
                console.error(error);
            }
            if (stdout) {
                const length = stdout.length
                const index = stdout.indexOf('192')
                const temp = length - index
                const ip = stdout.slice(temp)
        
                console.log('External IP adress from RasPi:' + ip)
                resolve(ip)
            }

            resolve(stderr);
        });
    });

    // exec('ifconfig tun1 | grep 192', (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`exec error: ${error}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.error(`stderr: ${stderr}`);

    //     const length = stdout.length()
    //     const index = stdout.indexOf('192')
    //     const temp = length - index
    //     const ip = stdout.slice(temp)

    //     console.log('External IP adress from RasPi:' + ip)
    //     return ip
    // });
}


export default async (req, res) => {
    console.log('The config started!')
    const internalIP = await findRaspi()
    console.log(`Internal IP: ${internalIP}`)
    const link = createVPNProfile()
    console.log(`Download link: ${link}`)
    const vpnConn = async () => {
        return await fetch(`http://${internalIP}:1337/create-profile`, {
                        method: 'POST',
                        body: JSON.stringify({'url': link})
                    })
                    .then(console.log)
                    .catch(console.error)
    }
    const status = await vpnConn()
    console.log(status)
    // if(status === 200){
    //     return findExternalIP()
    // } 

    // console.error('help: ' + status)
    res.send(JSON.stringify({
        "status": 200,
        "error": null,
        "response": "Het is OK"
    }))
}