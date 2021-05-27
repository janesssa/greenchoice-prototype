import React, { useEffect, useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import styles from 'styles/Devices.module.scss'
import Loading from 'utilities/components/atoms/Loading'
import Button from 'utilities/components/atoms/Button'


const Pagination = () => {
    const { householdID, access_token } = useHouseholdContext()
    const [dates, setDates] = useState(null)
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
                .then(date => setDates(date[0]))
                .catch(err => console.error(err))
        }

        getBreakdown()
    }, [householdID, access_token, fuel, unit])

    const handleClick = () => {
        console.log('yeah')
    }

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

export default Pagination
