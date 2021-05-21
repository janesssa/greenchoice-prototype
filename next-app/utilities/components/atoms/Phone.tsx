import React from 'react'
import styles from 'styles/atoms/Phone.module.scss'
import Navbar from '../molecules/Navbar'


const Phone = ({children}) => {
    return (
        <div className={styles.container}>
            <div className={styles.phone}>
                <i></i>
                <b></b>
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}

export default Phone
