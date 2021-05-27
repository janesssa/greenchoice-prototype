import React from 'react'
import Tab from 'utilities/components/atoms/Tab'
import styles from 'styles/molecules/Card.module.scss'
import Button from 'utilities/components/atoms/Button'

type CardType = {
    type?: string,
    title?: string,
    children?: React.ReactNode,
    btntext?: string
}

const Card = ({type, title, children, btntext}: CardType) => {
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
                <div className={styles.title}>
                    <h3>{title}</h3>
                    <h3>{'>'}</h3>
                </div>
                <div>
                    {children}
                </div>
                <Button href='/404' text={btntext} />
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h4 className={styles.smallTitle}>{title}</h4>
            <span className="divider"></span>
            {children}
        </div>
    )
}

export default Card
