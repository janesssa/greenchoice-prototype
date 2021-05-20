import React from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Layout from 'utilities/components/organisms/Layout'

const Live = () => {
    const { householdID } = useHouseholdContext()
    return (
        <Layout>
            {JSON.stringify(householdID)}
        </Layout>
    )
}

export default Live
