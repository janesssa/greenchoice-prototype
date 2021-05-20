import React from 'react'
import Link from 'next/link'
import styles from 'styles/atoms/Button.module.scss'

type ButtonType = {
    href: string,
    text: string
}

const Button = ({href, text}: ButtonType) => {
    return (
        <div className={styles.container}>
            <Link href={href} >
                {text}
                {'>'}
            </Link>

        </div>
    )
}

export default Button