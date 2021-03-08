export default function() {
  if(localStorage.state){
    const json = JSON.parse(localStorage.state);
    return json
  }

  return undefined
}
