import React from 'react'
import styles from 'styles/atoms/Tab.module.scss'

type TabProps = {
    src: String,
    text: String
}

const Tab = ({src, text}: TabProps) => {
    return (
        <div>
            {/* <img src="" alt="" /> */}
            <p>{text}</p>
        </div>
    )
}

export default Tab
