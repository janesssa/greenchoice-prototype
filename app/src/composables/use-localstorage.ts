import useAuth from "./use-auth";

export default async function() {
  const today = new Date();
  const timestamp = Date.now();
  const state = {
    accessToken: "",
    tokenType: "",
    expired: 0
  };

  if (localStorage.getItem("state")) {
    const json = JSON.parse(localStorage.state);
    if (timestamp < json.expired) {
      state.accessToken = json.accessToken;
      state.tokenType = json.tokenType;
      state.expired = json.expired;
    }
  } else {
    useAuth().then(auth => {
      if (auth.error) {
        console.log("No access to the API");
      } else {
        state.accessToken = auth.access_token;
        state.tokenType = auth.token_type;
        state.expired = today.setDate(today.getDate() + 1);
        localStorage.setItem("state", JSON.stringify(state));
      }
    });
  }

  return state;
}
