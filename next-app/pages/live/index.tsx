import React from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Layout from 'utilities/components/organisms/Layout'
import Card from 'utilities/components/molecules/Card'
import styles from 'styles/Live.module.scss'
import Button from 'utilities/components/atoms/Button'

const Live = () => {
    const { householdID } = useHouseholdContext()
    return (
        <Layout>
            <Card type="tab" />
            <Card title="Live data bewaren">
                <b>Wil je de live data langer bewaren?</b>
                <p>We raden je aan om een persoonlijke opslag aan te schaffen. Denk aan een USB-stick of een harde schijf.</p>
                <p className={styles.link}>Weten waarom wij de data niet voor je opslaan? Lees meer {'>'}</p>
                <p>Of gebruik onze rekenhulp om te berekenen hoeveel opslag je nodig hebt!</p>
                <Button text='Bereken' href='/live/calc' />
            </Card>
        </Layout>
    )
}

export default Live
