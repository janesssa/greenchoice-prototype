import React from 'react'
import styles from 'styles/molecules/Header.module.scss'
import Title from '../atoms/Title'

const Header = () => {
    return (
        <div className={styles.container}>
            
      <Title pos={1} text="Mijn" />
      <Title pos={2} text="Verbruik" />
        </div>
    )
}

export default Header
