import React from 'react'
import styles from 'styles/atoms/Title.module.scss'

type TitleProps = {
    pos: number,
    text: String
}

const Title = ({pos, text}: TitleProps) => {
    if(pos === 1){
        return(
            <div className={`${styles.container} ${styles.upper}`}>
                <h1 className={styles.title}>
                    {text}
                </h1>
            </div>
        )
    } 

    return (
        <div className={`${styles.container} ${styles.lower}`}>
            <h1 className={styles.title}>
                {text}
            </h1>
        </div>
    )
}

export default Title
