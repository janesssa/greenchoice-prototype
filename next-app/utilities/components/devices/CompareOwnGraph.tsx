import React, { useEffect, useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import { primary, secondaryA, secondaryI } from 'utilities/colors'
import Loading from 'utilities/components/atoms/Loading'
import Chart from "react-google-charts";
import { calcMean, convertWhTokWh } from 'utilities/helpers'
import data from 'utilities/dummy'


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
        const getValues = () => {
                    let values = []
                    values.push(["Time", "Unit", { role: 'style' }])
                    values.push(["Jouw verbruik", data[selection]["Jouw verbruik"], `color: ${primary}`])
                    values.push(["Gemiddelde", data[selection]["Gemiddelde"], `color: ${secondaryI}`])
                    values.push(["Vorig jaar", data[selection]["Vorig jaar"], `color: ${secondaryA}`])
                    setCompareOwn(values)
                }
        
        if (selection !== undefined && selection.length !== 0) {
            getValues()
        }
    }, [selection])

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
