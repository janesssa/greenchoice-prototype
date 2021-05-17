import Head from 'next/head'
import Image from 'next/image'
import * as React from 'react'
import styles from '../styles/Home.module.css'

type Props = {
  json: (e: React.FormEvent) => void
}

const Home:React.FC<Props>  = ({json}) => {
  return (
    <div>hoi</div>
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