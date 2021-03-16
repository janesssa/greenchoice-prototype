/* eslint-disable @typescript-eslint/camelcase */
import { ref } from "vue";
import useFetch from "./use-fetch";
import { CLIENT_ID, CLIENT_SECRET } from "../config";

export default async function() {
  const fetching = ref(true);

  const { response: authentication, error, request } = useFetch(
    "https://api.onzo.io/oauth/token",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        audience: "https://api.onzo.com/engagement/"
      })
    }
  );

  if (fetching.value) {
    await request();
    fetching.value = true;
  }

  if (!error.value) {
    console.info('Succesfully requested the access token')
    return JSON.parse(JSON.stringify(authentication.value));
  }

  return { error };
}
