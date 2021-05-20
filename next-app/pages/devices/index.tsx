import React from 'react'
import { useHouseholdContext } from 'utilities/household-context'
import Layout from 'utilities/components/organisms/Layout'

const Devices = () => {
    const { householdID } = useHouseholdContext()
    return (
        <Layout>
            {JSON.stringify(householdID)}
        </Layout>
    )
}

export default Devices
