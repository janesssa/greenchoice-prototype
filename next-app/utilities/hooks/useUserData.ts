import React, { useState } from 'react'
import { useHouseholdContext } from 'utilities/contexts/household-context';
import useFetch from "./useFetch";
import useLocalStorage from "./useLocalstorage";


const userData = () => {
    console.info('Getting access token and requesting user profile data')
    const { householdID } = useHouseholdContext()
    const [fetching, setFetching] = useState(true)

    const res: {} = useLocalStorage().then(async state => {
        const { response, request } = useFetch(
            `${process.env.NEXT_APP_API_URL}profile/${householdID}}`,
            {
                method: "GET",
                headers: { "Authorization": `Bearer ${useHouseholdContext().access_token}` }
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

export default userData