import fs from 'fs'

export default (req, res) => {
    let data
    try {
        data = fs.readFileSync('/usr/app/utilities/ip.json')
        console.log('Found file. Data: ' + data.toString())
        const json = JSON.parse(data.toString())
        
        console.log('Sending success!')
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "ip": json.ip
        }))
    } catch (err) {
        console.log('No file found. Error: ' + err)
        console.log('Continuing by activating the app')
        res.send(JSON.stringify({
            "status": 404,
            "error": 'No file found.'
        }))
    }

}