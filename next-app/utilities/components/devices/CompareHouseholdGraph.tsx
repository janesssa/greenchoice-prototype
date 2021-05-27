import React, { useEffect, useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Loading from 'utilities/components/atoms/Loading'
import Chart from "react-google-charts";
import { calcMean, convertWhTokWh } from 'utilities/helpers'

const CompareHouseholdGraph = () => {
    const { householdID, access_token, selection } = useHouseholdContext()
    const [compareHouseholds, setCompareHouseholds] = useState([])
    const [fuel, setFuel] = useState("elec")
    const [unit, setUnit] = useState("energy")
    const today = new Date()
    const monthNumber = today.getMonth()
    const year = today.getFullYear()

    useEffect(() => {

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
                    const percentiles: {} = data[1]
                    const arr = Object.values(percentiles as {})
                    const filtered: number[] = arr.filter((item): item is number => typeof item === 'number' && percentiles[item] !== 'size')
                    const mean = calcMean(filtered, percentiles["size"])

                    // Old code --- Gets percentiles the client falls between and calculates the mean of those percentiles
                    // const sorted: number[] = sortArray(filtered)
                    // const bottom: number = sorted.find(item => item > consumption)
                    // const firstPC: string = getKeyByValue(percentiles, bottom)
                    // const secondPC: string = getNextPercentile(firstPC)
                    // const mean: number = calcMean([percentiles[firstPC], percentiles[secondPC]])
                    return ["Soortgelijke huishoudens", Math.round(mean)]
                })
                .catch(err => console.error(err))
        }

        const setState = async () => {
            const c = await getConsumption()
            const a = await getHouseholdAverage()

            setCompareHouseholds([["Title", "Unit"], c, a])
        }

        if (selection === undefined || selection.length === 0) {
            setState()
        }

    }, [householdID, access_token, fuel, unit, selection])

    useEffect(() => {
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
                    switch (selection[0]) {
                        case "always_on":
                            group = data['all-for-always-on']
                            break
                        case "cooking":
                            if(fuel === 'elec'){
                                group = data['all-for-electric-cooking']
                            } else if (fuel === 'gas'){
                                group = data['all-for-gas-cooking']
                            }
                            break
                        case "cooling":
                            group = data['all-for-cooling']
                            break
                        case "electric_vehicle":
                            group = data['all-for-electric']
                            break
                        case "home_entertainment":
                            group = data['all-for-home-entertainment']
                            break
                        case "heating":
                            if(fuel === 'elec'){
                                group = data['all-for-electric-heating']
                            } else if (fuel === 'gas'){
                                group = data['all-for-gas-heating']
                            }
                            break
                        case "laundry_dishwashing":
                            group = data['all-for-laundry-dishwashing']
                            break
                        case "lighting":
                            group = data['all-for-lighting']
                            break
                        case "other":
                            group = data['all-for-other']
                            break
                        case "refrigeration":
                            group = data['all-for-refrigeration']
                            break
                        case "water_heating":
                            if(fuel === 'elec'){
                                group = data['all-for-electric-water-heating']
                            } else if (fuel === 'gas'){
                                group = data['all-for-gas-water-heating']
                            }
                            break
                        default:
                            if (fuel === 'elec') {
                                group = data['all-electric']
                            } else if (fuel === 'gas') {
                                group = data['all-gas']
                            }
                    }
                    console.log(selection, group)
                    return group
                })
                .catch(err => console.log(err))
        }

        const getBreakdown = async () => {
            return await fetch(
                `/api/engagement/v2/breakdown/${householdID}/1day?fuel=${fuel}&units=${unit}`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                })
                .then(res => res.json())
                .then(async date => {
                    console.log(date)
                    return await fetch(
                        `/api/engagement/v2/breakdown/${householdID}/1day/${date[0]}?fuel=${fuel}&units=${unit}`,
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

        const getShit = async () => {
            return await fetch(
                `/api/engagement/v2/breakdown`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${access_token}` }
                }).then(res => console.log(res.json()))
        }


        const getHouseholdAverage = async () => {
            return await Promise.all([getBreakdown(), getPercentiles()])
                .then((data: ((string | number)[] | {})) => {
                    console.log(data)
                    const percentiles: {} = data[1]
                    const arr = Object.values(percentiles as {})
                    const filtered: number[] = arr.filter((item): item is number => typeof item === 'number' && percentiles[item] !== 'size')
                    const mean = calcMean(filtered, percentiles["size"])

                    console.log(mean)

                    // Old code --- Gets percentiles the client falls between and calculates the mean of those percentiles
                    // const sorted: number[] = sortArray(filtered)
                    // const bottom: number = sorted.find(item => item > consumption)
                    // const firstPC: string = getKeyByValue(percentiles, bottom)
                    // const secondPC: string = getNextPercentile(firstPC)
                    // const mean: number = calcMean([percentiles[firstPC], percentiles[secondPC]])
                    return ["Soortgelijke huishoudens", Math.round(mean * 100) / 100]
                })
                .catch(err => console.error(err))
        }

        const setState = async () => {
            const c = await getBreakdown()
            const a = await getHouseholdAverage()

            setCompareHouseholds([["Title", "Unit"], c, a])
        }
        
        if (selection !== undefined && selection.length !== 0) {
            setState()
        }


    getShit()    }, [householdID, access_token, fuel, unit, selection])

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


export default CompareHouseholdGraph
