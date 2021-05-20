import Head from 'next/head'
import Image from 'next/image'
import * as React from 'react'
import styles from 'styles/Home.module.scss'
import Button from 'utilities/components/atoms/Button'
import useUserData from 'utilities/hooks/useUserData'
import { useHouseholdContext, HouseholdContext } from 'utilities/household-context'

type Props = {
  json: (e: React.FormEvent) => void
}

const Home: React.FC<Props> = ({ json }) => {
  const { householdID, setHouseholdID } = useHouseholdContext()

  return (
    <div className={styles.container}>
      <div className={styles.phone}>
        <i></i>
        <b></b>
      </div>
      <div className={styles.background}>
        <div className={styles.formcontainer}>
          <h1>Welkom!</h1>
          <p>Voer hier je klantnummer in en krijg inzicht in je verbruik</p>
          <form className={styles.form} onSubmit={() => useUserData(householdID)} >
            <label htmlFor="householdID">Klantnummer</label>
            <input type="text" name="householdID" value={householdID} onChange={(e) => setHouseholdID(e.target.value)} required />
            <Button href="/live" text="Start!" />
          </form>
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