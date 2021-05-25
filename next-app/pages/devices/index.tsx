import React, { useEffect, useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Layout from 'utilities/components/organisms/Layout'
import Card from 'utilities/components/molecules/Card'
import styles from 'styles/Devices.module.scss'
import { primary, primaryDark, secondaryA, secondaryB, secondaryD, secondaryI, secondaryT } from 'utilities/colors'
import Loading from 'utilities/components/atoms/Loading'
import Chart from "react-google-charts";
import Button from 'utilities/components/atoms/Button'

const Devices = () => {
    const { householdID, access_token, response } = useHouseholdContext()
    const [values, setValues] = useState([])
    const [selection, setSelection] = useState("")
    const [dates, setDates] = useState(null)
    const [fuel, setFuel] = useState("elec")
    const [unit, setUnit] = useState("energy")
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()
    const pastYear = year - 1


    useEffect(() => {
        console.log(today, month, year, pastYear)
        const getBreakdown = async () => {
            return await fetch(
                `/api/engagement/v2/breakdown/${householdID}/month?fuel=${fuel}&units=${unit}`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .then(date => {
                    setDates(date[0])
                    fetch(
                        `/api/engagement/v2/breakdown/${householdID}/month/${date[0]}?fuel=${fuel}&units=${unit}`,
                        {
                            method: "GET",
                            headers: { "Authorization": `Bearer ${access_token}` }
                        })
                        .then(res => res.json())
                        .then(data => {
                            let values = []
                            values.push(["Category", "Usage"])
                            Object.keys(data.values).forEach(item => {
                                if (data.values[item][1] !== 0) {
                                    values.push([item, Math.round(data.values[item][1] / 1000 * 100) / 100])
                                }
                            });
                            setValues(values)
                        })
                        .catch(err => console.error(err))
                })
                .catch(err => console.error(err))

        }

        getBreakdown()
    }, [householdID, access_token, fuel, unit])

    useEffect(() => {
        const getMonths = async () => {
            return await fetch(
                `api/engagement/v2/consumption/${householdID}/monthly?fuel=${fuel}&units=${unit}`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .catch(err => console.error(err))
        }

        const getLastYearsUsage = async () => {
            return await fetch(
                `api/engagement/v2/consumption/${householdID}/monthly?fuel=${fuel}&units=${unit}`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
        }

        const temp = [1, 2, 3, 4, 5, 4, 32]
        const calcMean = (arr) => {
            let total = 0;
            arr.forEach(num => {
                total += num;
            })
            return total / arr.length
        }

        console.log(calcMean(temp))

        const getComparison = async () => {
            return await fetch(
                `api/engagement/v2/profile/${householdID}/peer-groups`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => console.log(res.json()))
        }

        getMonths()
        getComparison()

    }, [householdID, access_token, fuel, unit])

    const MainGraph = () => {
        if (response === {}) {
            return <Loading />
        } else {
            return (
                <Chart
                    width={'125%'}
                    height={'27.125em'}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'transparent' }}
                    chartType="PieChart"
                    loader={<Loading />}
                    data={values}
                    options={{
                        legend: 'none',
                        pieHole: 0.7,
                        pieSliceText: 'none',
                        backgroundColor: 'transparent',
                        colors: [primary, primaryDark, secondaryD, secondaryI, secondaryB, secondaryA, secondaryT]
                    }}
                    chartEvents={[{
                        eventName: 'select',
                        callback: ({ chartWrapper }) => {
                            const chart = chartWrapper.getChart()
                            const selection = chart.getSelection()
                            setSelection(values[selection[0].row + 1])
                        }
                    }]}
                />
            )
        }
    }

    const handleClick = () => {
        console.log('yeah')
    }

    const Pagination = () => {
        if (dates === null) {
            return <Loading />
        } else {
            return (<span className={styles.pagination}>
                <Button text="<" handleClick={() => handleClick()} />
                {dates}
                <Button text=">" handleClick={() => handleClick()} />
            </span>)
        }
    }

    return (
        <Layout>
            <Card title='Totale verbruik'>
                <Pagination />
                <MainGraph />
            </Card>
            <Card type='title' title='Vergelijk jezelf'></Card>
            <Card type='title' title='Vergelijkbare huishoudens'></Card>
        </Layout>
    )
}

export default Devices
