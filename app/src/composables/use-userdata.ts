import { ref } from "vue";
import useFetch from "./use-fetch";
import useLocalStorage from "./use-localstorage";
import useAuth from "./use-auth";
import { HOUSEHOLD_ID } from "../config";

export default function() {
  useAuth().then(async state => {
    const fetching = ref(true);
    const { response, request } = useFetch(
      `https://api.onzo.io/engagement/v2/profile/${HOUSEHOLD_ID}`,
      {
        method: "GET",
        headers: { Authorization: `${state.token_type} ${state.access_token}` }
      }
    );

    if (fetching.value) {
      await request();
      console.log(JSON.parse(JSON.stringify(response.value)));
    }
  });

  // const fetching = ref(true);
  // const { response: authentication, error, request } = useFetch(
  //     "https://api.onzo.io/engagement/v2/profile/$HOUSEHOLD_ID",
  //     {
  //     method: "GET",
  //     headers: { "Authorization: Bearer $TOKEN" },
  //     }
  // );

  // if (fetching.value) {
  //     await request();
  //     fetching.value = true;
  // }

  // if (!error.value) {
  //     return JSON.parse(JSON.stringify(authentication.value));
  // }

  // return { error };
}
