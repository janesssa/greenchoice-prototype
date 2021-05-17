<template>
<Suspense>
  <template #default>
    <div id="app">
      <Layout></Layout>
    </div>
  </template>
  <template #fallback>
    <div>
      Loading...
    </div>
  </template>
</Suspense>
</template>

<script>
import { ref } from "vue";
import useLocalStorage from "./composables/use-localstorage";
import Layout from "./components/Layout"
// import useUserDate from "./composables/use-userdata";
// import useOptions from "./composables/use-options";
// export default {
//   async setup() {
//     await useLocalStorage();
//   },
// };

export default {
  name: "App",
  components: { Layout },
  setup() {
    const accessToken = ref(null)
    const expired = ref(null)
    const tokenType = ref(null)
    useLocalStorage().then((res) => {
      accessToken.value = res.accessToken, 
      expired.value = res.expired, 
      tokenType.value = res.tokenType
    });
    return {
      accessToken,
      expired,
      tokenType, 
    }
  }
};
</script>

<style>
#app {
  width: 376px;
  height: 812px;
  overflow: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: auto;
  margin-top: 60px;
}
</style>
