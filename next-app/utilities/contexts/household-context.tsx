import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'

type HouseholdType = {
    householdID: string,
    setHouseholdID: Dispatch<SetStateAction<string>>
    access_token: string
    setAccessToken: Dispatch<SetStateAction<string>>
}

export const HouseholdContext = createContext<HouseholdType>({
    householdID: '',
    setHouseholdID: null,
    access_token: '',
    setAccessToken: null
})

export const useHouseholdContext = () => useContext(HouseholdContext)


export const HouseholdProvider = ({ children }) => {

    const [householdID, setHouseholdID] = useState<string>('');
    const [access_token, setAccessToken] = useState<string>('');

    return (
        <HouseholdContext.Provider value={{ householdID, setHouseholdID, access_token, setAccessToken  }}>        
                        {children}    
        </HouseholdContext.Provider>
    )
}
