import { ref } from "vue";
import useFetch from "./use-fetch";
import useLocalStorage from "./use-localstorage";
import { HOUSEHOLD_ID } from "../config";

export default function() {
  console.info('Getting access token and requesting user profile data')
  useLocalStorage().then(async state => {
    const fetching = ref(true);
    const { response, request } = useFetch(
      `${process.env.VUE_APP_API_URL}profile/${HOUSEHOLD_ID}`,
      {
        method: "GET",
        headers: { Authorization: `${state.tokenType} ${state.accessToken}` }
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
