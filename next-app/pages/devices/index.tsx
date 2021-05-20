import React from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Layout from 'utilities/components/organisms/Layout'
import Card from 'utilities/components/molecules/Card'
import styles from 'styles/Devices.module.scss'

const Devices = () => {
    const { householdID } = useHouseholdContext()
    return (
        <Layout>
            <Card title='Totale verbruik'>
                <h4>Totale verbruik</h4>
                <span className={styles.divider}></span>
            </Card>
            <Card type='title' title='Vergelijk jezelf'></Card>
            <Card type='title' title='Vergelijkbare huishoudens'></Card>
        </Layout>
    )
}

export default Devices
