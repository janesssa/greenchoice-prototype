import React from 'react'
import Image from 'next/image'
import styles from 'styles/atoms/Tab.module.scss'

type TabProps = {
    src: string,
    text: string
}

const Tab = ({src, text}: TabProps) => {
    return (
        <div className={styles.container}>
            <Image
                src={src}
                alt=""
                width={16}
                height={16}
                color="#000"
            />
            <p className={styles.text}>{text}</p>
        </div>
    )
}

export default Tab
