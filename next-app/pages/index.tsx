import styles from 'styles/Home.module.scss'
import Button from 'utilities/components/atoms/Button'
import useUserData from 'utilities/hooks/useUserData'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Phone from 'utilities/components/atoms/Phone'

const Home: React.FC = () => {
  const { householdID, setHouseholdID } = useHouseholdContext()

  return (
    <Phone>
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
    </Phone>
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