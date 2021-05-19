import React from 'react'
import styles from 'styles/molecules/Header.module.scss'
import Title from 'utilities/components/atoms/Title'
import Tab from 'utilities/components/atoms/Tab'

const Header = () => {
    return (
        <div className={styles.container}>
            <Title pos={1} text="Mijn" />
            <Title pos={2} text="Verbruik" />
            <div className={styles.tabbar}>
                <Tab src='/icons/electricity.svg' text='Stroom' />
                <Tab src='/icons/gas.svg' text='Gas' />
                <Tab src='/icons/live.svg' text='Live' />
                <Tab src='/icons/devices.svg' text='Apparaten' />
            </div>

        </div>
    )
}

export default Header
