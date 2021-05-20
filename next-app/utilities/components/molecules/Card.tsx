import React from 'react'
import Image from 'next/image'
import Tab from 'utilities/components/atoms/Tab'
import styles from 'styles/molecules/Card.module.scss'

type CardType = {
    type?: string,
    title?: string,
    children?: React.ReactNode
}

const Card = ({type, title, children}: CardType) => {
    if(type === 'tab') {
        return (
            <div className={styles.container}>
                <div className={styles.tabbar}>
                    <Tab text='Live' />
                    <Tab text='Kwartier' />
                </div>
                <div>
                    {children}
                </div>
            </div>
        )
    }

    if(type === 'title') {
        return (
            <div className={styles.container}>
                <div>
                    <h1>{title}</h1>
                    <p>{'>'}</p>
                </div>
                {children}
            </div>
        )
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default Card
