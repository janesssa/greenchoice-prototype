import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { HouseholdProvider } from 'utilities/contexts/household-context'
import { AuthProvider } from 'utilities/contexts/auth-context'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HouseholdProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </HouseholdProvider>
  )
}

export default MyApp
