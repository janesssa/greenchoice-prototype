import React, { FunctionComponent } from 'react'
import Link from 'next/link'
import styles from 'styles/atoms/Button.module.scss'

type ButtonType = {
    href?: string,
    text: string,
    handleClick?
}

const Button: FunctionComponent<ButtonType> = ({href, text, handleClick}) => {
    return (
        <div onClick={handleClick} className={styles.container}>
            {href && (
                <Link href={href} >
                    {text + '>'}
                </Link>
            )}
            {!href && (
                <a> {text} </a>
            )}
        </div>
    )
}

export default Button