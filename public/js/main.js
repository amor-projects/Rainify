import getGeoLocation from "./get_geolocation.js";
import { currentLocation, weather } from "./utils.js";
import { renderRoot } from "./renderRoot.js";
import { renderRootSkeleton } from "./components.js";
import { errorPage } from "./errorPage.js";

const root = document.getElementById('root');
let weatherRequestId = 0;
let weatherController = null;

async function fetchWeather (locality) {
  const requestId = ++weatherRequestId;
  weatherController?.abort();
  weatherController = new AbortController();
  const location = locality.trim();
  if (!location) return;

  try {
    root.classList.remove('fade-out-slow');
    renderRootSkeleton();
    const response = await fetch(`/api/fetch_weather?location=${encodeURIComponent(location)}`, {
      signal: weatherController.signal
    });
    if (!response.ok) {
      const raw = await response.json().catch(() => ({}));
      const err = new Error(raw.error || response.statusText || 'Request failed');
      err.status = response.status;
      throw err;
    }
    const raw = await response.json();
    if (requestId !== weatherRequestId) return;
    currentLocation.locality = location;
    root.classList.add('fade-out-slow');
    weather.setWeather(raw.data);
    renderRoot(weather);
  } catch (error) {
    if (error.name === 'AbortError' || requestId !== weatherRequestId) return;
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
