import React from 'react'
import styles from 'styles/organisms/Content.module.scss'

const Content = ({children}) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}

export default Content
