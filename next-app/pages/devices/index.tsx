import React from 'react'
import Layout from 'utilities/components/organisms/Layout'
import Card from 'utilities/components/molecules/Card'
import MainGraph from 'utilities/components/devices/MainGraph'
import Pagination from 'utilities/components/devices/Pagination'
import Text from 'utilities/components/devices/Text'
import CompareOwnGraph from 'utilities/components/devices/CompareOwnGraph'
import CompareHouseholdGraph from 'utilities/components/devices/CompareHouseholdGraph'

const Devices = () => {
    return (
        <Layout>
            <Card title='Totale verbruik'>
                <Pagination />
                <MainGraph />
                <Text />
            </Card>
            <Card type='title' title='Vergelijk jezelf' btntext="Bekijk de vergelijking">
                <CompareOwnGraph />
            </Card>
            <Card type='title' title='Vergelijkbare huishoudens' btntext="Bekijk de vergelijking">
                <CompareHouseholdGraph />
            </Card>
        </Layout>
    )
}

export default Devices
