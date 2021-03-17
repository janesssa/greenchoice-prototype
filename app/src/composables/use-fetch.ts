import { ref } from "vue";

export default function(url: RequestInfo, options?: RequestInit | undefined) {
  console.info('Requesting information from:', url)

  const response = ref([]);
  const error = ref(null);

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
