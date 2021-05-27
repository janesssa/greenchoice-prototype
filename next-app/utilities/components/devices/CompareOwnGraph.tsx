import React, { useEffect, useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import { primary, secondaryA, secondaryI } from 'utilities/colors'
import Loading from 'utilities/components/atoms/Loading'
import Chart from "react-google-charts";
import { calcMean, convertWhTokWh } from 'utilities/helpers'


const CompareOwnGraph = () => {
    const { householdID, access_token } = useHouseholdContext()
    const [compareOwn, setCompareOwn] = useState([])
    const [fuel, setFuel] = useState("elec")
    const [unit, setUnit] = useState("energy")
    const today = new Date()
    const monthNumber = today.getMonth()
    const year = today.getFullYear()
    const pastYear = year - 1

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

export default CompareOwnGraph
