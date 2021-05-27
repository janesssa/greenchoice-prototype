import React, { useEffect, useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import { primary, primaryDark, secondaryA, secondaryB, secondaryD, secondaryI, secondaryT } from 'utilities/colors'
import Loading from 'utilities/components/atoms/Loading'
import Chart from "react-google-charts";
import { convertWhTokWh } from 'utilities/helpers'

const MainGraph = () => {
    const { householdID, access_token, setSelection } = useHouseholdContext()
    const [breakdown, setBreakdown] = useState([])
    const [fuel, setFuel] = useState("elec")
    const [unit, setUnit] = useState("energy")

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
                        if(selection[0] === undefined){
                            setSelection('')
                        } else {
                            setSelection(breakdown[selection[0].row + 1])
                        }
                    }
                }]}
            />
        )
    }
}

export default MainGraph
