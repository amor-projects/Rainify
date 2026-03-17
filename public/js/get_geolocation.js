import {currentLocation} from './utils.js';

const DEFAULT_LOCATION = {
  locality: 'London',
  city: 'London',
  countryName: 'England'
};

function applyFallbackLocation() {
  currentLocation.locality = DEFAULT_LOCATION.locality;
  currentLocation.city = DEFAULT_LOCATION.city;
  currentLocation.countryName = DEFAULT_LOCATION.countryName;
  return currentLocation;
}

const successLocation = async (position) => {
  const coords = position.coords;
  try {
    if (coords && coords.longitude && coords.latitude) {
      const LOCALITY_URL = `/api/get_locality?longitude=${coords.longitude}&latitude=${coords.latitude}`;
      const response = await fetch(LOCALITY_URL);
      if (!response.ok) {
        throw new Error (`Unable to get Location from ${coords}`);
      } else {
        const data = await response.json();
        currentLocation.locality = data.locality || data.city || data.countryName || DEFAULT_LOCATION.locality;
        currentLocation.city = data.city || data.locality || DEFAULT_LOCATION.city;
        currentLocation.countryName = data.countryName || DEFAULT_LOCATION.countryName;
      }
    } else {
      throw new Error("Invalid Coordinates Object!");
    }
  } catch (error) {
    console.error (error);
    console.error (`Unable to Get Location due to ${error.message} falling back to default location`);
    return applyFallbackLocation();
  }
  return currentLocation;
}

const failureLocation = (error) => {
  console.error(`Failed to get Location due to ${error.message}`)
  console.log("Falling back to default Location");
  return applyFallbackLocation();
}

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

async function getGeoLocation () {
  if ("geolocation" in navigator) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        resolve(await successLocation(position));
      }, (error) => {
        resolve(failureLocation(error));
      }, options);
    });
  } else {
    console.warn('Geolocation is not supported. Falling back to default location.');
    return applyFallbackLocation();
  }
}

export default getGeoLocation;