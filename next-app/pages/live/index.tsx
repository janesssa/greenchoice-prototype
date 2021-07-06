import React, { useEffect, useState } from 'react'
import Layout from 'utilities/components/organisms/Layout'
import Card from 'utilities/components/molecules/Card'
import styles from 'styles/Live.module.scss'
import Button from 'utilities/components/atoms/Button'
import { Chart } from 'react-google-charts'
import Loading from 'utilities/components/atoms/Loading'

const Live = () => {
    const [data, setData] = useState([])
    const [activated, setActivated] = useState(false)
    const [finding, setFinding] = useState(true)
    const [loading, setLoading] = useState(false)
    const [ip, setIP] = useState(null)

    useEffect(() => {
        const findFile = async () => {
            console.log('Finding file.')
            return await fetch('/api/find-file')
                .then(res => res.json())
                .then(data => {
                    if(data.error){
                        console.warn('No file found. Activate to continue. Error: ' + data.error)
                        setFinding(false)
                    } else {
                        setIP(data.ip)
                        console.log('Found file with ip: ' + data.ip)
                    }
                })
                .catch(console.error)
        }
        findFile()
    }, [])

    useEffect(() => {
        console.log('Creating graph: ' + ip)

        const interval = setInterval(() => {
            if (ip) {
                console.log('Fetching with: ' + ip)
                fetch(`http://${ip}:9876/P1`)
                    .then(res => res.json())
                    .then(data => {
                        const map = data.response.map(item => [item.time, item.energy])
                        map.unshift(['Time', 'Energy (kWh)'])
                        console.log(map)
                        setData(map)
                        setLoading(false)
                        setFinding(false)
                        setActivated(true)
                    })
                    .catch(console.error)
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [ip])

    const activateData = () => {
        console.log('Activated!!!')
        setLoading(true)
        fetch('/api/configure-raspi')
            .then(res => res.json())
            .then(data => {
                setIP(data.response)
                return
            })
            .catch(console.error)
    }

    if (activated) {
        return (
            <Layout>
                <Card type="tab">

                    <Chart
                        width={'100%'}
                        height={'27em'}
                        chartType="LineChart"
                        loader={<Loading />}
                        data={data}
                        options={{
                            curveType: 'function',
                            explorer: {
                                actions: ['dragToZoom', 'rightClickToReset'],
                                axis: 'horizontal'
                            },
                            animation: {
                                duration: 1000,
                                easing: 'out',
                            },
                            hAxis: {
                                textPosition: 'none'
                            },
                            legend: {
                                position: 'none'
                            }
                        }}
                        rootProps={{ 'data-testid': '1' }}
                    />
                </Card>
                <Card title="Live data bewaren">
                    <b>Wil je de live data langer bewaren?</b>
                    <p>We raden je aan om een persoonlijke opslag aan te schaffen. Denk aan een USB-stick of een harde schijf.</p>
                    <p className={styles.link}>Weten waarom wij de data niet voor je opslaan? Lees meer {'>'}</p>
                    <p>Of gebruik onze rekenhulp om te berekenen hoeveel opslag je nodig hebt!</p>
                    <Button text='Bereken' href='/live/calc' />
                </Card>
            </Layout>
        )
    }

    if (finding) {
        return (
            <Layout>
                <Card title='Live data'>
                    <p>Data ophalen...</p>
                </Card>
            </Layout>
        )
    }

    return (
        <Layout>
            <Card title='Live data'>
                <p>Activeer nu live data.</p>
                {loading ? (
                    <Button text='Loading...' />
                ) : (
                    <Button text='Activeer!' handleClick={() => activateData()} />
                )}
            </Card>
        </Layout>
    )
}

export default Live
