import { useState } from "react";
import { useHouseholdContext } from "utilities/contexts/household-context"

export default function useFetch(url: RequestInfo, options = {
  method: "GET",
  headers: { Authorization: `Bearer ${useHouseholdContext().access_token}` }
}) {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);

  const request = async () => {
    try {
      const res = await fetch(url, options);
      const json = await res.json();
      setResponse(json)
    } catch (err) {
      setError(err)
    }
  };

  return { response, error, request };
}