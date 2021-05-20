import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import { useHouseholdContext } from 'utilities/contexts/household-context'

const AuthContext = createContext({})

type UserType = {
    user: string,
    setUser: Dispatch<SetStateAction<string>>
}

function AuthProvider({ children }) {
  const { pathname, events } = useRouter()
  const [user, setUser] = useState<string>('')
  const { householdID } = useHouseholdContext()

  const getUser = () => {
      if (/^\d+$/.test(householdID) && householdID.length === 4) {
        setUser(householdID)
      } else {
        setUser('')
      }
  }


  useEffect(() => {
    getUser()
  }, [pathname])

  useEffect(() => {
    // Check that a new route is OK
    const handleRouteChange = url => {
      debugger
      if (url !== '/' && user === '') {
        window.location.href = '/'
      }
    }

    // Check that initial route is OK
    if (pathname !== '/' && user === '') {
      window.location.href = '/'
    }

    // Monitor routes
    // events.on('routeChangeStart', handleRouteChange)
    return () => {
      events.off('routeChangeStart', handleRouteChange)
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }