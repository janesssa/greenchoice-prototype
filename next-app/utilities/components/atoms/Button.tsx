import React, { FunctionComponent } from 'react'
import Link from 'next/link'
import styles from 'styles/atoms/Button.module.scss'

type ButtonType = {
    href: string,
    text: string
}

const Button: FunctionComponent<ButtonType> = ({href, text}) => {
    return (
        <div className={styles.container}>
            <Link href={href} >
                {text + '>'}
            </Link>
        </div>
    )
}

export default Button