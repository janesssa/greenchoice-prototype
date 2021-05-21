import React, { useState } from 'react'
import useFetch from "./useFetch";
import useLocalStorage from "./useLocalstorage";

export default function useUserData (householdID: string) {
    console.info('Getting access token and requesting user profile data')

    const [fetching, setFetching] = useState(true)

    const res = useLocalStorage().then(async state => {
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

        return { response }
    })

    return res
}