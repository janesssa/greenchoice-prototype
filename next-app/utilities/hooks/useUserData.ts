import { useState } from 'react'
import useFetch from "./useFetch";
import useLocalStorage from "./useLocalstorage";

const useUserData: (householdID: string) => void = (householdID: string) => {
    console.info('Getting access token and requesting user profile data')

    const [fetching, setFetching] = useState(true)

    useLocalStorage().then(async state => {
        const { response, request } = useFetch(
            `${process.env.NEXT_APP_API_URL}profile/${householdID}}`,
            {
                method: "GET",
                headers: { Authorization: `${state.tokenType} ${state.accessToken}` }
            }
        );

        if (fetching) {
            await request();
            setFetching(false)
            console.log(JSON.parse(JSON.stringify(response)));
        }
    })
}

export default useUserData