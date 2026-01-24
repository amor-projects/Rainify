import getGeoLocation from "./get_geolocation.js";
import { currentLocation, weather } from "./utils.js";
import { renderRoot } from "./renderRoot.js";
import { renderRootSkeleton } from "./components.js";

const root = document.getElementById('root');
async function fetchWeather (locality) {
  try {
    root.classList.remove('fade-out-slow');
    renderRootSkeleton();
    const response = await fetch (`/api/fetch_weather?location=${locality}`);
    if (!response.ok) {
      throw new Error (`Failed! due to ${response.message}`);
    } else {
      root.classList.add('fade-out-slow')
      const raw = await response.json();
      const data = raw.data;
      weather.setWeather(data);
      renderRoot('today', weather);
    }
  } catch (error) {
    console.error (error.message);
  }
};

getGeoLocation()
  .then(() => fetchWeather(currentLocation.locality))
  .catch((error) => console.log("Unable to Fetch Location due to ", error)
  );


export {fetchWeather}
