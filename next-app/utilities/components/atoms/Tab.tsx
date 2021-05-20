import React from 'react'
import Image from 'next/image'
import styles from 'styles/atoms/Tab.module.scss'

type TabProps = {
    text: string,
    src?: string,
    type? :string
}

const Tab = ({text, src, type}: TabProps) => {
    if(type === 'tabbar'){
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

    return (
        <div className={styles.container}>
            <p>{text}</p>
        </div>
    )
}

export default Tab
