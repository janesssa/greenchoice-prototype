import { ref } from "vue";

export default function(url: RequestInfo, options?: RequestInit | undefined) {
  const response = ref([]);
  const error = ref(null);
  url = url.toString()
  if(!url.includes('localhost')){
    url.replace(/^[a-z]{4,5}:\/{2}[a-z]{3}\.[a-z]{4}\.[a-z]{2}\/[a-z]{1,}\/v2\/(.*)/, `https://api.onzo.io/engagement/v2/$1`)
  }
  console.log(url.includes('localhost'))
  const request = async () => {
    try {
      const res = await fetch(url, options);
      const json = await res.json();
      response.value = json;
    } catch (err) {
      error.value = err;
    }
  };

  return { response, error, request };
}
