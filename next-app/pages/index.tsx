import Head from 'next/head'
import Image from 'next/image'
import * as React from 'react'
import { useState } from 'react'
import styles from 'styles/Home.module.scss'
import useThemeDetector from 'utilities/hooks/useTheme'
import Title from 'utilities/components/atoms/Title'

type Props = {
  json: (e: React.FormEvent) => void
}

const Home:React.FC<Props>  = ({json}) => {
  const [theme, setTheme] = useState(useThemeDetector())
  return (
    <div className={styles.container + theme}>
      <i></i>
      <b></b>
      <Title></Title>
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