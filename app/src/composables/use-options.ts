import { ref } from "vue";
import useFetch from "./use-fetch";
import useLocalStorage from "./use-localstorage";

export default function(path: string) {
  console.info('Getting access token and requesting user data')
  useLocalStorage().then(async state => {
    const fetching = ref(true);
    const { response, request } = useFetch(
      `${process.env.VUE_APP_API_URL}${path}`,
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
}
