import React, { useEffect, useState } from 'react'
import Layout from 'utilities/components/organisms/Layout'
import Card from 'utilities/components/molecules/Card'
import styles from 'styles/Live.module.scss'
import Button from 'utilities/components/atoms/Button'
import { Chart } from 'react-google-charts'
import Loading from 'utilities/components/atoms/Loading'

const Live = () => {
    const [response, setResponse] = useState()
    const [data, setData] = useState([])

    useEffect(() => {
        const interval = setInterval(() => {
            // kijken of dit niet veranderd kan worden naar 80.112.41.171
            fetch('http://0.0.0.1:8081/P1')
                .then(res => res.json())
                .then(data => {
                    const map = data.response.map(item => [item.time, item.energy])
                    map.unshift(['Time', 'Energy (kWh)'])
                    setData(map)
                })
                .catch(console.error)
        }, 10000);
        return () => clearInterval(interval);
    }, []);

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

export default Live
