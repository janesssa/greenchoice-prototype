import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { HouseholdStoreProvider } from 'utilities/household-context'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HouseholdStoreProvider>
      <Component {...pageProps} />
    </HouseholdStoreProvider>
  )
}

export default MyApp
