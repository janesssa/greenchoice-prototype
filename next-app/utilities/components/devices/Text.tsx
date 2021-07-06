import React, { useEffect, useReducer, useState } from 'react'
import styles from 'styles/Devices.module.scss'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import { calcPercentage, convertWhTokWh } from 'utilities/helpers'
import Loading from '../atoms/Loading'
import data from 'utilities/dummy'

const Text = () => {
    const { householdID, access_token, selection } = useHouseholdContext()
    // const [text, setText] = useReducer(
    //     (text, newText) => ({ ...text, ...newText }),
    //     { 'cost': 0, 'energy': 0, 'percentage': '' }
    // )

    const [text, setText] = useState({ 'cost': '', 'energy': '', 'percentage': '' })
    const [fuel, setFuel] = useState("elec")
    const [unit, setUnit] = useState(["energy", "cost"])
    const today = new Date()
    const monthNumber = today.getMonth()
    const year = today.getFullYear()


    useEffect(() => {
        const setState = async () => {
            const cost = data[selection]["amount"]
            const percentage = data[selection]["percentage"]
            const energy = data[selection]['Deze maand']
            setText({cost, energy, percentage})
        }

        if (selection !== undefined && selection.length !== 0) {
            setState()
        }
    }, [selection])

    if (text['energy'] === '' || text['cost'] === '' || text['percentage'] === '') {
        return <Loading />
    } else {
        return (
            <div className={styles.textContainer}>
                <h3>{text.cost}</h3>
                <span className="divider"></span>
                <h2>{text.energy}</h2>
                <span className="divider"></span>
                <h3>{text.percentage}</h3>
            </div>
        )
    }
}

export default Text