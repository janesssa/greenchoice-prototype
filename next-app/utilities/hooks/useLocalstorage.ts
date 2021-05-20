import useAuth from "./useAuth";

export default async function() {
  const today = new Date();
  const timestamp = Date.now(); 
  const state = {
    accessToken: "",
    tokenType: "",
    expired: 0
  };

  console.info('Checking local storage for access token')
  if (localStorage.getItem("state") && timestamp < JSON.parse(localStorage.state).expired) {
    console.info('Succesfully found access token in local storage')
    const json = JSON.parse(localStorage.state);
    state.accessToken = json.accessToken;
    state.tokenType = json.tokenType;
    state.expired = json.expired;
  } else {
    console.info('Access token not available or expired - requesting it...')
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