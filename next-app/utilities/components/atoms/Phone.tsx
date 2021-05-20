import React from 'react'
import styles from 'styles/Home.module.scss'


const Phone = ({children}) => {
    return (
        <div className={styles.container}>
            <div className={styles.phone}>
                <i></i>
                <b></b>
            </div>
            {children}
        </div>
    )
}

export default Phone
