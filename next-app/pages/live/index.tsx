import React, { useEffect, useState } from 'react'
import Layout from 'utilities/components/organisms/Layout'
import Card from 'utilities/components/molecules/Card'
import styles from 'styles/Live.module.scss'
import Button from 'utilities/components/atoms/Button'
import { Chart } from 'react-google-charts'
import Loading from 'utilities/components/atoms/Loading'

const Live = () => {
    // const [response, setResponse] = useState()
    const [data, setData] = useState([])
    const [activated, setActivated] = useState(false)
    const [loading, setLoading] = useState(false)

    const createGraph = (ip) => {
        const interval = setInterval(() => {
            // kijken of dit niet veranderd kan worden naar 80.112.41.171
            fetch(`http://${ip}:9876/P1`)
                .then(res => res.json())
                .then(data => {
                    const map = data.response.map(item => [item.time, item.energy])
                    map.unshift(['Time', 'Energy (kWh)'])
                    setData(map)
                    setLoading(false)
                    setActivated(true)
                })
                .catch(console.error)
        }, 10000);
        return () => clearInterval(interval);
    }

    const activateData = () => {
        console.log('Activated!!!')
        fetch('/api/configure-raspi')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setLoading(true)
                createGraph(data.response)
            })
            .catch(console.error)
    }

    if(activated){
        return (
            <Layout>
                <Card type="tab">
                    <Chart
                    width={'125%'}
                    height={'27.125em'}
                        chartType="LineChart"
                        loader={<Loading />}
                        data={data}
                        options={{
                            curveType: 'function',
                            explorer: { 
                                actions: ['dragToZoom', 'rightClickToReset'],
                                axis: 'horizontal'
                            },
                            animation:{
                                duration: 1000,
                                easing: 'out',
                            },
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

    return (
        <Layout>
            <Card title='Live data'>
                <p>Activeer nu live data.</p>
                {loading ? (
                    <Button text=''>
                        <Loading />
                    </Button>
                ) : (
                    <Button text='Activeer!' handleClick={() => activateData()} />
                )}
            </Card>
        </Layout>
    )
}

export default Live
