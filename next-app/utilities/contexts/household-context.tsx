import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'

type HouseholdType = {
    householdID: string,
    setHouseholdID: Dispatch<SetStateAction<string>>,
    access_token: string,
    setAccessToken: Dispatch<SetStateAction<string>>,
    response: {},
    setResponse: Dispatch<SetStateAction<{}>>,
    selection: string
    setSelection: Dispatch<SetStateAction<string>>,
}

export const HouseholdContext = createContext<HouseholdType>({
    householdID: '',
    setHouseholdID: null,
    access_token: '',
    setAccessToken: null,
    response: {},
    setResponse: null,
    selection: '',
    setSelection: null
})

export const useHouseholdContext = () => useContext(HouseholdContext)


export const HouseholdProvider = ({ children }) => {

    const [householdID, setHouseholdID] = useState<string>('');
    const [access_token, setAccessToken] = useState<string>('');
    const [response, setResponse] = useState<{}>({});
    const [selection, setSelection] = useState<string>('');

    return (
        <HouseholdContext.Provider value={{
            householdID,
            setHouseholdID,
            access_token,
            setAccessToken,
            response,
            setResponse,
            selection,
            setSelection
        }}>
            {children}
        </HouseholdContext.Provider>
    )
}
