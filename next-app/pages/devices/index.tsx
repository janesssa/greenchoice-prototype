import React from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Layout from 'utilities/components/organisms/Layout'
import Card from 'utilities/components/molecules/Card'

const Devices = () => {
    const { householdID } = useHouseholdContext()
    return (
        <Layout>
            {JSON.stringify(householdID)}
            <Card>Hier komt cirkel</Card>
            <Card>Hier komt vergelijk jezelf</Card>
            <Card>Hier komt huishoudens</Card>
        </Layout>
    )
}

export default Devices
