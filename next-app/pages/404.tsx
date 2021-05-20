import React from 'react'
import Button from 'utilities/components/atoms/Button'
import { useRouter } from 'next/router'
import Phone from 'utilities/components/atoms/Phone'
import styles from 'styles/Home.module.scss'

const Error = () => {
    const router = useRouter()
    return (
        <Phone>
            <div className={styles.background}>
            <div className={styles.formcontainer}>
                <p>Oh nee! Het lijkt er op dat deze pagina niet bestaat</p>
                <Button text='Ga terug' handleClick={router.back} />
            </div>
            </div>
        </Phone>
    )
}

export default Error
