import React, { useEffect, useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Loading from 'utilities/components/atoms/Loading'
import Chart from "react-google-charts";
import { calcMean, convertWhTokWh } from 'utilities/helpers'
import data from 'utilities/dummy'

const CompareHouseholdGraph = () => {
    const { householdID, access_token, selection } = useHouseholdContext()
    const [compareHouseholds, setCompareHouseholds] = useState([])
    const [fuel, setFuel] = useState("elec")
    const [unit, setUnit] = useState("energy")
    const today = new Date()
    const monthNumber = today.getMonth()
    const year = today.getFullYear()

    useEffect(() => {
        const setState = async () => {
            const c = ["Jouw verbruik", data[selection]["Jouw verbruik"]]
            const a = ["Soortgelijke huishoudens", data[selection]["Soortgelijke huishoudens"]]
            setCompareHouseholds([["Title", "Unit"], c, a])
        }

        if (selection !== undefined && selection.length !== 0) {
            setState()
        }
    }, [selection])

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
