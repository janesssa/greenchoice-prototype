import React from 'react'
import Header from 'utilities/components/molecules/Header'
import Navbar from 'utilities/components/molecules/Navbar'
import styles from 'styles/organisms/Layout.module.scss'

const Layout = ({children}) => {
    return (
        <div className={styles.container}>
            <Header />
            <Navbar />
            {...children}
        </div>
    )
}

export default Layout
