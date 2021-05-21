import { useState } from "react";

export default function useFetch(url: RequestInfo, options?: RequestInit | undefined) {
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