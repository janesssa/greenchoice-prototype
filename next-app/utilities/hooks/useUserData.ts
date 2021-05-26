import React, { useState } from 'react'
import useAuth from 'utilities/hooks/useAuth';
import { useHouseholdContext } from 'utilities/contexts/household-context';
import useFetch from "./useFetch";

const useUserData = async () => {
    console.info('Getting access token and requesting user profile data')
    const { householdID, access_token } = useHouseholdContext()
    const [fetching, setFetching] = useState(true)

    const { response, error, request } = useFetch(
        `/api/engagement/v2/profile/${householdID}`,
        {
            method: "GET",
            headers: { "Authorization": `Bearer ${access_token}` }
        }
    );

    if (fetching && householdID !== '') {
        await request().then(res => console.log(res)).catch(err => console.log(err));
        setFetching(false)
    }

    if(!error){
        return response
    }
    

    return { error }
}

export default useUserData