import React, { useEffect, useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import { primary, secondaryA, secondaryI } from 'utilities/colors'
import Loading from 'utilities/components/atoms/Loading'
import Chart from "react-google-charts";
import { calcMean, convertWhTokWh } from 'utilities/helpers'


const CompareOwnGraph = () => {
    const { householdID, access_token, selection } = useHouseholdContext()
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
                    let month: string | number = monthNumber + 1
                    if (month < 10) {
                        month = `0${monthNumber + 1}`
                    }
                    if(`${year}-${month}` in data){
                        return ["Deze maand", convertWhTokWh(data.consumption[`${year}-${month}`]), `color: ${secondaryI}`]
                    } else {
                        let month: string | number = monthNumber
                        if (month < 10) {
                            month = `0${monthNumber}`
                        }
                        return ["Deze maand", convertWhTokWh(data.consumption[`${year}-${month}`]), `color: ${secondaryI}`]
                    }
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

        if (selection === undefined || selection.length === 0) {
            getValues().catch(console.error)
        }
    }, [householdID, access_token, fuel, unit, selection])

    useEffect(() => {
        const getBreakdown = async () => {
            return await fetch(
                `/api/engagement/v2/breakdown/${householdID}/month?fuel=${fuel}&units=${unit}`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .then(async date => {
                    return await fetch(
                        `/api/engagement/v2/breakdown/${householdID}/month/${date[0]}?fuel=${fuel}&units=${unit}`,
                        {
                            method: "GET",
                            headers: { "Authorization": `Bearer ${access_token}` }
                        })
                        .then(res => res.json())
                        .then(data => {
                            // TODO: make locale object for text labels
                            return [selection[0], convertWhTokWh(data.values[selection[0]][1])]
                        })
                        .catch(err => console.error(err))
                })
                .catch(err => console.error(err))

        }

        const getMean = async () => {
            const months = await fetch(
                `api/engagement/v2/breakdown/${householdID}/month?fuel=${fuel}&units=${unit}&limit=7`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .catch(err => console.error(err))

            const res: number[] = months.map(async (year: number) => {
                return await fetch(
                    `api/engagement/v2/breakdown/${householdID}/month/${year}?fuel=${fuel}&units=${unit}`,
                    {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${access_token}` }
                    })
                    .then(res => res.json())
                    .then(data => {
                        let days = data.actualNumberOfDays
                        let consumption = data.values[selection[0]][1]
                        let dayAvg: number = (consumption as number) / (days as number)
                        return convertWhTokWh(dayAvg)
                    })
                    .catch(err => console.error(err))
            })

            const mean: number | void = await Promise.all(res).then((data: number[]) => calcMean(data)).catch(err => console.error(err))
            
            return ["7 daagse gemiddelde", mean]
        }

        const getPastYearsUsage = async () => {
            let month: string | number = monthNumber + 1
            if (month < 10) {
                month = `0${monthNumber + 1}`
            }
            let lastDateOfMonth: string | number = new Date(year, monthNumber + 1, 0).getDate()
            if(lastDateOfMonth < 10){
                lastDateOfMonth = `0${lastDateOfMonth}`
            }
            const startDate = `${pastYear}-${month}-01`
            const endDate = `${pastYear}-${month}-${lastDateOfMonth}`
            
            return await fetch(
                `api/engagement/v2/breakdown/${householdID}/${startDate}/${endDate}?fuel=${fuel}&units=${unit}`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .then(data => {
                    let days = data.actualNumberOfDays
                    let consumption = data.values[selection[0]][1]
                    let avg = consumption / days
                    return [`Vorig jaar ${new Intl.DateTimeFormat('nl-NL', { month: "long" }).format(monthNumber)}`, convertWhTokWh(consumption)]
                })
                .catch(err => console.error(err))
        }

        const getValues = async () => {
            return await Promise.all([getMean(), getPastYearsUsage(), getBreakdown()])
                .then(data => {
                    let values = []
                    values.push(["Time", "Unit"])
                    data.forEach(item => {
                        values.push(item)
                    })
                    
                    setCompareOwn(values)
                })
                .catch(err => console.error(err))
        }

        if (selection !== undefined && selection.length !== 0) {
            getValues()
        }
    }, [householdID, access_token, fuel, unit, selection])

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
