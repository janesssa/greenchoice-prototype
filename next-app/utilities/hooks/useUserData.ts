import React, { useState } from 'react'
import useAuth from 'utilities/hooks/useAuth';
import { useHouseholdContext } from 'utilities/contexts/household-context';
import useFetch from "./useFetch";

const userData = async () => {
    console.info('Getting access token and requesting user profile data')
    const { householdID } = useHouseholdContext()
    const [fetching, setFetching] = useState(true)

    const { response, error, request } = useFetch(
        `/api/engagement/v2/profile/${householdID}`,
        {
            method: "GET",
            headers: { "Authorization": `Bearer ${useHouseholdContext().access_token}` }
        }
    );

    if (fetching && householdID !== '') {
        await request().then(res => console.log(res)).catch(err => console.log(err));
        setFetching(false)
    }
    console.log(response, error)

    if(!error){
        return response
    }
    

    return { error }
}

export default userData