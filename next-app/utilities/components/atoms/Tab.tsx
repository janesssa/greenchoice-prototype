import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router' 
import styles from 'styles/atoms/Tab.module.scss'

type TabProps = {
    text: string,
    src?: string,
    type?: string,
    href?: string
}

const Tab = ({text, src, type, href}: TabProps) => {
    const router = useRouter()
    if(type.includes('tabbar')){
        if(type.includes('disabled')){
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
        } else {
           
            return (
                <Link href={href}>
                    <a className={router.pathname == href ? `${styles.container} ${styles.active}` : `${styles.container}`}>
                        <Image
                            src={src}
                            alt=""
                            width={16}
                            height={16}
                            color="#000"
                        />
                        <p className={styles.text}>{text}</p>
                    </a>
                </Link>
            )
        }

    }

    return (
        <div className={styles.container}>
            <p>{text}</p>
        </div>
    )
}

export default Tab
