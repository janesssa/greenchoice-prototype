import Head from 'next/head'
import Image from 'next/image'
import * as React from 'react'
import { useState } from 'react'
import styles from 'styles/Home.module.scss'
import useThemeDetector from 'utilities/hooks/useTheme'
import Header from 'utilities/components/molecules/Header'
import Navbar from 'utilities/components/molecules/Navbar'

type Props = {
  json: (e: React.FormEvent) => void
}

const Home: React.FC<Props> = ({ json }) => {
  const onSubmit = () => {
    
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.phone}>
        <i></i>
        <b></b>
        <div className={styles.background}>
          <div className={styles.formcontainer}>
            <h1>Welkom!</h1>
            <p>Voer hier je klantnummer in en krijg inzicht in je verbruik</p>
            <form className={styles.form}>
              <label htmlFor="householdID">Klantnummer</label>
              <input type="text" name="householdID" required />
              <button type="submit" onSubmit={}>Start!</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:8080/api')
  const json = await res.json()

  return {
    props: {
      json
    }
  }
}

export default Home