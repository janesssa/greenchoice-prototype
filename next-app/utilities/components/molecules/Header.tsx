import React from 'react'
import styles from 'styles/molecules/Header.module.scss'
import Title from 'utilities/components/atoms/Title'
import Tab from 'utilities/components/atoms/Tab'

const Header = () => {
    return (
        <div className={styles.container}>
            <Title pos={1} text="Mijn" />
            <Title pos={2} text="Verbruik" />
            <span className={styles.tabbar}>
                <Tab src='' text='Stroom' />
                <Tab src='' text='Gas' />
                <Tab src='' text='Live' />
                <Tab src='' text='Apparaten' />
            </span>

        </div>
    )
}

export default Header
