import React, { useEffect, useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Layout from 'utilities/components/organisms/Layout'
import Card from 'utilities/components/molecules/Card'
import styles from 'styles/Devices.module.scss'
import { primary, primaryDark, secondaryA, secondaryB, secondaryD, secondaryI, secondaryT } from 'utilities/colors'
import Loading from 'utilities/components/atoms/Loading'
import Chart from "react-google-charts";
import Button from 'utilities/components/atoms/Button'
import { sortArray, getKeyByValue, getNextPercentile, calcMean, convertWhTokWh } from 'utilities/helpers'

const Devices = () => {
    const { householdID, access_token, response } = useHouseholdContext()
    const [breakdown, setBreakdown] = useState([])
    const [compareOwn, setCompareOwn] = useState([])
    const [compareHouseholds, setCompareHouseholds] = useState([])
    const [selection, setSelection] = useState("")
    const [dates, setDates] = useState(null)
    const [fuel, setFuel] = useState("elec")
    const [unit, setUnit] = useState("energy")
    const today = new Date()
    const monthNumber = today.getMonth()
    const year = today.getFullYear()
    const pastYear = year - 1

    useEffect(() => {
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
                                    values.push([item, convertWhTokWh(data.values[item][1])])
                                }
                            });
                            setBreakdown(values)
                        })
                        .catch(err => console.error(err))
                })
                .catch(err => console.error(err))

        }

        getBreakdown()
    }, [householdID, access_token, fuel, unit])

    useEffect(() => {

        const getConsumption = async () => {
            return await fetch(
                `api/engagement/v2/consumption/${householdID}/monthly/${year}?fuel=${fuel}&units=${unit}`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .then(data => {
                    let month: string | number = monthNumber
                    if (month < 10) {
                        month = `0${monthNumber}`
                    }
                    return ["Deze maand", convertWhTokWh(data.consumption[`${year}-${month}`]), `color: ${secondaryI}`]
                })
                .catch(err => console.error(err))
        }

        const getMean = async () => {
            const months = await fetch(
                `api/engagement/v2/consumption/${householdID}/monthly?fuel=${fuel}&units=${unit}`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .catch(err => console.error(err))

            const res: number[] = months.map(async (year: number) => {
                return await fetch(
                    `api/engagement/v2/consumption/${householdID}/monthly/${year}?fuel=${fuel}&units=${unit}`,
                    {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${access_token}` }
                    })
                    .then(res => res.json())
                    .then(data => {
                        let days = Object.values(data.actualNumberOfDays).reduce((a: number, b: number) => a + b)
                        let consumption = Object.values(data.consumption).reduce((a: number, b: number) => a + b)
                        let dayAvg: number = (consumption as number) / (days as number)
                        let monthAvg = convertWhTokWh((dayAvg * 30.5))
                        return monthAvg
                    })
                    .catch(err => console.error(err))
            })

            const mean: number | void = await Promise.all(res).then((data: number[]) => calcMean(data)).catch(err => console.error(err))
            return ["Gemiddelde", mean, `color: ${secondaryA}`]
        }

        const getPastYearsUsage = async () => {
            return await fetch(
                `api/engagement/v2/consumption/${householdID}/monthly/${pastYear}?fuel=${fuel}&units=${unit}`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .then(data => {
                    let month: string | number = monthNumber
                    if (month < 10) {
                        month = `0${monthNumber}`
                    }
                    let days = data.actualNumberOfDays[`${pastYear}-${month}`]
                    let consumption = data.consumption[`${pastYear}-${month}`]
                    let avg = consumption / days
                    return [`Vorig jaar ${new Intl.DateTimeFormat('nl-NL', { month: "long" }).format(monthNumber)}`, convertWhTokWh(consumption), `color: ${primary}`]
                })
                .catch(err => console.error(err))
        }

        const getValues = async () => {
            return await Promise.all([getMean(), getPastYearsUsage(), getConsumption()])
                .then(data => {
                    let values = []
                    values.push(["Time", "Unit", { role: 'style' }])
                    data.forEach(item => {
                        values.push(item)
                    })
                    setCompareOwn(values)
                })
                .catch(err => console.error(err))
        }

        getValues().catch(console.error)
    }, [householdID, access_token, fuel, unit])

    useEffect(() => {
        const getComparison = async () => {
            return await fetch(
                `api/engagement/v2/profile/${householdID}/peer-groups`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .catch(err => console.error(err))
        }

        const getPercentiles = async () => {
            let month: string | number = monthNumber
            if (month < 10) {
                month = `0${monthNumber}`
            }
            return await fetch(
                `api/engagement/v2/peer-group-stats`,
                // Add this to make it responsable
                // ?units=consumption&month_of_year=${year}-${month}
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .then(data => {
                    let group = {}
                    if (fuel === 'elec') {
                        group = data['all-electric']
                    } else if (fuel === 'gas') {
                        group = data['all-gas']
                    }
                    return group
                })
                .catch(err => console.log(err))
        }

        const getConsumption = async () => {
            return await fetch(
                `api/engagement/v2/consumption/${householdID}/monthly/${year}?fuel=${fuel}&units=${unit}`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .then(data => {
                    let month: string | number = monthNumber
                    if (month < 10) {
                        month = `0${monthNumber}`
                    }
                    return ["Jouw verbruik", convertWhTokWh(data.consumption[`${year}-${month}`])]
                })
                .catch(err => console.error(err))
        }

        const getHouseholdAverage = async () => {
            return await Promise.all([getConsumption(), getPercentiles()])
                .then((data: ((string | number)[] | {})) => {
                    const consumption: number = data[0][1]
                    const percentiles: {} = data[1]
                    const arr = Object.values(percentiles as {})
                    const filtered: number[] = arr.filter((item): item is number => typeof item === 'number')
                    const sorted: number[] = sortArray(filtered)
                    const bottom: number = sorted.find(item => item > consumption)
                    const firstPC: string = getKeyByValue(percentiles, bottom)
                    const secondPC: string = getNextPercentile(firstPC)
                    const mean: number = calcMean([percentiles[firstPC], percentiles[secondPC]])
                    return ["Soortgelijke huishoudens", Math.round(mean)]
                })
                .catch(err => console.error(err))
        }

        const setState = async () => {
            const c = await getConsumption()
            const a = await getHouseholdAverage()

            setCompareHouseholds([["Title", "Unit"], c, a])
        }

        setState()


    }, [householdID, access_token, fuel, unit])

    const MainGraph = () => {
        if (breakdown.length === 0) {
            return <Loading />
        } else {
            return (
                <Chart
                    width={'125%'}
                    height={'27.125em'}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'transparent' }}
                    chartType="PieChart"
                    loader={<Loading />}
                    data={breakdown}
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
                            setSelection(breakdown[selection[0].row + 1])
                        }
                    }]}
                />
            )
        }
    }

    const CompareOwnGraph = () => {
        if (compareOwn.length === 0) {
            return <Loading />
        } else {
            return <Chart
                width={'18em'}
                height={'17.5em'}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'transparent' }}
                chartType="Bar"
                loader={<Loading />}
                data={compareOwn}
                options={{
                    titlePosition: 'none',
                    hAxis: { textPosition: 'none' },
                    legend: { position: 'none' },
                    bar: { groupWidth: "25%" }
                }}
            />
        }
    }

    const CompareHouseholdGRaph = () => {
        if (compareHouseholds.length === 0) {
            return <Loading />
        } else {
            return <Chart
                width={'18em'}
                height={'17.5em'}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'transparent' }}
                chartType="Bar"
                loader={<Loading />}
                data={compareHouseholds}
                options={{
                    titlePosition: 'none',
                    hAxis: { textPosition: 'none' },
                    legend: { position: 'none' },
                    bar: { groupWidth: "25%" }
                }}
            />
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
            <Card type='title' title='Vergelijk jezelf' btntext="Bekijk de vergelijking">
                <CompareOwnGraph />
            </Card>
            <Card type='title' title='Vergelijkbare huishoudens' btntext="Bekijk de vergelijking">
                <CompareHouseholdGRaph />
            </Card>
        </Layout>
    )
}

export default Devices
