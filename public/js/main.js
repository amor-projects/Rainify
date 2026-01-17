import getGeoLocation from "./get_geolocation.js";
import { currentLocation } from "./utils.js";
import { renderToday } from "./renderDay.js";

async function fetchWeather (locality) {
  try {
    const response = await fetch (`http://localhost:3000/fetch_weather?location=${locality}`);
    if (!response.ok) {
      throw new Error (`Failed! due to ${response.message}`);
    } else {
      const data = await response.json();
      const weather = data.data;
      renderToday(weather);
    }
  } catch (error) {
    console.error (error.message);
  }
};
const loading = true;
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

