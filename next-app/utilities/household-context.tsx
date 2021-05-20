import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'

type HouseholdType = {
    householdID: string
    setHouseholdID: Dispatch<SetStateAction<string>>
}

export const HouseholdContext = createContext<HouseholdType>({
    householdID: '',
    setHouseholdID: null
})

export const useHouseholdContext = () => useContext(HouseholdContext)


export const HouseholdStoreProvider = ({ children }) => {

    const [householdID, setHouseholdID] = useState<string>('');

    return (
        <HouseholdContext.Provider value={{ householdID, setHouseholdID }}>        
                        {children}    
        </HouseholdContext.Provider>
    )
}
