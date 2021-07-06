
const getData = async (ip) => {
    if (ip !== undefined) {
        console.log('Start fetching.')
        return await fetch(`http://${ip}:8081/P1`)
            .then(res => res)
            .catch(console.error)
    } else {
        return {
            "status": 400,
            "error": 'Something went wrong.'
        }
    }
}



export default async (req, res) => {
    const ip = JSON.parse(req.body).ip

    const data = await getData(ip).then(res => res.json()).catch(console.error)

    if(data !== undefined){
        res.send(JSON.stringify(data))
    } else {
        res.send(JSON.stringify({
            'status': 400,
            'message': 'Something went wrong.'
        }))
    }
}

