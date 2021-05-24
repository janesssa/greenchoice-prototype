import { useState } from "react";

export default function useFetch(url: RequestInfo, options: RequestInit ) {
  const [response, setResponse] = useState({});
  const [error, setError] = useState(null);

  const request = async () => {
    try {
      const res = await fetch(url, options);
      console.log(res);
      setResponse(res)
      const json = await res.json();
      setResponse(json)
    } catch (err) {
      console.log(response)
      setError(err)
    }
  };

  return { response, error, request };
}