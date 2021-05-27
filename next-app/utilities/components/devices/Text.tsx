import React, { useEffect, useReducer, useState } from 'react'
import styles from 'styles/Devices.module.scss'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import { calcPercentage, convertWhTokWh } from 'utilities/helpers'
import Loading from '../atoms/Loading'


const Text = () => {
    const { householdID, access_token, selection } = useHouseholdContext()
    const [text, setText] = useReducer(
        (text, newText) => ({ ...text, ...newText }),
        { 'cost': 0, 'energy': 0, 'percentage': '' }
    )
    const [fuel, setFuel] = useState("elec")
    const [unit, setUnit] = useState(["energy", "cost"])
    const today = new Date()
    const monthNumber = today.getMonth()
    const year = today.getFullYear()

    useEffect(() => {
        const getConsumption = async () => {
            const temp: {} = { 'cost': '', 'energy': '', 'percentage': '100%' }

            unit.forEach(async unit => {
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
                        if (`${year}-${month}` in data) {
                            const date = `${year}-${month}`
                            if (unit === 'energy') {
                                temp[unit] = `${convertWhTokWh(data.consumption[date])} kWh`
                            } else {
                                temp[unit] = `€ ${Math.round(data.consumption[date] * 100) / 100}`
                            }
                        } else {
                            let month: string | number = monthNumber
                            if (month < 10) {
                                month = `0${monthNumber}`
                            }
                            const date = `${year}-${month}`
                            if (unit === 'energy') {
                                temp[unit] = `${convertWhTokWh(data.consumption[date])} kWh`
                            } else {
                                temp[unit] = `€ ${Math.round(data.consumption[date] * 100) / 100}`
                            }
                        }
                    })
                    .then(data => setText(temp))
                    .catch(err => console.error(err))
            })


            return
        }

        if (selection === "") {
            getConsumption().catch(console.error)
        }

    }, [householdID, access_token, year, monthNumber, unit, fuel, selection])

    useEffect(() => {
        // TODO: API call the consumption :)
        const total = text.energy.substring(0, text.energy.length - 4)

        const getConsumption = async () => {
            const map = unit.map(async unit => {
                return await fetch(
                    `api/engagement/v2/breakdown/${householdID}/month?fuel=${fuel}&units=${unit}`,
                    {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${access_token}` }
                    })
                    .then(res => res.json())
                    .catch(console.error)
            })

            const dates = await Promise.all(map).then(dates => {
                return dates.map(async date => {
                    return date[0]
                })
            })

            const res = await Promise.all(dates)
                .then(dates => {
                    return unit.map(async unit => {
                        if (unit === 'energy') {
                            return await fetch(
                                `/api/engagement/v2/breakdown/${householdID}/month/${dates[0]}?fuel=${fuel}&units=${unit}`,
                                {
                                    method: "GET",
                                    headers: { "Authorization": `Bearer ${access_token}` }
                                }).then(res => res.json()).catch(console.error)
                        } else {
                            return await fetch(
                                `/api/engagement/v2/breakdown/${householdID}/month/${dates[1]}?fuel=${fuel}&units=${unit}`,
                                {
                                    method: "GET",
                                    headers: { "Authorization": `Bearer ${access_token}` }
                                }).then(res => res.json()).catch(console.error)
                        }
                    })
                })

            const values = await Promise.all(res)
                .then(res => {
                    return res.map(res => {
                        return res.values[selection[0]][1]
                    })
                })
                .then(data => {
                    return {
                        'cost': Math.round(data[1] * 100) / 100,
                        'energy': convertWhTokWh(Math.round(data[0] * 100) / 100)
                    }
                })

            const part = values.energy
            const percentage = calcPercentage(part, total)

            return {
                'cost': `€ ${values.cost}`,
                'energy': `${values.energy} kWh`,
                'percentage': percentage
            }

        }

        if (selection !== "") {
            getConsumption().then(res => setText(res)).catch(console.error)
        }

    }, [householdID, access_token, year, monthNumber, unit, fuel, selection])


    if (text === {} || text['energy'] === '' || text['cost'] === '' || text['percentage'] === '') {
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