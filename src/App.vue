<template>
  <img alt="Vue logo" src="./assets/logo.png" />
</template>

<script>
// import { ref, reactive, watch } from "vue";
import useAuth from "./composables/use-auth";

export default {
  async setup() {
    const today = new Date();
    const timestamp = Date.now();
    const state = {
      accessToken: "",
      tokenType: "",
      expired: ""
    };

    if (localStorage.state) {
      const json = JSON.parse(localStorage.state);
      if (timestamp < json.expired) {
        state.accesstoken = json.access_token;
        state.tokenType = json.token_type;
      }
    } else {
      const authentication = await useAuth();
      if (authentication.error) {
        console.log("No access to the API");
      } else {
        state.accessToken = authentication.access_token;
        state.tokenType = authentication.token_type;
        state.expired = today.setDate(today.getDate() + 1);
        localStorage.state = JSON.stringify(state);
      }
    }
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
