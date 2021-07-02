// Raspberry vinden over netwerk
// Verbinden met de VPS
// Stuurt ovpn/downloadlink terug (?)
// ovpn/link doorsturen naar raspi
// ifconfig tun1 | grep 192
// ip adres opslaan in context

const { exec } = require('child_process');

const findRaspi = exec(`nmap -sP 192.168.1.0/24 | awk '/^Nmap/{ip=$NF}/B8:27:EB/{print ip}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    
    const index = stdout.indexOf('192')
    const ip = stdout.slice(index, -1)

    // Deze ip is nodig voor createVPNProfile 
    // Om de downloadlink/ovpn doortesturen
    // TODO: endpoint maken die dit ontvangt
    console.log('IP adress van RasPi: ' + ip)
    return ip
});

const createVPNProfile = exec('pritunl-client add 168.119.59.191://demo.pritunl.com/ku/rBCDSgw5', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    // uitzoeken wat hier uit komt en hoe je die downloadlink terug krijgt
});

const findExternalIP = exec('ifconfig tun1 | grep 192', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    const length = stdout.length()
    const index = stdout.indexOf('192')
    const temp = length - index
    const ip = stdout.slice(temp)

    console.log('External IP adress from RasPi:' + ip)
    return ip
});


export default async (res, req) => {
    console.log('The config started!')
    const internalIP = findRaspi()
    const link = createVPNProfile()
    const vpnConn = async () => {
        return await fetch(`http://${internalIP}/download-ovpn`, {
                        method: 'POST',
                        body: JSON.stringify({'url': link})
                    })
                    .then(console.log)
                    .catch(console.error)
    }
    const status = await vpnConn()

    if(status === 200){
        return findExternalIP()
    } 
    
    console.error('help: ' + status)
}