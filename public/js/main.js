import getGeoLocation from "./get_geolocation.js";
import { currentLocation, weather } from "./utils.js";
import { renderRoot } from "./renderRoot.js";

async function fetchWeather (locality) {
  try {
    const response = await fetch (`/api/fetch_weather?location=${locality}`);
    if (!response.ok) {
      throw new Error (`Failed! due to ${response.message}`);
    } else {
      const raw = await response.json();
      const data = raw.data;
      weather.setWeather(data);
      renderRoot('today', weather);
    }
  } catch (error) {
    console.error (error.message);
  }
};
let loading = true;
while (loading) {
  if (getGeoLocation()) {
    fetchWeather(currentLocation.locality);
    loading = false;
    break;
  } else {
    setTimeout(() => {
      console.log ("Fetching Data!")
    }, 100);
  }
}

if (loading) {
  console.error ("Falling back to Default location Value due to slow or no internet")
  currentLocation.locality = "Multan";
  currentLocation.countryName = "Pakistan";
}

export {fetchWeather}
