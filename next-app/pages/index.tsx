import { useEffect } from 'react'
import styles from 'styles/Home.module.scss'
import Button from 'utilities/components/atoms/Button'
import { useHouseholdContext } from 'utilities/contexts/household-context'
import Phone from 'utilities/components/atoms/Phone'
import { useRouter } from 'next/router'

type HomeType = {
  json: {
    access_token: string
  }
}

const Home: React.FC<HomeType> = ({ json }) => {
  const { householdID, setHouseholdID, setAccessToken, access_token, setResponse } = useHouseholdContext()
  const router = useRouter()
  const onSubmit = async () => {
    const res = await fetch(
      `/api/engagement/v2/profile/${householdID}`,
      {
        method: "GET",
        headers: { "Authorization": `Bearer ${access_token}` }
      }).then(res => res.json())
      .then(data => data)
      .catch(err => console.log(err))
    setResponse(res)
  }

  const handleKeyPress = async (e) => {
    if(e.key === 'Enter'){
      await onSubmit()
      router.push('/live')
    }
  }

  useEffect(() => {
    setAccessToken(json.access_token)
  }, [json])

  return (
    <Phone>
      <div className={styles.background}>
        <div className={styles.formcontainer}>
          <h1>Welkom!</h1>
          <p>Voer hier je klantnummer in en krijg inzicht in je verbruik</p>
          <form className={styles.form} >
            <label htmlFor="householdID">Klantnummer</label>
            <input type="text" name="householdID" value={householdID} onChange={(e) => setHouseholdID(e.target.value)} required onKeyPress={(e) => handleKeyPress(e)} />
            <Button href="/live" text="Start!" handleClick={onSubmit} />
          </form>
        </div>
      </div>
    </Phone>
  )
}


export async function getServerSideProps() {
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: "https://api.onzo.com/engagement/"
    })
  }

  const res = await fetch("https://api.onzo.io/oauth/token", options);
  const json = await res.json();

  return { props: { json } };
}

export default Home