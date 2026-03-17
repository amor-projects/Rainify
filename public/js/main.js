import getGeoLocation from "./get_geolocation.js";
import { currentLocation, weather } from "./utils.js";
import { renderRoot } from "./renderRoot.js";
import { renderRootSkeleton } from "./components.js";
import { errorPage } from "./errorPage.js";

const root = document.getElementById('root');
async function fetchWeather (locality) {
  try {
    root.classList.remove('fade-out-slow');
    renderRootSkeleton();
    const response = await fetch (`/api/fetch_weather?location=${locality}`);
    if (!response.ok) {
      const raw = await response.json().catch(() => ({}));
      const err = new Error(raw.error || response.statusText || 'Request failed');
      err.status = response.status;
      throw err;
    }
    root.classList.add('fade-out-slow');
    const raw = await response.json();
    weather.setWeather(raw.data);
    renderRoot(weather);
  } catch (error) {
    errorPage(error.status || 0, error.message);
  }
};

getGeoLocation()
  .then(() => fetchWeather(currentLocation.locality || currentLocation.city || currentLocation.countryName))
  .catch((error) => {
    fetchWeather(currentLocation.locality || 'London');
    console.log("Unable to Fetch Location due to ", error)
  }
  );


export {fetchWeather}
