import React, { useEffect, useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Loading from 'utilities/components/atoms/Loading'
import Chart from "react-google-charts";
import { calcMean, convertWhTokWh } from 'utilities/helpers'

const CompareHouseholdGraph = () => {
    const { householdID, access_token } = useHouseholdContext()
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

        setState()


    }, [householdID, access_token, fuel, unit])

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
