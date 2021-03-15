<template>
<div>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h2>hoiz</h2>
  </div>
</template>

<script>
import useLocalStorage from "./composables/use-localstorage";
import useUserDate from "./composables/use-userdata";
export default {
  async setup() {
    // await useFetch("https://api.onzo.com/engagement/", {
    //   method: "OPTIONS",
    //   headers: {
    //     "Origin": "http://localhost:8080/",
    //     "Access-Control-Request-Method": "POST",
    //     "Access-Control-Request-Headers": "Content-Type, Authorization"
    //   }
    // });
    await useLocalStorage();
    useUserDate();
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
