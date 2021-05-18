import React from 'react'
import styles from 'styles/atoms/Title.module.scss'

const Titel = (pos: number, text: String) => {
    if(pos === 1){
        return(
            <div className={styles.container + styles.green}>
                <h1 className={styles.title}>
                    {text}
                </h1>
            </div>
        )
    } 

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                {text}
            </h1>
        </div>
    )
}

export default Titel
