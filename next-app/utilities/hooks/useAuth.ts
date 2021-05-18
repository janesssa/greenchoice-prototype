/* eslint-disable @typescript-eslint/camelcase */
import { useState } from "react"
import useFetch from "./useFetch";

export default async function() {
  const [fetching, setFetching] = useState(true);
  const { response: authentication, error, request } = useFetch(
    "https://api.onzo.io/oauth/token",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: "https://api.onzo.com/engagement/"
      })
    }
  );

  if (fetching) {
    await request();
    setFetching(false)
  }

  if (!error) {
    return JSON.parse(JSON.stringify(authentication));
  }

  return { error };
}