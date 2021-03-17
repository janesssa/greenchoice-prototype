<template>
<div>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h2>hoiz</h2>
  </div>
</template>

<script>
import useLocalStorage from "./composables/use-localstorage";
import useUserDate from "./composables/use-userdata";
import useOptions from "./composables/use-options";
export default {
  async setup() {
    await useLocalStorage();
    useUserDate('profile');
    useUserDate('ownership');
    useOptions('consumption');
    useOptions('breakdown');
    useOptions('peer-group-stats');
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
